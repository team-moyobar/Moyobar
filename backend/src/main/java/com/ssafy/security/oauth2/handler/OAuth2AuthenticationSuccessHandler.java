package com.ssafy.security.oauth2.handler;

import com.ssafy.api.service.UserService;
import com.ssafy.common.exception.BadRequestException;
import com.ssafy.common.util.CookieUtils;
import com.ssafy.common.util.JwtTokenUtil;
import com.ssafy.config.AppConfig;
import com.ssafy.db.entity.user.User;
import com.ssafy.db.repository.user.UserRepository;
import com.ssafy.security.UserPrincipal;
import com.ssafy.security.oauth2.HttpCookieOAuth2AuthorizationRequestRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.util.*;

/**
 * 소셜 로그인 인증 성공 시 호출
 * JWT authentication token 생성(기본 회원가입,로그인의 JWT 생성방식과 동일한 방식 사용)
 */

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final AppConfig appConfig;
    private final HttpCookieOAuth2AuthorizationRequestRepository httpCookieOAuth2AuthorizationRequestRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    UserService userService;

    //성공 시 작동
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        String targetUrl;

        log.info("request 정보 getAuthType: '{}'", request.getAuthType());
        log.info("request 정보 getRequestURI: '{}'", request.getRequestURI());
        log.info("request 정보 getUserPrincipal: '{}'", request.getUserPrincipal());
        log.info("request 정보 getSession: '{}'", request.getSession());
        log.info("request 정보 getQueryString: '{}'", request.getQueryString());

        log.info("response 정보 getHeaderNames: '{}'", response.getHeaderNames());
        log.info("response 정보 getStatus: '{}'", response.getStatus());
        log.info("response 정보 getContentType: '{}'", response.getContentType());

        log.info("authentication 정보: '{}'", authentication.toString()); //UserPrincipal안에 User 정보 있음

        //UserPrincipal로부터 회원정보 얻어오기-고유ID, 이메일, 닉네임 정보
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        log.info("userPrincipal '{}' : ", userPrincipal.getAttributes());
        String userId = userPrincipal.getUserId();
        log.info("userId(이메일): {}", userId);

        //이미 소셜 로그인으로 가입한 회원이 있다면 token 발급 후
        if(userRepository.existsByUserId(userId)){
            //최초 로그인 여부 세팅
            User user = userService.getUserByUserId(userId);

            boolean first = user.getFirst() == 0;

            if (first) {
                user.setFirst(1);
                userService.updateUser(user);
            }

            //로비 창으로 넘어가기(지정해두었던 redirect uri로 이동)
            targetUrl = determineTargetUrl(request, response, authentication);

            //cookie로 token 넘기기
            String token = JwtTokenUtil.getToken(userPrincipal.getUserId()); //email정보로 token생성
            CookieUtils.addCookie(response, "token", token,180);
            log.info("token: "+token);
        }else{ //회원가입창으로 redirect
            //소셜 로그인으로부터 받아온 User정보를 cookie로 넘기기
            if(request.getRequestURI().contains("google")){ //구글 로그인 시
                CookieUtils.addCookie(response, "social_user_nick", URLEncoder.encode(userPrincipal.getAttributes().get("given_name").toString(),"UTF-8"), 180);
                CookieUtils.addCookie(response, "provider_type", "GOOGLE", 180);
            }else if(request.getRequestURI().contains("kakao")){ //카카오 로그인 시
                CookieUtils.addCookie(response, "social_user_nick", URLEncoder.encode(((Map<String, Object>)userPrincipal.getAttributes().get("properties")).get("nickname").toString(), "UTF-8"), 180);
                CookieUtils.addCookie(response, "provider_type", "KAKAO", 180);
            }

            CookieUtils.addCookie(response, "social_user_email", userId,180); //이메일

            targetUrl = "https://i6d210.p.ssafy.io/social-signup"; //소셜 회원가입창으로 넘어가기
        }

        if (response.isCommitted()) {
            log.debug("Response has already been committed. Unable to redirect to " + targetUrl);
            return;
        }

        //httpCookieOAuth2AuthorizationRequestRepository에 저장해두었었던 cookie 정보들 삭제-redirect_uri 등
        clearAuthenticationAttributes(request, response); //위치 주의

        log.info("request uri: {}", request.getRequestURI());

        //리다이렉트
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    //redirect 할 url 설정
    protected String determineTargetUrl(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        //cookie에 저장한 redirect_url값 가져오기
        Optional<String> redirectUri = CookieUtils.getCookie(request,HttpCookieOAuth2AuthorizationRequestRepository.REDIRECT_URI_PARAM_COOKIE_NAME).map(Cookie::getValue);
        log.info("리다이렉트 uri: {}", redirectUri);

        //접근 허용 불가인 Redirect URI의 경우에 수행
        if (redirectUri.isPresent() && !isAuthorizedRedirectUri(redirectUri.get())) {
            throw new BadRequestException(
                    "Sorry! We've got an Unauthorized Redirect URI and can't proceed with the authentication");
        }

        return redirectUri.orElse(getDefaultTargetUrl());
    }

    //redirect_url 통해 정상적으로 소셜 로그인 이후의 화면으로 넘어갈 시, httpCookieOAuth2AuthorizationRequestRepository에 저장해두었던 request cookie 정보 삭제하기
    protected void clearAuthenticationAttributes(HttpServletRequest request, HttpServletResponse response) {
        super.clearAuthenticationAttributes(request);
        httpCookieOAuth2AuthorizationRequestRepository.removeAuthorizationRequestCookies(request, response);
    }

    //해당 URI가 접근 가능한 URI인지 여부 판단
    private boolean isAuthorizedRedirectUri(String uri) {
        URI clientRedirectUri = URI.create(uri);

        return appConfig.getAuthorizedRedirectUris().stream().anyMatch(authorizedRedirectUri -> {
            // Only validate host and port. Let the clients use different paths if they want to
            URI authorizedURI = URI.create(authorizedRedirectUri);
            if (authorizedURI.getHost().equalsIgnoreCase(clientRedirectUri.getHost())
                    && authorizedURI.getPort() == clientRedirectUri.getPort()) {
                return true;
            }
            return false;
        });
    }
}

