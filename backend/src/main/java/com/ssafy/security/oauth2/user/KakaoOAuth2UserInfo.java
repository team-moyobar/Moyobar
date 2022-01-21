package com.ssafy.security.oauth2.user;

import java.util.Map;

//카카오로부터 얻어올 사용자 정보: account_email, nickname
public class KakaoOAuth2UserInfo extends OAuth2UserInfo {

    public KakaoOAuth2UserInfo(Map<String, Object> attributes) {
        super(attributes);
    }

    //모여BAR서비스는 user_id가 유저 이메일 정보이므로 get("account_email")
    @Override
    public String getId() {
        return attributes.get("account_email").toString();
    }

    @Override
    public String getName() {
        Map<String, Object> properties = (Map<String, Object>) attributes.get("properties");

        if (properties == null) {
            return null;
        }

        return (String) properties.get("nickname");
    }

//    @Override
//    public String getEmail() {
//        return (String) attributes.get("account_email");
//    }
//
//    @Override
//    public String getImageUrl() {
//        Map<String, Object> properties = (Map<String, Object>) attributes.get("properties");
//
//        if (properties == null) {
//            return null;
//        }
//
//        return (String) properties.get("thumbnail_image");
//    }
}
