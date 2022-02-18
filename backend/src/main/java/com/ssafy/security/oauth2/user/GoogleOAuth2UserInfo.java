package com.ssafy.security.oauth2.user;

import lombok.extern.slf4j.Slf4j;

import java.util.Map;

/*
* 구글로부터 얻어올 사용자 정보 정의 클래스
*/

@Slf4j
public class GoogleOAuth2UserInfo extends OAuth2UserInfo {
    public GoogleOAuth2UserInfo(Map<String, Object> attributes) {
        super(attributes);
    }

    @Override
    public String getUserId() {
        /**
         * 구글로부터 얻어온 사용자 정보
         * {sub=고유번호, name=풀네임, given_name=이름, family_name=성, picture=프로필사진 url, email=google@gmail.com, email_verified=true, locale=ko}
         */
        log.info("Google UserInfo");
        log.info("google 사용자 정보: {}", attributes);

        return (String) attributes.get("email");
    }

    @Override
    public String getNickname() {
        return (String) attributes.get("given_name");
    }
}
