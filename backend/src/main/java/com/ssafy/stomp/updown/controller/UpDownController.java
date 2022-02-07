package com.ssafy.stomp.updown.controller;

import com.ssafy.api.service.HistoryService;
import com.ssafy.db.entity.User;
import com.ssafy.stomp.entity.Message;
import com.ssafy.stomp.updown.model.GameResultType;
import com.ssafy.stomp.updown.model.manager.GameManager;
import com.ssafy.stomp.updown.request.CheckAnswerReq;
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
    private HistoryService historyService;

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

        // TODO: Game 시작 시 DB에 데이터 집어넣고, 해당 game id 저장

        gameManager.startGame();

        log.info("{} 번 방 정답: {}", roomId, gameManager.getAnswer());

        template.convertAndSend("/from/ud/status/" + roomId, GameStatusRes.of(gameManager, GameResultType.START, 0));
    }

    @MessageMapping("/ud/check/{roomId}")
    public void checkAnswer(@DestinationVariable long roomId, CheckAnswerReq checkInfo) {
        log.info("{} 님 {} 번 방 답 입력 : {}", checkInfo.getNickname(), roomId, checkInfo.getNumber());

        GameManager gameManager = ManagerHolder.gameManagers.get(roomId);

        GameResultType resultType = gameManager.checkAnswer(checkInfo);

        int answer = checkInfo.getNumber();
        log.info("{} 님의 결과: {}", checkInfo.getNickname(), resultType);


        if (resultType == GameResultType.CORRECT || resultType == GameResultType.TIMEOUT) {
            finishGame(roomId, resultType, checkInfo.getNickname());
        }
        if (resultType == GameResultType.TIMEOUT) {
            answer = gameManager.getAnswer();
        }

        template.convertAndSend("/from/ud/status/" + roomId, GameStatusRes.of(gameManager, resultType, answer));

    }

    private void finishGame(long roomId, GameResultType resultType, String nickname) {
        log.info("{} 번 방 종료", roomId);

        // TODO: Game 종료 후 DB 집어넣기
    }

}
