package com.ssafy.security.oauth2.handler;

import com.ssafy.api.service.UserService;
import com.ssafy.common.exception.BadRequestException;
import com.ssafy.common.util.CookieUtils;
import com.ssafy.common.util.JwtTokenUtil;
import com.ssafy.config.AppConfig;
import com.ssafy.security.UserPrincipal;
import com.ssafy.security.oauth2.HttpCookieOAuth2AuthorizationRequestRepository;
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
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    @Autowired
    private AppConfig appConfig;
    @Autowired
    private HttpCookieOAuth2AuthorizationRequestRepository httpCookieOAuth2AuthorizationRequestRepository;
    @Autowired
    private UserService userService;

    //성공 시 작동
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        String targetUrl = determineTargetUrl(request, response, authentication);

        log.info("request 정보 getAuthType: '{}'", request.getAuthType());
        log.info("request 정보 getRequestURI: '{}'", request.getRequestURI());
        log.info("request 정보 getUserPrincipal: '{}'", request.getUserPrincipal());
        log.info("authentication 정보: '{}'", authentication.toString()); //UserPrincipal안에 User 정보 있음

        if (response.isCommitted()) {
            log.debug("Response has already been committed. Unable to redirect to " + targetUrl);
            return;
        }

        //UserPrincipal로부터 회원정보 얻어오기-고유ID, 이메일, 닉네임 정보
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        log.info("userPrincipal '{}' : ", userPrincipal.getAttributes());
        String userId = userPrincipal.getUserId();
        log.info("userId(이메일): {}", userId);

        //httpCookieOAuth2AuthorizationRequestRepository에 저장해두었었던 cookie 정보들 삭제-redirect_uri 등
        clearAuthenticationAttributes(request, response); //위치 주의

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

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        log.info("userPrincipal '{}' : ", userPrincipal.getAttributes());
        String userId = userPrincipal.getUserId();
        log.info("userId(이메일): {}", userId);

        //cookie로 token 넘기기
        String token = JwtTokenUtil.getToken(userPrincipal.getUserId()); //email정보로 token생성
        String nickname="";
        CookieUtils.addCookie(response, "jwtToken", token,180);
        if(request.getRequestURI().contains("google")){
            nickname = URLEncoder.encode(userPrincipal.getAttributes().get("given_name").toString());
        }else if(request.getRequestURI().contains("kakao")){
            nickname = URLEncoder.encode(((Map<String, Object>)userPrincipal.getAttributes().get("properties")).get("nickname").toString());
        }
        CookieUtils.addCookie(response, "nickname", nickname,180);

        // 로그인한 사용자 목록 추가
        userService.addUserOnline(userId);

        log.info("nickname: {}", nickname);
        log.info("jwtToken: {}", token);

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

