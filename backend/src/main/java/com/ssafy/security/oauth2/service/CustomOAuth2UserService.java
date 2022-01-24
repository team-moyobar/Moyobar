package com.ssafy.security.oauth2.service;

import com.ssafy.db.repository.UserRepository;
import com.ssafy.db.entity.User;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.AuthenticationException;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.ssafy.security.oauth2.user.OAuth2UserInfo;
import com.ssafy.security.oauth2.user.OAuth2UserInfoFactory;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;

import com.ssafy.security.UserPrincipal;

import java.util.Optional;

import com.ssafy.security.oauth2.exception.OAuth2AuthenticationProcessingException;
import com.ssafy.security.oauth2.entity.ProviderType;

/*
* 소셜로그인용 실질적 로직 처리위한 Service 클래스-얻어온 회원정보를 DB에 UPDATE OR INSERT
*/

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest oAuth2UserRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(oAuth2UserRequest);

        try {
            return processOAuth2User(oAuth2UserRequest, oAuth2User);
        } catch (AuthenticationException ex) {
            throw ex;
        } catch (Exception ex) {
            // Throwing an instance of AuthenticationException will trigger the OAuth2AuthenticationFailureHandler
            throw new InternalAuthenticationServiceException(ex.getMessage(), ex.getCause());
        }
    }

    private OAuth2User processOAuth2User(OAuth2UserRequest oAuth2UserRequest, OAuth2User oAuth2User) {
        ProviderType providerType = ProviderType.valueOf(oAuth2UserRequest.getClientRegistration().getRegistrationId().toUpperCase());

        OAuth2UserInfo oAuth2UserInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(providerType, oAuth2User.getAttributes());

        if (StringUtils.isEmpty(oAuth2UserInfo.getUserId())) {
            throw new OAuth2AuthenticationProcessingException("Email not found from OAuth2 provider");
        }

        Optional<User> userOptional = userRepository.findByUserId((oAuth2UserInfo.getUserId())); //nn막기 위한 Optional 클래스
        User user;

        if (userOptional.isPresent()) {
            user = userOptional.get();

            //이미 다른 소셜 계정으로 가입한 적이 있을 시
            if (user.getType() != providerType) {
                throw new OAuth2AuthenticationProcessingException(
                        "Looks like you're signed up with " + providerType + " account. Please use your " + user.getType() + " account to login.");
            }
            user = updateExistingUser(user, oAuth2UserInfo);
        } else {
            user = registerNewUser(oAuth2UserRequest, oAuth2UserInfo);
        }

        return UserPrincipal.create(user, oAuth2User.getAttributes());
    }

    //소셜 회원가입
    private User registerNewUser(OAuth2UserRequest oAuth2UserRequest, OAuth2UserInfo oAuth2UserInfo) {
        log.info("Register new user {}", oAuth2UserInfo.getUserId());

        User user = new User();

        user.setType(
                ProviderType.valueOf(oAuth2UserRequest.getClientRegistration().getRegistrationId().toUpperCase()));
        user.setNickname(oAuth2UserInfo.getNickname()); //사용자 이름
        user.setUserId(oAuth2UserInfo.getUserId()); //사용자 이메일

        return userRepository.save(user); //db에 회원가입 완료
    }

    //update 회원
    private User updateExistingUser(User existingUser, OAuth2UserInfo oAuth2UserInfo) {
        log.info("update user {}", oAuth2UserInfo.getUserId());
        //소셜에서 닉네임 변경된 유저의 경우 닉네임 변경해주기
        existingUser.setNickname(oAuth2UserInfo.getNickname());
        return userRepository.save(existingUser);
    }
}

