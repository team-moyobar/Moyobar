package com.ssafy.security.oauth2.service;

import com.ssafy.db.repository.UserRepository;
import com.ssafy.db.entity.User;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.AuthenticationException;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.AuthenticationException;
import com.ssafy.security.oauth2.user.OAuth2UserInfo;
import com.ssafy.security.oauth2.user.OAuth2UserInfoFactory;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;

import com.ssafy.security.UserPrincipal;

import java.util.Optional;

import com.ssafy.common.exception.OAuth2AuthenticationProcessingException;
import com.ssafy.security.oauth2.entity.ProviderType;

/*
* 소셜로그인용 실질적 로직 처리위한 Service 클래스-얻어온 회원정보를 DB에 INSERT
 */
@Slf4j //로깅용
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest oAuth2UserRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(oAuth2UserRequest);

        //Client로부터 받아온 request 헤더의 access token값이 유효한지 여부에 따라 DB접근 성공/실패
        try {
            return processOAuth2User(oAuth2UserRequest, oAuth2User);
        } catch (AuthenticationException ex) {
            throw ex;
        } catch (Exception ex) {
            // Throwing an instance of AuthenticationException will trigger the
            // OAuth2AuthenticationFailureHandler
            throw new InternalAuthenticationServiceException(ex.getMessage(), ex.getCause());
        }
    }

    //허가된 사용자인가?
    private OAuth2User processOAuth2User(OAuth2UserRequest oAuth2UserRequest, OAuth2User oAuth2User) {
        ProviderType providerType = ProviderType.valueOf(oAuth2UserRequest.getClientRegistration().getRegistrationId().toUpperCase());

        OAuth2UserInfo oAuth2UserInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(providerType, oAuth2User.getAttributes());

        if (StringUtils.isEmpty(oAuth2UserInfo.getId())) {
            throw new OAuth2AuthenticationProcessingException("Email not found from OAuth2 provider");
        }

        Optional<User> userOptional = userRepository.findByUserId((oAuth2UserInfo.getId()));
        User user;

        //user정보가 이미 회원가입 되어있다! 이미 소셜회원가입 했던 사람임
        if (userOptional.isPresent()) {
            user = userOptional.get();

            //이미 회원가입된 유저
            if (!user.getType().equals(ProviderType.valueOf(oAuth2UserRequest.getClientRegistration().getRegistrationId()))) {
                throw new OAuth2AuthenticationProcessingException(
                        "Looks like you're signed up with " + user.getType() + " account. Please use your "
                                + user.getType() + " account to login.");
            }
            user = updateExistingUser(user, oAuth2UserInfo);
        } else {
            user = registerNewUser(oAuth2UserRequest, oAuth2UserInfo);
        }

        //그게 아니라면 지금 즉시 회원가입
        return UserPrincipal.create(user, oAuth2User.getAttributes());
    }

    //create 회원-회원가입
    private User registerNewUser(OAuth2UserRequest oAuth2UserRequest, OAuth2UserInfo oAuth2UserInfo) {
        log.info("Register new user {}", oAuth2UserInfo.getId());

        User user = new User();

        user.setType(
                ProviderType.valueOf(oAuth2UserRequest.getClientRegistration().getRegistrationId()));
//        user.setProviderId(oAuth2UserInfo.getId()); //??providerid 필요 없으므로 삭제
        user.setNickname(oAuth2UserInfo.getName()); //사용자 이름
        user.setUserId(oAuth2UserInfo.getId()); //사용자 이메일
        //user.setImageUrl(oAuth2UserInfo.getProfile()); //프로필 사진-회원가입 시  필요없으므로 일단 안 받아옴
        return userRepository.save(user); //db에 회원가입 완료
    }

    //update 회원
    private User updateExistingUser(User existingUser, OAuth2UserInfo oAuth2UserInfo) {
        log.info("update user {}", oAuth2UserInfo.getId());

        existingUser.setNickname(oAuth2UserInfo.getName());
//        existingUser.setImageUrl(oAuth2UserInfo.getImageUrl());
        return userRepository.save(existingUser);
    }
}

