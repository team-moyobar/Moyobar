package com.ssafy.stomp.liargame.controller;

import com.ssafy.api.service.RoomService;
import com.ssafy.db.entity.game.Game;
import com.ssafy.stomp.liargame.model.manager.GameManager;
import com.ssafy.stomp.liargame.request.VoteReq;
import com.ssafy.stomp.liargame.response.GameEndRes;
import com.ssafy.stomp.liargame.response.GameStartRes;
import com.ssafy.stomp.liargame.response.VoteRes;
import com.ssafy.stomp.model.service.GameService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 라이어게임용 컨트롤러
 */

@Slf4j
@RestController
public class LiarController {
    private static final String GAME_NAME = "라이어";

    @Autowired
    private RoomService roomService;
    @Autowired
    private GameService gameService;

    // 방 별로 게임 매니징하는 역할. 아래와 같이 Map 형식으로 각각의 방에 대한 게임 매니저 정보를 저장
    private static final class ManagerHolder {
        private static Map<Long, GameManager> gameManagerMap = new ConcurrentHashMap<>();
        ;
    }

    // 방장이 게임 시작 버튼 클릭
    // @Payload : 클라이언트로부터 넘어온 객체 정보 받아오기
    @MessageMapping("/liar/start/{roomId}")
    @SendTo("/from/liar/start/{roomId}")
    public GameStartRes broadStart(@DestinationVariable long roomId) throws Exception {
        GameManager gameManager = new GameManager(roomId, roomService); //게임 매니저 생성 및 역할-제시어 분배
        log.info("게임 start");
        log.info("게임 시작 gameManager : {} ", ManagerHolder.gameManagerMap.get(roomId));

        ManagerHolder.gameManagerMap.put(roomId, gameManager);

        //db 저장
        Game game = gameService.createGame(GAME_NAME);
        gameManager.setGameId(game.getId());
        gameService.createGameInRoom(roomService.getRoomById(roomId), game);
        return gameManager.getStartInfo();
    }

    // 참가자들의 투표 정보를 요청받아 투표 참여한 참가자에게는 true를, 기권한 참가자에게는 false를 반환
    @MessageMapping("/liar/vote/{roomId}")
    @SendTo("/from/liar/vote/{roomId}")
    public VoteRes broadVote(@DestinationVariable long roomId, @Payload VoteReq voteReq) throws Exception {
        GameManager gameManager = ManagerHolder.gameManagerMap.get(roomId);
        boolean isParticipate = gameManager.isParticipateVote(voteReq.getVoter());
        log.info("{}의 중복 투표 여부 : {}", voteReq.getVoter(), isParticipate);

        if (!isParticipate) {
            log.info("{}가 투표한 사람: {} ", voteReq.getVoter(), voteReq.getVote());
            gameManager.setVoteInfo(voteReq); //투표 참가 한번도 안 했던 플레이어만 투표 참가 가능
        }

        log.info("게임 투표 현황 gameManager : {} ", gameManager.toString());
        int voteCnt = gameManager.getVoterCnt();
        log.info("투표 참가자 현황(무효표 포함) voteCnt : {} ", voteCnt);
        log.info("플레이어 현황: {}", gameManager.getGamePlayers().getPlayers());

        if (voteReq.getVote().equals("기권")) {
            return new VoteRes(voteCnt, isParticipate, false);
        } else {
            return new VoteRes(voteCnt, isParticipate, true);
        }
    }

    // 투표 결과를 참가자에게 알림(=게임 종료)
    @MessageMapping("/liar/result/{roomId}")
    @SendTo("/from/liar/result/{roomId}")
    public GameEndRes broadResult(@DestinationVariable long roomId) throws Exception {
        GameManager gameManager = ManagerHolder.gameManagerMap.get(roomId);

        log.info("투표 결과 알리기");
        log.info("게임 종료 gameManager : {} ", gameManager.toString());
        log.info("게임 Manager list : {}", ManagerHolder.gameManagerMap.toString());

        GameEndRes gameEndRes = gameManager.getVoteResult(); //투표 결과 가져오기

        //db update(최초 1번)
        if (gameManager.getGameStatus()) {
            gameManager.gameEnd();
            List<String> winners = gameManager.getWinners();
            log.info("이긴 사람: {} ", winners.toString());

            gameService.updateGame(gameManager.getGameId(), gameManager.getGameUpdateInfoList());
        }

        return gameEndRes;
    }
}
