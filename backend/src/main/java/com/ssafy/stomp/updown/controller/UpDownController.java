package com.ssafy.stomp.updown.controller;

import com.ssafy.api.service.HistoryService;
import com.ssafy.api.service.RoomService;
import com.ssafy.api.service.UserService;
import com.ssafy.db.entity.User;
import com.ssafy.stomp.entity.Message;
import com.ssafy.stomp.updown.model.GameResultType;
import com.ssafy.stomp.updown.model.manager.GameManager;
import com.ssafy.stomp.updown.request.CheckAnswerReq;
import com.ssafy.stomp.updown.request.GameStartReq;
import com.ssafy.stomp.updown.response.BaseGameStatusRes;
import com.ssafy.stomp.updown.response.PlayGameStatusRes;
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

        BaseGameStatusRes res = new BaseGameStatusRes();
        res.setGameStatus(gameManager.getGameStatus());
        res.setUserInfo(gameManager.getUserInfo());

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

        BaseGameStatusRes res = new BaseGameStatusRes();
        res.setGameStatus(gameManager.getGameStatus());
        res.setUserInfo(gameManager.getUserInfo());

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

        BaseGameStatusRes res = new BaseGameStatusRes();
        res.setGameStatus(gameManager.getGameStatus());
        res.setUserInfo(gameManager.getUserInfo());

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

        BaseGameStatusRes res = new BaseGameStatusRes();
        res.setGameStatus(gameManager.getGameStatus());
        res.setUserInfo(gameManager.getUserInfo());

        template.convertAndSend("/from/ud/status/" + roomId, res);
    }

    @MessageMapping("/ud/chat/{roomId}")
    public void sendChat(@DestinationVariable long roomId, Message message){
        log.info(message.getUsername()+"님이 메세지: '" +message.getContent()+"' 전송");

        template.convertAndSend("/from/ud/chat/" + roomId, message);
    }

    /**
     * 모든 참가자 READY 시 방장에 의해 시작되는 게임 시작 API
     * @param roomId
     * @param startInfo
     */
    @MessageMapping("/ud/start/{roomId}")
    public void startGame(@DestinationVariable long roomId, GameStartReq startInfo){
        log.info(roomId +" 번방 UpDown Game Start");

        GameManager gameManager = ManagerHolder.gameManagers.get(roomId);

        gameManager.startGame(startInfo);

        PlayGameStatusRes res = new PlayGameStatusRes();
        res.setGameStatus(gameManager.getGameStatus());
        res.setUserInfo(gameManager.getUserInfo());
        res.setNextTurnIndex(gameManager.getTurnIndex());
        res.setUserOrder(gameManager.getUserOrder());
        res.setResult(GameResultType.START);

        template.convertAndSend("/from/ud/status/" + roomId, res);
    }

    @MessageMapping("/ud/check/{roomId}")
    public void checkAnswer(@DestinationVariable long roomId, CheckAnswerReq checkInfo){

        log.info(roomId +" 번방 UpDown Game" + checkInfo.getNickname()+"님의 답: " + checkInfo.getNumber());

        GameManager gameManager = ManagerHolder.gameManagers.get(roomId);

        GameResultType resultType = gameManager.checkAnswer(checkInfo);

        PlayGameStatusRes res = new PlayGameStatusRes();
        res.setGameStatus(gameManager.getGameStatus());
        res.setUserInfo(gameManager.getUserInfo());
        res.setNextTurnIndex(gameManager.getTurnIndex());
        res.setUserOrder(gameManager.getUserOrder());
        res.setResult(resultType);


        if (resultType == GameResultType.CORRECT){
            // 맞았을 경우
        }else{
            // 틀렸을 경우
            if (resultType == GameResultType.TIMEOUT){
                gameOver(roomId);
            }
        }

        template.convertAndSend("/from/ud/check" + roomId, res);
    }

    private void gameOver(long roomId) {
        log.info(roomId +"번 방 UpDown Game Over");
    }
}
