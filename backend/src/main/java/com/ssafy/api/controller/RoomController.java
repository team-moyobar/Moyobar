package com.ssafy.api.controller;

import com.ssafy.api.request.RoomJoinPostReq;
import com.ssafy.api.request.RoomRegisterPostReq;
import com.ssafy.api.request.RoomUpdatePutReq;
import com.ssafy.api.response.ResponseMessage;
import com.ssafy.api.response.RoomRegisterPostRes;
import com.ssafy.api.response.RoomRes;
import com.ssafy.api.response.UserRes;
import com.ssafy.api.service.HistoryService;
import com.ssafy.api.service.RoomService;
import com.ssafy.api.service.UserService;
import com.ssafy.common.auth.SsafyUserDetails;
import com.ssafy.common.exception.*;
import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.History;
import com.ssafy.db.entity.Room;
import com.ssafy.db.entity.RoomType;
import com.ssafy.db.entity.User;
import io.swagger.annotations.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import javax.annotation.Nullable;
import java.util.List;
import java.util.stream.Collectors;


/**
 * 미팅룸 관련 API 요청 처리를 위한 컨트롤러 정의.
 */
@Api(value = "미팅룸 API", tags = {"Meeting Room"})
@RestController
@RequestMapping("/api/v1/rooms")
public class RoomController {

    private final Logger logger = LoggerFactory.getLogger(RoomController.class);
    @Autowired
    RoomService roomService;
    @Autowired
    HistoryService historyService;
    @Autowired
    UserService userService;
    @Autowired
    PasswordEncoder passwordEncoder;

