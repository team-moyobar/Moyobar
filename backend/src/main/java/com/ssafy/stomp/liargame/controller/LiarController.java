package com.ssafy.stomp.liargame.controller;

import com.ssafy.api.service.RoomService;
import com.ssafy.stomp.liargame.model.manager.GameManager;
import com.ssafy.stomp.liargame.request.GameStartReq;
import com.ssafy.stomp.liargame.request.VoteReq;
import com.ssafy.stomp.liargame.response.GameEndRes;
import com.ssafy.stomp.liargame.response.RoleSubjectRes;
import com.ssafy.stomp.liargame.response.VoteRes;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.PostConstruct;
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

    // 방 별로 게임 매니징하는 역할. 아래와 같이 Map 형식으로 각각의 방에 대한 게임 매니저 정보를 저장
    // {15, GameManager}
    // {3, GameManager}
    private static Map<Long, GameManager> gameManagerMap;

    @PostConstruct
    public void init() {
        gameManagerMap = new ConcurrentHashMap<>();
    }

    // 방장이 게임 시작 버튼 클릭 => 제시어(대분류) 선택 후 FE가 방 번호, 제시어(대분류) 보내어 동작
    // 주제어는 객체로 넘어옴 : @Payload가 클라이언트로부터 넘어온 객체 정보 받아올 수 있게 해줌
    @MessageMapping("/liar/start/{roomId}")
    @SendTo("/from/liar/start/{roomId}")
    public List<RoleSubjectRes> broadcasting(@DestinationVariable long roomId, @Payload GameStartReq gameStartReq) throws Exception {
        gameManagerMap.put(roomId, new GameManager(roomId, roomService, gameStartReq.getSubject())); //게임 매니저 생성 및 역할-제시어 분배
        log.info("게임 start");
        log.info("게임 시작 gameManager : {} " ,gameManagerMap.toString());
        return gameManagerMap.get(roomId).getAllRoleNameSubject(); //해당 방에 참가 중인 플레이어에게 각각 역할, 제시어 정보 보내주기
    }

    // 참가자들의 투표 정보를 요청받아 투표 참여한 참가자에게는 true를, 기권한 참가자에게는 false를 반환
    @MessageMapping("/liar/vote/{roomId}")
    @SendTo("/from/liar/vote/{roomId}")
    public VoteRes broadcasting(@DestinationVariable long roomId, @Payload VoteReq voteReq) throws Exception{
        log.info("투표한 사람: {} ", voteReq.getVote());
        gameManagerMap.get(roomId).setVoteInfo(voteReq.getVote()); //투표정보 저장
        log.info("게임 투표 gameManager : {} " ,gameManagerMap.toString());
        if(voteReq.getVote().equals("기권")) return new VoteRes(false);
        else return new VoteRes(true);
    }

    // 투표 결과를 참가자에게 알림(=게임 종료)
    @MessageMapping("/liar/result/{roomId}")
    @SendTo("/from/liar/result/{roomId}")
    public GameEndRes broadcasting(@DestinationVariable long roomId) throws Exception{
        log.info("투표 결과 알리기");
        log.info("게임 종료 gameManager : {} " ,gameManagerMap.toString());
        GameEndRes gameEndRes = gameManagerMap.get(roomId).getVoteResult(); //투표 결과 가져오기
        return gameEndRes;
    }
}
