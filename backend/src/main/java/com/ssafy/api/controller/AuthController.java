package com.ssafy.api.controller;

import com.ssafy.api.response.BroadcastMessage;
import com.ssafy.api.response.ResponseMessage;
import com.ssafy.api.service.UserService;
import com.ssafy.common.auth.SsafyUserDetails;
import com.ssafy.common.exception.*;
import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.security.oauth2.entity.ProviderType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.ssafy.api.request.UserLoginPostReq;
import com.ssafy.api.response.UserLoginPostRes;
import com.ssafy.common.util.JwtTokenUtil;
import com.ssafy.db.entity.user.User;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponses;
import io.swagger.annotations.ApiResponse;
import springfox.documentation.annotations.ApiIgnore;

/**
 * 인증 관련 API 요청 처리를 위한 컨트롤러 정의.
 */
@Api(value = "인증 API", tags = {"Auth"})
@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private UserService userService;
    @Autowired
    private SimpMessagingTemplate template;
    @Autowired
    private PasswordEncoder passwordEncoder;

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

        log.info("로그인 시도: ID: {}", userId);

        User user = userService.getUserByUserId(userId);

        // 소셜 유저가 일반 로그인 시도하지 못하도록 에러코드 반환
        if(password == null || password.trim().length() == 0){
            log.info("로그인 시도 ID: {} 실패(소셜로그인)", userId);
            throw new InvalidValueException(ErrorCode.INVALID_INPUT_VALUE);
        }

        boolean first = user.getFirst() == 0;

        if (first) {
            user.setFirst(1);
            userService.updateUser(user);
        }

        // 로그인 요청한 유저로부터 입력된 패스워드 와 디비에 저장된 유저의 암호화된 패스워드가 같은지 확인.(유효한 패스워드인지 여부 확인)
        if (passwordEncoder.matches(password, user.getPassword())) {
            log.info("로그인 시도: ID: {}, 성공", userId);
            // 접속중인 유저 리스트에 추가
            userService.addUserOnline(user.getUserId());
            broadcastToLobby();
            // 유효한 패스워드가 맞는 경우, 로그인 성공으로 응답.(액세스 토큰을 포함하여 응답값 전달)
            return ResponseEntity.ok(UserLoginPostRes.of(200, "Success", JwtTokenUtil.getToken(userId), first, user.getNickname()));
        } else {
            log.info("로그인 시도: ID: {} 실패", userId);
            // 유효하지 않는 패스워드인 경우, 로그인 실패로 응답.
            throw new InvalidValueException(ErrorCode.INVALID_INPUT_VALUE);
        }
    }

    @GetMapping("/logout")
    @ApiOperation(value = "로그아웃", notes = "로그아웃 한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "인증 실패", response = ErrorResponse.class),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류", response = ErrorResponse.class)
    })
    private ResponseEntity<? extends BaseResponseBody> logout(@ApiIgnore Authentication authentication) {

        SsafyUserDetails userDetails = (SsafyUserDetails) authentication.getDetails();
        String userId = userDetails.getUsername();

        log.info("로그아웃 시도: ID: {}, 성공", userId);
        // 접속중인 유저 리스트에서 삭제
        if (userService.delUserOnline(userId)) {
            broadcastToLobby();
            return ResponseEntity.status(200).body(BaseResponseBody.of(200, ResponseMessage.SUCCESS));
        } else {
            return ResponseEntity.status(404).body(BaseResponseBody.of(404, ResponseMessage.FAIL));
        }
    }

    private void broadcastToLobby() {
        template.convertAndSend("/from/lobby/users", new BroadcastMessage("User List changed"));
    }

}