package com.ssafy.api.controller;

import com.ssafy.api.request.UserChangePwdPutReq;
import com.ssafy.api.request.UserUpdatePutReq;
import com.ssafy.api.response.BroadcastMessage;
import com.ssafy.api.response.ResponseMessage;
import com.ssafy.api.service.UserService;
import com.ssafy.common.exception.*;
import com.ssafy.common.service.S3Service;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.ssafy.api.request.UserRegisterPostReq;
import com.ssafy.api.response.UserRes;
import com.ssafy.common.auth.SsafyUserDetails;
import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.user.User;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.web.multipart.MultipartFile;
import springfox.documentation.annotations.ApiIgnore;

import java.io.IOException;
import java.util.List;

/**
 * 유저 관련 API 요청 처리를 위한 컨트롤러 정의.
 */
@Api(value = "유저 API", tags = {"User"})
@Slf4j
@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    @Autowired
    UserService userService;
    @Autowired
    S3Service s3Service;

    @Autowired
    private SimpMessagingTemplate template;

    @PostMapping()
    @ApiOperation(value = "회원 가입", notes = "<strong>아이디와 패스워드</strong>를 통해 회원가입 한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류", response = ErrorResponse.class)
    })
    public ResponseEntity<? extends BaseResponseBody> register(
            @RequestBody @ApiParam(value = "회원가입 정보", required = true) UserRegisterPostReq registerInfo) {
        String userId = registerInfo.getUserId();
        String nickname = registerInfo.getNickname();

        if (userService.idDuplicated(userId))
            throw new UserIdDuplicatedException();
        if (userService.nicknameDuplicated(nickname))
            throw new NicknameDuplicatedException();

        User user = userService.createUser(registerInfo);

        return ResponseEntity.status(200).body(BaseResponseBody.of(200, ResponseMessage.SUCCESS));
    }

    @GetMapping("/info/{nickname}")
    @ApiOperation(value = "회원 정보 조회", notes = "<strong>닉네임</strong>값을 통해 접속 중인 회원의 정보를 확인한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 405, message = "Request method 에러"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<UserRes> getOtherUserInfo(@ApiIgnore Authentication authentication, @PathVariable @ApiParam(value = "조회하려는 회원의 닉네임") String nickname) {

        //해당 api 호출한 사람이 접속 중인 유저인지 판단
        SsafyUserDetails userDetails = (SsafyUserDetails) authentication.getDetails();
        String myUserId = userDetails.getUsername();
        User user = userService.getUserByUserId(myUserId);
        if (myUserId == null || user == null) throw new UserNotFoundException();

        //query params로 넘긴 유저 nickname값에 대해 회원정보 얻어오기
        User userInfo = userService.getUserByNickname(nickname);

        return ResponseEntity.status(200).body(UserRes.of(userInfo));
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
        List<UserRes> usersOnlineList = userService.getUsersOnlineList();
        return ResponseEntity.status(200).body(usersOnlineList);
    }

    @PutMapping(value = "/info", consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
    @ApiOperation(value = "회원 정보 수정", notes = "마이페이지에서 <strong>닉네임, 이미지, 주량</strong> 정보 등을 수정한다.", response = User.class)
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 409, message = "닉네임 중복"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    private ResponseEntity<? extends BaseResponseBody> updateUserInfo(@ApiIgnore Authentication authentication,
                                                                      @ApiParam(value = "업데이트할 유저 정보") @RequestPart(value = "update_info") UserUpdatePutReq updateInfo,
                                                                      @RequestPart(value = "img", required = false) MultipartFile multipartFile) {

        log.info("file: {}",multipartFile);

        //수정하려는 회원이 누구인지, 또 허가된 회원인지 확인
        SsafyUserDetails userDetails = (SsafyUserDetails) authentication.getDetails();
        String userId = userDetails.getUsername();
        User user = userService.getUserByUserId(userId);
        if (userId == null || user == null) throw new UserNotFoundException();

        //닉네임 중복여부 백엔드에서도 한번 더 확인
        //변경할 닉네임 정보
        if (updateInfo.getNickname() != null) {
            String newNickname = updateInfo.getNickname();

            if (userService.nicknameDuplicated(newNickname))
                throw new NicknameDuplicatedException();
        }

        if (!multipartFile.isEmpty()) {
            try {
                updateInfo.setImg(s3Service.upload(multipartFile));
            } catch (IOException e) {
                throw new InvalidValueException(ErrorCode.FILE_IS_INVALID);
            }
        }

        //request로 받아온 내용을 해당 유저 칼럼에 update
        userService.updateUser(updateInfo, user);

        return ResponseEntity.status(200).body(BaseResponseBody.of(200, ResponseMessage.SUCCESS));
    }

    @PutMapping("/password")
    @ApiOperation(value = "비밀번호 변경", notes = "<strong>토큰과 변경할 비밀번호</strong>를 이용해 유저의 비밀번호를 새 비밀번호로 변경한다.", response = User.class)
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    private ResponseEntity<? extends BaseResponseBody> changeUserPwd(@ApiIgnore Authentication authentication, @ApiParam(value = "새로운 유저 비밀번호") @RequestBody UserChangePwdPutReq userChangePwdPutReq) {

        SsafyUserDetails userDetails = (SsafyUserDetails) authentication.getDetails();
        String userId = userDetails.getUsername();

        //사용자가 요청보낸 사용자 현재 password 정보 & 새 비밀번호 정보
        String password = userChangePwdPutReq.getPassword();
        String newpassword = userChangePwdPutReq.getNewpassword();

        //한번 더 중복 검사-현재 비밀번호와 새로운 비밀번호의 값이 중복되는지 체크
        if (password.equals(newpassword)) throw new PasswordDuplicatedException();

        //새 비밀번호 값을 암호화해서 새로 DB에 UPDATE
        boolean check = userService.changeUserPwd(userId, password, newpassword);

        if (check) {
            return ResponseEntity.status(200).body(BaseResponseBody.of(200, ResponseMessage.SUCCESS));
        } else { //현재 비밀번호 정보 입력 잘못했을 시
            throw new InvalidValueException(ErrorCode.INVALID_INPUT_VALUE);
        }
    }

    private void broadcastToLobby(){
        template.convertAndSend("/from/lobby/users", new BroadcastMessage("User List changed"));
    }
}