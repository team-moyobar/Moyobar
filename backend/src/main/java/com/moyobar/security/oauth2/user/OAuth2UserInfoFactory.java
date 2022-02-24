package com.moyobar.security.oauth2.user;

import java.util.Map;

import com.moyobar.security.oauth2.entity.ProviderType;

/*
* providerType(구글, 카카오)에 따라 각기 다른 User 정보를 얻어오기 위한 Factory 클래스
 */

public class OAuth2UserInfoFactory {
  public static OAuth2UserInfo getOAuth2UserInfo(ProviderType providerType, Map<String, Object> attributes) {
      switch (providerType) {
        case GOOGLE: return new GoogleOAuth2UserInfo(attributes); //구글로부터 유저 정보 얻어오기
        case KAKAO: return new KakaoOAuth2UserInfo(attributes); //카카오로부터 유저 정보 얻어오기
        default: throw new IllegalArgumentException("Invalid Provider Type.");
      }
  }
}
