package com.ssafy.api.controller;

import com.ssafy.api.request.UserLoginPostReq;
import com.ssafy.api.request.UserUpdatePutReq;
import com.ssafy.api.response.ResponseMessage;
import com.ssafy.api.service.UserService;
import com.ssafy.common.exception.ErrorResponse;
import com.ssafy.common.exception.UserNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.ssafy.api.request.UserRegisterPostReq;
import com.ssafy.api.response.UserRes;
import com.ssafy.common.auth.SsafyUserDetails;
import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.User;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import springfox.documentation.annotations.ApiIgnore;

import java.util.List;

/**
 * 유저 관련 API 요청 처리를 위한 컨트롤러 정의.
 */
@Api(value = "유저 API", tags = {"User"})
@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    @Autowired
    UserService userService;

    @PostMapping()
    @ApiOperation(value = "회원 가입", notes = "<strong>아이디와 패스워드</strong>를 통해 회원가입 한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류", response = ErrorResponse.class)
    })
    public ResponseEntity<? extends BaseResponseBody> register(
            @RequestBody @ApiParam(value = "회원가입 정보", required = true) UserRegisterPostReq registerInfo) {
        User user = userService.createUser(registerInfo);

        return ResponseEntity.status(200).body(BaseResponseBody.of(200, ResponseMessage.SUCCESS));
    }

    @GetMapping("/info")
    @ApiOperation(value = "회원 본인 정보 조회", notes = "로그인한 회원 본인의 정보를 응답한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 403, message = "인증 실패", response = ErrorResponse.class),
            @ApiResponse(code = 404, message = "사용자 없음", response = ErrorResponse.class),
            @ApiResponse(code = 500, message = "서버 오류", response = ErrorResponse.class)
    })
    public ResponseEntity<UserRes> getUserInfo(@ApiIgnore Authentication authentication) {
        /**
         * 요청 헤더 액세스 토큰이 포함된 경우에만 실행되는 인증 처리이후, 리턴되는 인증 정보 객체(authentication) 통해서 요청한 유저 식별.
         * 액세스 토큰이 없이 요청하는 경우, 403 에러({"error": "Forbidden", "message": "Access Denied"}) 발생.
         */
        SsafyUserDetails userDetails = (SsafyUserDetails) authentication.getDetails();
        String userId = userDetails.getUsername();
        User user = userService.getUserByUserId(userId);
        if(userId == null || user == null) throw new UserNotFoundException();

        return ResponseEntity.status(200).body(UserRes.of(user));
    }

    @GetMapping("/id/{userId}")
    @ApiOperation(value = "아이디 중복 확인", notes = "아이디의 중복 확인 여부를 확인한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류", response = ErrorResponse.class)
    })
    public ResponseEntity<Boolean> checkId(@PathVariable @ApiParam(value = "중복 확인 ID") String userId) {
        return ResponseEntity.status(200).body(userService.idDuplicated(userId));
    }

    @GetMapping("/nickname/{nickname}")
    @ApiOperation(value = "닉네임 중복 확인", notes = "닉네임의 중복 확인 여부를 확인한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류", response = ErrorResponse.class)
    })
    public ResponseEntity<Boolean> checkNickname(@PathVariable @ApiParam(value = "중복 확인 닉네임") String nickname) {
		return ResponseEntity.status(200).body(userService.nicknameDuplicated(nickname));
    }

    @GetMapping("/online")
    @ApiOperation(value = "로그인한 유저 목록 조회", notes = "로그인한 유저 목록 정보를 응답한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<List<UserRes>> getUsersOline(@ApiIgnore Authentication authentication) {
        /**
         * 요청 헤더 액세스 토큰이 포함된 경우에만 실행되는 인증 처리이후, 리턴되는 인증 정보 객체(authentication) 통해서 요청한 유저 식별.
         * 액세스 토큰이 없이 요청하는 경우, 403 에러({"error": "Forbidden", "message": "Access Denied"}) 발생.
         */
        List<UserRes> usersOnlineList = userService.getUsersOnlineList();
        return ResponseEntity.status(200).body(usersOnlineList);
    }

    @PutMapping("/info")
    @ApiOperation(value = "회원 정보 수정", notes = "마이페이지에서 <strong>닉네임, 이미지, 주량</strong> 정보 등을 수정한다.", response = User.class)
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "잘못된 접근"),
            @ApiResponse(code = 404, message = "Not Found"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    private ResponseEntity<User> updateUserInfo(@ApiIgnore Authentication authentication, @ApiParam(value = "업데이트할 유저 정보") @RequestBody UserUpdatePutReq userUpdatePutreq) {
        //수정하려는 회원이 누구인지, 또 허가된 회원인지 확인
        SsafyUserDetails userDetails = (SsafyUserDetails) authentication.getDetails();
        String userId = userDetails.getUsername();
        User user = userService.getUserByUserId(userId);

        if(userId == null || user == null) throw new UserNotFoundException();

        //request로 받아온 내용을 해당 유저 칼럼에 update
        userService.updateUser(userUpdatePutreq, user);

        return ResponseEntity.status(200).body(userService.updateUser(user));
    }
}