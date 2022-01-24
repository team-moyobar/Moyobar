package com.ssafy.security.oauth2.handler;

import com.ssafy.common.exception.BadRequestException;
import com.ssafy.common.util.CookieUtils;
import com.ssafy.common.util.JwtTokenUtil;
import com.ssafy.config.AppConfig;
import com.ssafy.security.UserPrincipal;
import com.ssafy.security.oauth2.HttpCookieOAuth2AuthorizationRequestRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URI;
import java.util.Optional;

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

    //성공 시 작동
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        String targetUrl = determineTargetUrl(request, response, authentication);
        if (response.isCommitted()) {
            log.debug("Response has already been committed. Unable to redirect to " + targetUrl);
            return;
        }

        //httpCookieOAuth2AuthorizationRequestRepository에 저장해두었었던 cookie 정보들 삭제
        clearAuthenticationAttributes(request, response);

        //리다이렉트
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    //redirect 할 url 설정
    protected String determineTargetUrl(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        //cookie에 저장한 redirect_url값 가져오기
        Optional<String> redirectUri = CookieUtils.getCookie(request,HttpCookieOAuth2AuthorizationRequestRepository.REDIRECT_URI_PARAM_COOKIE_NAME).map(Cookie::getValue);

        //접근 허용 불가인 Redirect URI의 경우에 수행
        if (redirectUri.isPresent() && !isAuthorizedRedirectUri(redirectUri.get())) {
            throw new BadRequestException(
                    "Sorry! We've got an Unauthorized Redirect URI and can't proceed with the authentication");
        }

        String targetUrl = redirectUri.orElse(getDefaultTargetUrl());

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        //일반 로그인,회원가입과는 다르게 소셜 로그인은 queryParam 형태로 token 보내기
        String token = JwtTokenUtil.getToken(userPrincipal.getUserId());
        return UriComponentsBuilder.fromUriString(targetUrl).queryParam("token", token).build().toUriString();
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