    @PostMapping()
    @ApiOperation(value = "미팅 룸 생성", notes = "<stong>방 정보</strong>를 통해 방을 생성한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "방 생성 성공"),
            @ApiResponse(code = 403, message = "인증 실패", response = ErrorResponse.class),
            @ApiResponse(code = 400, message = "잘못된 접근", response = ErrorResponse.class),
            @ApiResponse(code = 409, message = "방생성 실패", response = ErrorResponse.class),
            @ApiResponse(code = 500, message = "서버 오류", response = ErrorResponse.class)
    })
    public ResponseEntity<RoomRegisterPostRes> create(
            @RequestBody @ApiParam(value = "방 생성 정보", required = true) RoomRegisterPostReq registerInfo,
            @ApiIgnore Authentication authentication) {

        SsafyUserDetails userDetails = (SsafyUserDetails) authentication.getDetails();
        String userId = userDetails.getUsername();

        User owner = userService.getUserByUserId(userId);

        if (historyService.existsUserInRoom(owner.getId()))
            throw new UserAlreadyInActiveRoomException();

        Room room = roomService.createRoom(registerInfo, owner);

        historyService.createHistory(room, owner);

        return ResponseEntity.status(200).body(RoomRegisterPostRes.of(200, ResponseMessage.SUCCESS, room.getId()));
    }


    @GetMapping("/{roomId}")
    @ApiOperation(value = "미팅 룸 상세 조회", notes = "<stong>방 아이디</strong>를 통해 방 정보를 조회한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "방 조회 성공"),
            @ApiResponse(code = 403, message = "인증 실패", response = ErrorResponse.class),
            @ApiResponse(code = 400, message = "잘못된 접근", response = ErrorResponse.class),
            @ApiResponse(code = 500, message = "서버 오류", response = ErrorResponse.class)
    })
    public ResponseEntity<RoomRes> roomInfo(
            @PathVariable @ApiParam(value = "방 조회할 번호", required = true) long roomId,
            @ApiIgnore Authentication authentication) {

        Room room = roomService.getRoomById(roomId);
        List<User> users = historyService.getUserInRoom(roomId);
        return ResponseEntity.status(200).body(RoomRes.of(room, users));
    }

    @PutMapping("/{roomId}")
    @ApiOperation(value = "미팅 룸 정보 수정", notes = "<stong>방 정보</strong>를 통해 방 정보를 수정한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "방 수정 성공"),
            @ApiResponse(code = 403, message = "인증 실패", response = ErrorResponse.class),
            @ApiResponse(code = 400, message = "잘못된 접근", response = ErrorResponse.class),
            @ApiResponse(code = 409, message = "방 수정 실패", response = ErrorResponse.class),
            @ApiResponse(code = 500, message = "서버 오류", response = ErrorResponse.class)
    })
    public ResponseEntity<? extends BaseResponseBody> update(
            @PathVariable @ApiParam(value = "수정할 방 번호") long roomId,
            @RequestBody @ApiParam(value = "방 생성 정보", required = true) RoomUpdatePutReq updateInfo,
            @ApiIgnore Authentication authentication) {

        SsafyUserDetails userDetails = (SsafyUserDetails) authentication.getDetails();
        String userId = userDetails.getUsername();

        User authUser = userService.getUserByUserId(userId);
        Room room = roomService.getRoomById(roomId);

        if (room.getOwner() != authUser) {
            throw new UserNotRoomOwnerException();
        }

        // 이미 닫힌 방 접근 시
        if (room.getIsActive() == 1)
            throw new BadRequestException("잘못된 접근입니다.");

        User owner = authUser;
        if (updateInfo.getOwner() != null) {
            owner = userService.getUserByNickname(updateInfo.getOwner());
        }
        roomService.updateRoom(room, updateInfo, owner);

        return ResponseEntity.status(200).body(BaseResponseBody.of(200, ResponseMessage.SUCCESS));
    }

    @GetMapping()
    @ApiOperation(value = "미팅 룸 목록 조회", notes = " 방 목록을 조회한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "방 조회 성공"),
            @ApiResponse(code = 403, message = "인증 실패", response = ErrorResponse.class),
            @ApiResponse(code = 400, message = "잘못된 접근", response = ErrorResponse.class),
            @ApiResponse(code = 500, message = "서버 오류", response = ErrorResponse.class)
    })
    public ResponseEntity<Page<RoomRes>> roomList(
            @RequestParam @ApiParam(name = "searchBy", required = false) @Nullable String searchBy,
            @RequestParam @ApiParam(name = "keyword", required = false) @Nullable String keyword,
            @PageableDefault(size = 10, sort = "start", direction = Sort.Direction.DESC) Pageable pageable,
            @ApiIgnore Authentication authentication) {

        Page<Room> rooms = roomService.getActiveRoomList(searchBy, keyword, pageable);
        List<RoomRes> result = rooms.getContent()
                .stream().map(room -> {
                    List<User> users = historyService.getUserInRoom(room.getId());
                    return RoomRes.of(room, users);
                }).collect(Collectors.toList());
        ;

        Page<RoomRes> results = new PageImpl<>(result, rooms.getPageable(), rooms.getTotalElements());
        return ResponseEntity.status(200).body(results);
    }

    @PostMapping("/{roomId}")
    @ApiOperation(value = "미팅 룸 입장", notes = "<strong>비밀번호</strong>를 통해 방에 입장한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "방 생성 성공"),
            @ApiResponse(code = 403, message = "인증 실패", response = ErrorResponse.class),
            @ApiResponse(code = 400, message = "잘못된 접근", response = ErrorResponse.class),
            @ApiResponse(code = 409, message = "방 입장 실패", response = ErrorResponse.class),
            @ApiResponse(code = 500, message = "서버 오류", response = ErrorResponse.class)
    })
    public ResponseEntity<RoomRes> joinRoom(
            @PathVariable @ApiParam(value = "방 번호", required = true) long roomId,
            @RequestBody @ApiParam(value = "방 입장에 필요한 정보", required = false) RoomJoinPostReq joinInfo,
            @ApiIgnore Authentication authentication) {

        SsafyUserDetails userDetails = (SsafyUserDetails) authentication.getDetails();
        String userId = userDetails.getUsername();

        User user = userService.getUserByUserId(userId);

        if (historyService.existsUserInRoom(user.getId()))
            throw new UserAlreadyInActiveRoomException();

        Room room = roomService.getRoomById(roomId);
        int currentUserCount = historyService.getUserInRoom(room.getId()).size();

        if (currentUserCount == room.getMax())
            throw new RoomAlreadyMaxUserException();

        if (room.getType() == RoomType.PRIVATE) {
            if (joinInfo.getPassword() == null || !passwordEncoder.matches(joinInfo.getPassword(), room.getPassword()))
                throw new InvalidValueException(ErrorCode.PASSWORD_MISMATCH);
        }


        historyService.createHistory(room, user);
        List<User> users = historyService.getUserInRoom(room.getId());
        return ResponseEntity.status(200).body(RoomRes.of(room, users));
    }

    @DeleteMapping("/{roomId}")
    @ApiOperation(value = "미팅 룸 퇴장", notes = "방에서 퇴장한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "방 퇴장 성공"),
            @ApiResponse(code = 403, message = "인증 실패", response = ErrorResponse.class),
            @ApiResponse(code = 400, message = "잘못된 접근", response = ErrorResponse.class),
            @ApiResponse(code = 409, message = "방 퇴장 실패", response = ErrorResponse.class),
            @ApiResponse(code = 500, message = "서버 오류", response = ErrorResponse.class)
    })
    public ResponseEntity<? extends BaseResponseBody> leaveRoom(
            @PathVariable @ApiParam(value = "방 번호", required = true) long roomId,
            @ApiIgnore Authentication authentication) {

        SsafyUserDetails userDetails = (SsafyUserDetails) authentication.getDetails();
        String userId = userDetails.getUsername();

        User user = userService.getUserByUserId(userId);

        Room room = roomService.getRoomById(roomId);

        historyService.leaveRoom(user, room);

        return ResponseEntity.status(200).body(BaseResponseBody.of(200, ResponseMessage.SUCCESS));
    }

    @PostMapping("/{roomId}/password")
    @ApiOperation(value = "비밀번호 일치 여부 확인", notes = "방 비밀번호의 일치 확인 여부를 확인한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류", response = ErrorResponse.class)
    })
    public ResponseEntity<Boolean> checkPassword(@PathVariable @ApiParam(value = "방 번호") long roomId,
                                                 @RequestBody @ApiParam(value = "방 입장 비밀번호 정보", required = false) RoomJoinPostReq roomJoinInfo) {
        Room room = roomService.getRoomById(roomId);
        if (room.getIsActive() == 1) throw new RoomNotFoundException();

        boolean result = false;

        if (room.getType() == RoomType.PUBLIC)
            result = true;
        else {
            if (roomJoinInfo.getPassword() != null)
                result = passwordEncoder.matches(roomJoinInfo.getPassword(), room.getPassword());
        }

        return ResponseEntity.status(200).body(result);
    }
}
