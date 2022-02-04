package com.ssafy.api.controller;

import com.ssafy.api.service.UserService;
import com.ssafy.common.exception.ErrorCode;
import com.ssafy.common.exception.ErrorResponse;
import com.ssafy.common.exception.InvalidValueException;
import com.ssafy.common.exception.UserNotFoundException;
import com.ssafy.security.oauth2.entity.ProviderType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.api.request.UserLoginPostReq;
import com.ssafy.api.response.UserLoginPostRes;
import com.ssafy.common.util.JwtTokenUtil;
import com.ssafy.db.entity.User;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponses;
import io.swagger.annotations.ApiResponse;

/**
 * 인증 관련 API 요청 처리를 위한 컨트롤러 정의.
 */
@Api(value = "인증 API", tags = {"Auth"})
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
	@Autowired
	UserService userService;

	@Autowired
	PasswordEncoder passwordEncoder;

	@PostMapping("/login")
	@ApiOperation(value = "로그인", notes = "<strong>아이디와 패스워드</strong>를 통해 로그인 한다.")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공", response = UserLoginPostRes.class),
			@ApiResponse(code = 401, message = "인증 실패", response = ErrorResponse.class),
			@ApiResponse(code = 500, message = "서버 오류", response = ErrorResponse.class)
	})
	public ResponseEntity<UserLoginPostRes> login(@RequestBody @ApiParam(value = "로그인 정보", required = true) UserLoginPostReq loginInfo) {
		String userId = loginInfo.getUserId();
		String password = loginInfo.getPassword();

		User user = userService.getUserByUserId(userId);

		if(user == null) throw new UserNotFoundException();

		boolean first = user.getFirst() == 0;

		if (first) {
			user.setFirst(1);
			userService.updateUser(user);
		}

		// 로그인 요청한 유저로부터 입력된 패스워드 와 디비에 저장된 유저의 암호화된 패스워드가 같은지 확인.(유효한 패스워드인지 여부 확인)
		if (user.getType() != ProviderType.LOCAL || passwordEncoder.matches(password, user.getPassword())) {
			// 로그인 한 유저 리스트에 추가
			userService.addUserOnline(user.getUserId());

			// 유효한 패스워드가 맞는 경우, 로그인 성공으로 응답.(액세스 토큰을 포함하여 응답값 전달)
			return ResponseEntity.ok(UserLoginPostRes.of(200, "Success", JwtTokenUtil.getToken(userId), first, user.getNickname()));
		}else{
			// 유효하지 않는 패스워드인 경우, 로그인 실패로 응답.
			throw new InvalidValueException(ErrorCode.INVALID_INPUT_VALUE);
		}
	}
}