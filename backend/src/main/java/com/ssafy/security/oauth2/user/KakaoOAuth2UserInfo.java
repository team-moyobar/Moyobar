package com.ssafy.security.oauth2.user;

import java.util.Map;

/**
* 카카오로부터 얻어올 사용자 정보 정의 클래스
*/

public class KakaoOAuth2UserInfo extends OAuth2UserInfo {
    public KakaoOAuth2UserInfo(Map<String, Object> attributes) {
        super(attributes);
    }

    //사용자 이메일 정보
    @Override
    public String getUserId() {
        /**
         * 카카오로부터 얻어온 사용자 정보
        * Name: [2085953074],
        * Granted Authorities: [[ROLE_USER, SCOPE_account_email, SCOPE_birthday, SCOPE_profile_image, SCOPE_profile_nickname]],
        * User Attributes: [{id=2085953074, connected_at=2022-01-19T09:21:39Z, properties={nickname=허유진}, kakao_account={profile_nickname_needs_agreement=false, profile={nickname=유진YJ}, has_email=true, email_needs_agreement=false, is_email_valid=true, is_email_verified=true, email=laura707@naver.com}}]
        */
        for (String key: attributes.keySet()){
            System.out.println("Kakao UserInfo");
            System.out.println("<k,v>: " + key+ " = " + attributes.get(key));
        }

        Map<String, Object> kakao_account = (Map<String, Object>) attributes.get("kakao_account");

        return (String)kakao_account.get("email");
    }

    //사용자 닉네임 정보
    @Override
    public String getNickname() {
        Map<String, Object> kakao_account = (Map<String, Object>) attributes.get("kakao_account");

        if (kakao_account == null) {
            return null;
        }

        Map<String, Object> nickname = (Map<String, Object>) kakao_account.get("profile");

        return (String) nickname.get("nickname");
    }
}
