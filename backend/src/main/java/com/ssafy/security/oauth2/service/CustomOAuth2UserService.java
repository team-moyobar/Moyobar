package com.ssafy.security.oauth2.service;

import com.ssafy.db.entity.user.Drink;
import com.ssafy.db.repository.user.DrinkRepository;
import com.ssafy.db.repository.user.UserRepository;
import com.ssafy.db.entity.user.User;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.AuthenticationException;

import org.springframework.security.crypto.password.PasswordEncoder;
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
    private final DrinkRepository drinkRepository;

    @Value("${moyobar.profile.default}")
    private String DEFAULT_PATH;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest oAuth2UserRequest) throws OAuth2AuthenticationException {
        log.info("소셜로부터 받은 userRequest 데이터 확인: '{}'");

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

        //소셜로부터 받아온 사용자 정보
        OAuth2UserInfo oAuth2UserInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(providerType, oAuth2User.getAttributes());
        log.info("유저정보: {}", oAuth2UserInfo.getAttributes().toString()); //고유 ID, 이메일, 닉네임, 스코프 정보 등등

        if (StringUtils.isEmpty(oAuth2UserInfo.getUserId())) {
            throw new OAuth2AuthenticationProcessingException("Email not found from OAuth2 provider");
        }

        Optional<User> userOptional = userRepository.findByUserId((oAuth2UserInfo.getUserId())); //nn막기 위한 Optional 클래스
        User user = null;

        //이미 소셜회원인 경우
        if (userOptional.isPresent()) {
            user = userOptional.get();

            log.info("우리회원");
            log.info("회원 아이디: {}, 회원 닉네임: {}",user.getUserId(),user.getNickname());

            //이미 해당 이메일계정으로 일반 회원가입한 적이 있을 시
            if (user.getType() != providerType) {
                throw new OAuth2AuthenticationProcessingException(
                        "Looks like you're signed up with " + providerType + " account. Please use your " + user.getType() + " account to login.");
            }

            updateExistingUser(user, oAuth2UserInfo); //소셜로그인으로 받아온 닉네임정보 바뀐 것이 있다면 바꿔주기
        }else { //아닌 경우
            log.info("우리회원x-회원가입 필요");

            user = createUser(oAuth2UserRequest, oAuth2UserInfo);
        }

        return UserPrincipal.create(user, oAuth2User.getAttributes());
    }

    //소셜로부터 받아온 회원 정보만으로 회원가입
    private User createUser(OAuth2UserRequest oAuth2UserRequest, OAuth2UserInfo oAuth2UserInfo){
        log.info("Register new user {}", oAuth2UserInfo.getUserId());

        User user = new User();

        user.setUserId(oAuth2UserInfo.getUserId()); //사용자 이메일
        user.setNickname(oAuth2UserInfo.getNickname()); //사용자 이름
        user.setType(
                ProviderType.valueOf(oAuth2UserRequest.getClientRegistration().getRegistrationId().toUpperCase())); //타입 지정
        Drink drink = new Drink();
        user.setDrink(drink); //User table에 반영
        user.setImg(DEFAULT_PATH); //디폴트 이미지 추가

        return userRepository.save(user); //db에 회원가입 완료
    }

    //update 회원 - 이미 우리 회원인 사람
    private User updateExistingUser(User existingUser, OAuth2UserInfo oAuth2UserInfo) {
        log.info("update user {}", oAuth2UserInfo.getUserId());
        //소셜에서 닉네임 변경된 유저의 경우 닉네임 변경해주기
        existingUser.setNickname(oAuth2UserInfo.getNickname());
        User user = userRepository.save(existingUser);
        log.info("유저정보:{}", user);
        return user;
    }
}
