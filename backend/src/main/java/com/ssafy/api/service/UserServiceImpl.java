package com.ssafy.api.service;

import com.ssafy.common.exception.ErrorCode;
import com.ssafy.common.exception.InvalidValueException;
import com.ssafy.api.request.UserUpdatePutReq;
import com.ssafy.security.UserPrincipal;
import com.ssafy.security.oauth2.entity.ProviderType;
import lombok.extern.slf4j.Slf4j;
import com.ssafy.api.response.UserRes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ssafy.api.request.UserRegisterPostReq;
import com.ssafy.db.entity.User;
import com.ssafy.db.repository.UserRepository;
import com.ssafy.db.repository.UserRepositorySupport;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * 유저 관련 비즈니스 로직 처리를 위한 서비스 구현 정의.
 */
@Slf4j //log함수용
@Service("userService")
public class UserServiceImpl implements UserService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    UserRepositorySupport userRepositorySupport;

    @Autowired
    PasswordEncoder passwordEncoder;

    // 온라인 유저 리스트
    ArrayList<String> userOnlineList = new ArrayList<>();

	@Override
	public User createUser(UserRegisterPostReq userRegisterInfo) {
		User user = new User();
		user.setUserId(userRegisterInfo.getUserId());
		// 보안을 위해서 유저 패스워드 암호화 하여 디비에 저장.
		user.setPassword(passwordEncoder.encode(userRegisterInfo.getPassword()));
		user.setNickname(userRegisterInfo.getNickname());
		user.setBirthday(userRegisterInfo.getBirthday());
		user.setPhone(userRegisterInfo.getPhone());
		user.setType(userRegisterInfo.getType());
		return userRepository.save(user);
	}

	@Override
	public User updateUser(User user) {
		return userRepository.save(user);
	}

	@Override
	public User updateUser(UserUpdatePutReq userUpdatePutReq, User user) {
		//닉네임 수정
		if(userUpdatePutReq.getNickname() != null) {
			user.setNickname(userUpdatePutReq.getNickname());
		}

		//이미지 수정
		if(userUpdatePutReq.getImg() != null) {
			user.setImg(userUpdatePutReq.getImg());
		}

		//주량정보 수정 - 추후 구현
//		if(userUpdatePutReq.getDrinkId() != null) {
//			user.setDrink(userUpdatePutReq.getDrinkId());
//		}

		return userRepository.save(user);
	}

	@Override
	public boolean idDuplicated(String userId) {
		return userRepository.existsByUserId(userId);
	}

	@Override
	public boolean nicknameDuplicated(String nickname) {
		return userRepository.existsByNickname(nickname);
	}

	@Override
	public void addUserOnline(String userId) {
		// 온라인 유저 추가
		userOnlineList.add(userId);
	}

	@Override
	public List<UserRes> getUsersOnlineList() {
		List<UserRes> res = new ArrayList<>();
		// DB에서 유저 ID에 해당하는 유저리스트를 불러옴
		for(String userId : userOnlineList){
			res.add(UserRes.of(userRepository.findByUserId(userId).get()));
		}

		return res;
	}

	@Override
   public User getUserByUserId(String userId) {
      // 디비에 유저 정보 조회 (userId 를 통한 조회).
      User user = userRepository.findByUserId(userId).get();
      return user;
   }

	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		User user = userRepository.findByUserId(email)
				.orElseThrow(() -> new UsernameNotFoundException("User not found with email : " + email));

		log.info("Load user by user email: the User Email - {}",  user.getUserId());

		return UserPrincipal.create(user);
	}
}