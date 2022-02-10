package com.ssafy.stomp.word.controller;

import com.ssafy.api.service.RoomService;
import com.ssafy.db.entity.game.Game;
import com.ssafy.stomp.word.model.service.WordCheckService;
import com.ssafy.stomp.word.request.CheckWordReq;
import com.ssafy.stomp.word.response.*;
import com.ssafy.stomp.word.model.manager.GameManager;
import com.ssafy.stomp.service.GameService;

import com.ssafy.stomp.word.request.CurrPlayerReq;
import lombok.RequiredArgsConstructor;
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
 * 초성 게임용 컨트롤러 정의
 */

@Slf4j
@RestController
@RequiredArgsConstructor
public class WordController {
    private static final String GAME_NAME = "초성";

    @Autowired
    private RoomService roomService;
    @Autowired
    private GameService gameService;
    @Autowired
    private WordCheckService wordCheckService;

    // 방 별로 게임 매니징하는 역할. 아래와 같이 Map 형식으로 각각의 방에 대한 게임 매니저 정보를 저장
    private static final class ManagerHolder {
        private static Map<Long, GameManager> gameManagerMap = new ConcurrentHashMap<>();
    }

    // 초성 게임 시작 요청 시
    @MessageMapping("/word/start/{roomId}")
    @SendTo("/from/word/start/{roomId}")
    public PlayTurnRes broadcastStart(@DestinationVariable long roomId) throws Exception {
        GameManager gameManager = new GameManager(roomId, roomService);

        log.info("초성 게임 start");

        ManagerHolder.gameManagerMap.put(roomId, gameManager);
        log.info("초성 게임 시작 gameManager : {} ", ManagerHolder.gameManagerMap.get(roomId));

        //db 저장
        Game game = gameService.createGame(GAME_NAME);
        gameManager.setGameId(game.getId());
        gameService.createGameInRoom(roomService.getRoomById(roomId), game);

        return gameManager.getAllUserInfo();
    }

    // 다음 턴의 사용자 정보 요청 시
    @MessageMapping("/word/next/{roomId}")
    @SendTo("/from/word/next/{roomId}")
    public NextPlayerRes broadcastNext(@DestinationVariable long roomId, @Payload CurrPlayerReq currPlayerReq) throws Exception {
        GameManager gameManager = ManagerHolder.gameManagerMap.get(roomId);
        log.info("현재 턴은 {} 입니다. ", currPlayerReq.getCurrent());

        NextPlayerRes nextPlayer = null;

        if(currPlayerReq.getCurrent().length()==0){ //공백 문자열을 받았을 시에는 첫 번째 플레이어 반환
            nextPlayer = gameManager.getFirstPlayer(currPlayerReq.getCurrent());
        }else{
            nextPlayer = gameManager.getNextPlayer(currPlayerReq.getCurrent());
        }

        log.info("다음 턴은 {} 입니다. ", nextPlayer.getNext());

        return nextPlayer;
    }

    // 단어 체크 요청 시
    @MessageMapping("/word/check/{roomId}")
    @SendTo("/from/word/check/{roomId}")
    public CheckInvalidateWordRes broadcastCheck(@DestinationVariable long roomId, @Payload CheckWordReq checkWordReq) throws Exception {
        GameManager gameManager = ManagerHolder.gameManagerMap.get(roomId);
        log.info("현재 플레이어: {}, 입력단어: {}, 초성: {}", checkWordReq.getNickname(), checkWordReq.getWord(), checkWordReq.getInitial());
        CheckInvalidateWordRes checkInvalidateWordRes = new CheckInvalidateWordRes(checkWordReq.getNickname(), checkWordReq.getWord(), checkWordReq.getInitial());

        //사용자가 단어 입력 안 했을 시에는 바로 return fail
        if(checkWordReq.getWord().trim().length()==0) {
            checkInvalidateWordRes.setResult("Fail");
            return checkInvalidateWordRes;
        }

        boolean check_initial = false;
        boolean check_dictionary = false;
        boolean check_newWord = false;

        //1. 초성에 맞는 단어인지 확인
        check_initial = wordCheckService.equalsToWord(checkWordReq.getInitial(), checkWordReq.getWord());
        //2. 사전에 등록된 단어인지 확인
        check_dictionary = wordCheckService.isInDictionary(checkWordReq.getWord());
        //3. 이전에 본인, 혹은 다른 플레이어가 말하지 않았던 새로운 단어
        check_newWord = gameManager.isNewWord(checkWordReq.getWord());

        if(check_initial && check_dictionary && check_newWord) {
            checkInvalidateWordRes.setResult("OK");
            gameManager.setPlusGameScore(checkWordReq.getNickname()); //해당 플레이어가 맞춘 개수 갱신
            gameManager.addWord(checkWordReq.getWord()); //맞춘 단어는 모아두기
        } else checkInvalidateWordRes.setResult("Fail");

        return checkInvalidateWordRes;
    }

    // 게임 종료 이후, 게임 결과 요청 시
    @MessageMapping("/word/result/{roomId}")
    @SendTo("/from/word/result/{roomId}")
    public GameEndRes broadcastEnd(@DestinationVariable long roomId) throws Exception{
        GameManager gameManager = ManagerHolder.gameManagerMap.get(roomId);
        log.info("게임 종료 요청 : {} ", gameManager.toString());

        GameEndRes gameEndRes = null;

        //db update(최초 1번)
        if(gameManager.getGameStatus()){
            gameManager.gameEnd();
            gameEndRes = gameManager.getGameEndInfo(); //결과 가져오기
            log.info("플레이어별 맞춘 횟수: {} ", gameEndRes.toString());
            List<String> winners = gameManager.getWinners();

            gameService.updateGame(gameManager.getGameId(), winners);
        }

        return gameEndRes;
    }
}
