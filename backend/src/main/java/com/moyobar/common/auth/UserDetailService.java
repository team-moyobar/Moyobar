package com.moyobar.common.auth;

import com.moyobar.common.exception.UserNotFoundException;
import com.moyobar.db.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import com.moyobar.db.entity.user.User;

/**
 * 현재 액세스 토큰으로 부터 인증된 유저의 상세정보(활성화 여부, 만료, 롤 등) 관련 서비스 정의.
 * Authentication 객체에 들어가는 정보
 * 시큐리티 설정에서 요청이 오면 자동으로 UserDetailsService타입으로 IoC되어 있는 loadUserByUsername함수 실행됨
 */
@Component
@RequiredArgsConstructor
public class UserDetailService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public org.springframework.security.core.userdetails.UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        User user = userRepository.findByUserId(userId).orElseThrow(UserNotFoundException::new);
        UserDetails userDetails = new UserDetails(user);
        return userDetails;
    }
}