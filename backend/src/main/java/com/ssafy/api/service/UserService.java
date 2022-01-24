package com.ssafy.api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ssafy.api.request.UserRegisterPostReq;
import com.ssafy.api.response.UserRes;
import com.ssafy.db.entity.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.List;
import com.ssafy.db.repository.UserRepository;
import com.ssafy.db.repository.UserRepositorySupport;

import java.util.Optional;

/**
 *   유저 관련 비즈니스 로직 처리를 위한 서비스 구현 정의.
 */
@Service
public interface UserService {


	User createUser(UserRegisterPostReq userRegisterInfo);

	User updateUser(User user);

	boolean idDuplicated(String userId);

	boolean nicknameDuplicated(String nickname);

	void addUserOnline(String userId);

	List<UserRes> getUsersOnlineList();

	User getUserByUserId(String userId);
}
