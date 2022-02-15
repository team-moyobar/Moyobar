package com.ssafy.common.auth;

import com.ssafy.api.service.UserService;
import com.ssafy.common.exception.UserNotFoundException;
import com.ssafy.db.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import com.ssafy.db.entity.user.User;

/**
 * 현재 액세스 토큰으로 부터 인증된 유저의 상세정보(활성화 여부, 만료, 롤 등) 관련 서비스 정의.
 * Authentication 객체에 들어가는 정보
 * 시큐리티 설정에서 요청이 오면 자동으로 UserDetailsService타입으로 IoC되어 있는 loadUserByUsername함수 실행됨
 */
@Component
@RequiredArgsConstructor
public class SsafyUserDetailService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        User user = userRepository.findByUserId(userId).orElseThrow(UserNotFoundException::new);
        SsafyUserDetails userDetails = new SsafyUserDetails(user);
        return userDetails;
    }
}