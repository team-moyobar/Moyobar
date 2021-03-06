package com.moyobar.stomp.updown.controller;

import com.moyobar.api.service.HistoryService;
import com.moyobar.api.service.RoomService;
import com.moyobar.db.entity.game.Game;
import com.moyobar.db.entity.room.Room;
import com.moyobar.db.entity.user.User;
import com.moyobar.stomp.entity.Message;
import com.moyobar.stomp.model.service.GameService;
import com.moyobar.stomp.updown.model.CheckResultType;
import com.moyobar.stomp.updown.model.GameStatusType;
import com.moyobar.stomp.updown.model.manager.GameManager;
import com.moyobar.stomp.updown.request.CheckAnswerReq;
import com.moyobar.stomp.updown.response.CheckResultRes;
import com.moyobar.stomp.updown.response.GameInfoRes;
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
public class UpDownController {

    private static final String GAME_NAME = "업다운";

    @Autowired
    private SimpMessagingTemplate template;
    @Autowired
    private HistoryService historyService;
    @Autowired
    private GameService gameService;
    @Autowired
    private RoomService roomService;


    // 모든 게임을 관리할 수 있는 싱글톤 클래스
    private static final class ManagerHolder {
        private static final Map<Long, GameManager> gameManagers = new ConcurrentHashMap<>();
    }


    @MessageMapping("/ud/chat/{roomId}")
    public void sendChat(@DestinationVariable long roomId, Message message) {
        log.info("{} 님 {} 번 방 채팅 메세지 : '{}' 전송", message.getUsername(), roomId, message.getContent());

        template.convertAndSend("/from/ud/chat/" + roomId, message);
    }

    /**
     * 모든 참가자 READY 시 방장에 의해 시작되는 게임 시작 API
     *
     * @param roomId
     */
    @MessageMapping("/ud/start/{roomId}")
    public void startGame(@DestinationVariable long roomId) {
        log.info("{} 번 방 게임 시작", roomId);

        // 현재 방에 있는 사용자 정보를 불러와 새로운 게임 매니저 생성
        List<User> users = historyService.getUserInRoom(roomId);
        GameManager gameManager = new GameManager(users);
        ManagerHolder.gameManagers.put(roomId, gameManager);

        Game game = gameService.createGame(GAME_NAME);

        Room room = roomService.getRoomById(roomId);

        gameManager.startGame(game.getId(), room.getOwner());

        log.info("{} 번 방 정답: {}", roomId, gameManager.getAnswer());

        template.convertAndSend("/from/ud/status/" + roomId, GameInfoRes.of(gameManager, null));
    }

    @MessageMapping("/ud/check/{roomId}")
    public void checkAnswer(@DestinationVariable long roomId, CheckAnswerReq checkInfo) {
        GameManager gameManager = ManagerHolder.gameManagers.get(roomId);

        String username = checkInfo.getNickname();
        int number = checkInfo.getNumber();

        log.info("{} 님 {} 번 방 답 입력 : {}", username, roomId, number);

        CheckResultType resultType = gameManager.checkAnswer(number);

        log.info("{} 님의 결과: {}", username, resultType);

        if (gameManager.getGameStatus() == GameStatusType.FINISH) {
            log.info("{} 번 방 종료", roomId);

            gameService.updateGame(gameManager.getGameId(), gameManager.getGameUpdateInfoList());
        }

        template.convertAndSend("/from/ud/status/" + roomId, GameInfoRes.of(gameManager, CheckResultRes.of(username, number, resultType)));

    }
}
