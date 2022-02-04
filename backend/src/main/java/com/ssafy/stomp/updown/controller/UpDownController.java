package com.ssafy.stomp.updown.controller;

import com.ssafy.api.service.HistoryService;
import com.ssafy.api.service.RoomService;
import com.ssafy.api.service.UserService;
import com.ssafy.db.entity.Room;
import com.ssafy.db.entity.User;
import com.ssafy.stomp.updown.model.GameType;
import com.ssafy.stomp.updown.model.manager.GameManager;
import com.ssafy.stomp.updown.response.GameStatusRes;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * UpDown 게임 관련 웹소켓 API를 처리하기 위해 정의
 */
@RestController
@Slf4j
@RequiredArgsConstructor
public class UpDownController {

    // 모든 게임을 관리할 수 있는 싱글톤 클래스
    private static final class ManagerHolder {
        private static final Map<Long, GameManager> gameManagers = new ConcurrentHashMap<>();
    }

    @Autowired
    private SimpMessagingTemplate template;
    @Autowired
    private RoomService roomService;
    @Autowired
    private UserService userService;
    @Autowired
    private HistoryService historyService;


    /**
     * 방장에 의한 게임 READY 요청 시 처리하는 API
     * @param roomId
     */
    @MessageMapping("/ud/ready/{roomId}")
    public void readyGame(@DestinationVariable long roomId){
        log.info(roomId +" 번방 UpDown Game ready");

        List<User> users = historyService.getUserInRoom(roomId);

        // 현재 방에 있는 사용자 정보를 불러와 새로운 게임 매니저 생성
        GameManager gameManager = new GameManager(users);
        ManagerHolder.gameManagers.put(roomId, gameManager);

        GameStatusRes res = new GameStatusRes();
        res.setGameStatus(gameManager.getGameStatus());
        res.setUserStatus(gameManager.getUserStatus());

        template.convertAndSend("/from/ud/status/" + roomId, res);
    }

    /**
     * 모든 참가자 READY 시 방장에 의해 시작되는 게임 시작 API
     * @param roomId
     * @param gameType UpDown 게임의 숫자 선정 타입
     */
    @MessageMapping("/ud/start/{roomId}")
    public void startGame(@DestinationVariable long roomId, GameType gameType){
        log.info(roomId +" 번방 UpDown Game Start");

        GameManager gameManager = ManagerHolder.gameManagers.get(roomId);

        gameManager.startGame(gameType);

        GameStatusRes res = new GameStatusRes();
        res.setGameStatus(gameManager.getGameStatus());
        res.setUserStatus(gameManager.getUserStatus());

        template.convertAndSend("/from/ud/status/" + roomId, res);
    }

    /**
     * 방에 있는 참가자가 게임에 준비되었는지를 처리하는 API
     * @param roomId
     * @param nickname
     */
    @MessageMapping("/ud/join/{roomId}")
    public void joinGame(@DestinationVariable long roomId, String nickname){
        log.info(nickname +"님 UpDown Game " + roomId +"번 방 입장");

        User user = userService.getUserByNickname(nickname);

        GameManager gameManager = ManagerHolder.gameManagers.get(roomId);

        gameManager.joinGame(user);

        GameStatusRes res = new GameStatusRes();
        res.setGameStatus(gameManager.getGameStatus());
        res.setUserStatus(gameManager.getUserStatus());

        template.convertAndSend("/from/ud/status/" + roomId, res);
    }

    /**
     * 방에 있는 참가자가 상태를 READY -> WAIT로 변경을 처리하는 API
     * @param roomId
     * @param nickname
     */
    @MessageMapping("/ud/wait/{roomId}")
    public void waitGame(@DestinationVariable long roomId, String nickname){
        log.info(nickname +"님 UpDown Game " + roomId +"번 방 대기");

        User user = userService.getUserByNickname(nickname);

        GameManager gameManager = ManagerHolder.gameManagers.get(roomId);

        gameManager.waitGame(user);

        GameStatusRes res = new GameStatusRes();
        res.setGameStatus(gameManager.getGameStatus());
        res.setUserStatus(gameManager.getUserStatus());

        template.convertAndSend("/from/ud/status/" + roomId, res);
    }

    /**
     * 참가자가 해당 게임을 나갈 경우 처리하는 API
     * @param roomId
     * @param nickname
     */
    @MessageMapping("/ud/leave/{roomId}")
    public void leaveGame(@DestinationVariable long roomId, String nickname){
        log.info(nickname +"님 UpDown Game " + roomId +"번 방 퇴장");

        User user = userService.getUserByNickname(nickname);

        GameManager gameManager = ManagerHolder.gameManagers.get(roomId);

        gameManager.leaveGame(user);

        GameStatusRes res = new GameStatusRes();
        res.setGameStatus(gameManager.getGameStatus());
        res.setUserStatus(gameManager.getUserStatus());

        template.convertAndSend("/from/ud/status/" + roomId, res);
    }

}
