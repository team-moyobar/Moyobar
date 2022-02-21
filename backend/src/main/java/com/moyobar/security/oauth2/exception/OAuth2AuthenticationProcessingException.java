package com.moyobar.security.oauth2.exception;

import org.springframework.security.core.AuthenticationException;

/*
 * 소셜 로그인 과정-CustomOAuth2UserService 작업 처리 중에 예외발생 시 호출되는 클래스
 */
public class OAuth2AuthenticationProcessingException extends AuthenticationException {
    public OAuth2AuthenticationProcessingException(String msg, Throwable t) {
        super(msg, t);
    }

    public OAuth2AuthenticationProcessingException(String msg) {
        super(msg);
    }
}