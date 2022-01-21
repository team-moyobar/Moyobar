package com.ssafy.security.oauth2.user;

import java.util.Map;

//구글로부터 얻어올 UserInfo : email, name 정보
public class GoogleOAuth2UserInfo extends OAuth2UserInfo {

    public GoogleOAuth2UserInfo(Map<String, Object> attributes) {
        super(attributes);
    }

    @Override
    public String getId() {
        return (String) attributes.get("email");
    }

    @Override
    public String getName() {
        return (String) attributes.get("name");
    }
//    @Override
//    public String getEmail() {
//        return (String) attributes.get("email");
//    }
//
//    @Override
//    public String getImageUrl() {
//        return (String) attributes.get("picture");
//    }
}
