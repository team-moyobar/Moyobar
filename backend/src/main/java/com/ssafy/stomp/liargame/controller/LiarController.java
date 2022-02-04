package com.ssafy.stomp.liargame.controller;

import com.google.gson.JsonObject;
import com.ssafy.api.service.RoomService;
import com.ssafy.stomp.liargame.model.manager.GameManager;
import com.ssafy.stomp.liargame.request.GameStartMessage;
import com.ssafy.stomp.liargame.response.RoleSubjectResult;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 라이어게임용 컨트롤러
 */

@Slf4j
@RestController
public class LiarController {
    // @EnableWebSocketMessageBroker를 통해서 등록되는 bean
    @Autowired
    private SimpMessagingTemplate webSocket;
    @Autowired
    private RoomService roomService;

    // 방 별로 게임 매니징하는 역할
    private static Map<Long, GameManager> gameManagerMap;

    @PostConstruct
    public void init() {
        gameManagerMap = new ConcurrentHashMap<>();
    }

    // 방장이 게임 시작 버튼 클릭 => 제시어(대분류) 선택 후 FE가 방 번호, 제시어(대분류) 보내어 동작
    // 주제어는 객체로 넘어옴 : @Payload가 클라이언트로부터 넘어온 객체 정보 받아올 수 있게 해줌
    @MessageMapping("/liar/start/{roomId}")
    @SendTo("/from/liar/start/{roomId}")
    public List<RoleSubjectResult> broadcasting(@DestinationVariable long roomId, @Payload GameStartMessage gameStartMessage) throws Exception {
        gameManagerMap.put(roomId, new GameManager(roomId, roomService, gameStartMessage.getSubject())); //게임 매니저 생성 및 역할-제시어 분배
        log.info("게임 start");
        return gameManagerMap.get(roomId).allRoldNameAndSubject(); //해당 방에 참가 중인 플레이어에게 각각 역할, 제시어 정보 보내주기
    }
}
