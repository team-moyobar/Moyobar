package com.moyobar.security.oauth2.entity;

import lombok.Getter;

/**
 *
 *  Provider(소셜 로그인 공급자) 타입 정의 클래스
 */

@Getter
public enum ProviderType {
    GOOGLE,
    KAKAO,
    LOCAL;
}
