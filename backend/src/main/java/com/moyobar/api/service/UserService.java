package com.moyobar.api.service;

import com.moyobar.api.request.UserUpdatePutReq;
import com.moyobar.api.response.UserLogRes;
import com.moyobar.api.request.UserRegisterPostReq;
import com.moyobar.api.response.UserRes;
import com.moyobar.db.entity.user.User;

import java.util.List;

/**
 *   유저 관련 비즈니스 로직 처리를 위한 서비스 구현 정의.
 */
public interface UserService {
	User createUser(UserRegisterPostReq userRegisterInfo);

	User updateUser(User user);

	User updateUser(UserUpdatePutReq userUpdatePutReq, User user);

	boolean idDuplicated(String userId);

	boolean nicknameDuplicated(String nickname);

	void addUserOnline(String userId);

	boolean delUserOnline(String userId);

	List<UserRes> getUsersOnlineList();

	User getUserByUserId(String userId);

	boolean changeUserPwd(String userId, String password, String changePassword);

	User getUserByNickname(String owner);

    List<User> searchUserByNickname(String keyword);

    List<UserLogRes> getUserLogs(String nickname);
}
