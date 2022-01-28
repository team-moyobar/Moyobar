package com.ssafy.security.oauth2.user;

import java.util.Map;

/**
 * 소셜로그인 위한 OAuth2용 User 클래스
 * provider(google, kakao)별로 사용자 정보제공서버(resource server)로부터 얻게 되는 회원정보에 대한 값
 */

public abstract class OAuth2UserInfo {
  protected Map<String, Object> attributes;

  public OAuth2UserInfo(Map<String, Object> attributes) {
    this.attributes = attributes;
  }

  public Map<String, Object> getAttributes() {
    return attributes;
  }

  public abstract String getUserId(); // user_id(사용자 email) 값 반환

  public abstract String getNickname(); // nickname 값 반환
}
