package com.ssafy.api.service;

import com.ssafy.api.request.UserRegisterPostReq;
import com.ssafy.api.response.UserRes;
import com.ssafy.db.entity.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.List;

/**
 * 유저 관련 비즈니스 로직 처리를 위한 서비스 인터페이스 정의.
 */
public interface UserService {
    User createUser(UserRegisterPostReq userRegisterInfo);

    User getUserByUserId(String userId);

    User updateUser(User user);

    boolean idDuplicated(String userId);

    boolean nicknameDuplicated(String nickname);

    UserDetails loadUserByUsername(String email) throws UsernameNotFoundException;

    void addUserOnline(String userId); // 온라인 유저 추가
    
    List<UserRes> getUsersOnlineList(); // 온라인 유저 리스트 반환
}