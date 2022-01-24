package com.ssafy.security.oauth2.user;

import java.util.Map;

/*
* 구글로부터 얻어올 사용자 정보 정의 클래스
*/

public class GoogleOAuth2UserInfo extends OAuth2UserInfo {
    public GoogleOAuth2UserInfo(Map<String, Object> attributes) {
        super(attributes);
    }

    @Override
    public String getUserId() {
        /**
         * 구글로부터 얻어온 사용자 정보
         * {sub=114074772856782388724, name=허유진, given_name=유진, family_name=허, picture=https://lh3.googleusercontent.com/a-/AOh14GgONdiqkhzAfsgBPC69QSuwj9sBw7NHa-KxY5jcFg=s96-c, email=huryoojin707@gmail.com, email_verified=true, locale=ko}
         */
        System.out.println("Google UserInfo");
        System.out.println(attributes);

        return (String) attributes.get("email");
    }

    @Override
    public String getNickname() {
        return (String) attributes.get("name");
    }
}
