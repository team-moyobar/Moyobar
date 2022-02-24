package com.moyobar.stomp.word.model.manager;

import com.moyobar.api.service.RoomService;
import com.moyobar.db.entity.room.ActionType;
import com.moyobar.db.entity.user.User;
import com.moyobar.stomp.model.manager.BaseGameManager;
import com.moyobar.stomp.model.GameUpdateInfo;
import com.moyobar.stomp.word.model.InitialConsonant;
import com.moyobar.stomp.word.model.Player;
import com.moyobar.stomp.word.model.GamePlayer;
import com.moyobar.stomp.word.response.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

import java.util.*;

/**
 * 초성 게임에 필요한 로직을 관리
 */

@Getter
@Setter
@Slf4j
@NoArgsConstructor
public class GameManager implements BaseGameManager {
    private RoomService roomService; //DB로부터 해당 방에 참가 중인 참가자 정보 얻기
    private GamePlayer gamePlayers; //해당 방의 플레이어 정보
    private List<String> gameWinners; //승자 닉네임

    private List<NickAndTurnRes> gameTurnInfo; //게임 순서 정보
    private List<PlayerRes> gameResults; //게임 결과 정보
    private List<String> words; //게임 진행하며 맞췄었던 단어모음

    private String randomWord; //초성값
    private Long roomId; //현재 방 번호
    private int count; // 게임 횟수 (3회)
    private boolean isGameStarted; //게임 시작 여부
    private Long gameId; //게임 id
    private String owner; //방장 정보

    public boolean getGameStatus() {
        return this.isGameStarted;
    }

    // 방 별로 초성 게임 시작 후, 필요한 정보를 저장한다 : 랜덤 초성 정보 & 유저별로 게임 순서 주기
    public GameManager(Long roomId, RoomService roomService) {
        //초기화
        this.roomId = roomId;
        this.roomService = roomService;
        this.isGameStarted = true;
        this.count = 0;
        this.owner = roomService.findOwnerByRoomId(roomId);
        gameResults = new ArrayList<>();
        gameTurnInfo = new ArrayList<>();
        gameWinners = new ArrayList<>();
        words = new ArrayList<>();

        //해당 방에 있는 참가자 정보 모두 가져오기
        List<User> users = roomService.findUserListByRoomId(roomId, ActionType.JOIN);

        for (User s : users) {
            log.info("게임 참가자 정보 : {} ", s.getNickname());
        }

        log.info("방장은: {}", owner);

        this.gamePlayers = new GamePlayer(users); //해당 유저들을 게임 플레이어로 등록

        gameTurnInfo = getAllNickAndTurnInfo(); //순서 랜덤 정하기
        randomWord = InitialConsonant.getRandomWord(); //랜덤 초성값
    }

    //유저의 닉네임, 순서정보를 반환
    //방장이 첫번째 순서로
    public List<NickAndTurnRes> getAllNickAndTurnInfo() {
        List<NickAndTurnRes> list = new ArrayList<>();

        List<Player> players = this.gamePlayers.getPlayers();
        Player owner = null;

        //방장은 첫 번째 순서로 먼저 지정해주기
        for (int i = 0; i < players.size(); i++) {
            if(players.get(i).getUser().getNickname().equals(this.owner)){
                owner = players.get(i);
                players.get(i).setTurn(1);
                list.add(new NickAndTurnRes(players.get(i).getUser().getNickname(), 1)); //방장은 첫번째 순서
            }
        }

        players.remove(owner); //방장은 삭제

        Collections.shuffle(players); //나머지 참가자들 순서 무작위로 섞기

        for (int i = 0; i < players.size(); i++) {
            players.get(i).setTurn(i + 2); //각각의 Player 정보에도 순서정보 설정하기
            list.add(new NickAndTurnRes(players.get(i).getUser().getNickname(), i + 2)); //i번째 플레이어의 정보를 list에 담기
        }

        return list;
    }

    // 플레이어 정보(닉네임-순서)를 반환
    public PlayTurnRes getAllUserInfo() {
        return new PlayTurnRes(this.gameTurnInfo);
    }

    // 게임 시작 시, 첫번째 플레이어 정보(닉네임), 초성, 게임 전체 턴 횟수 반환
    public NextPlayerRes getFirstPlayer(String currPlayer) {
        log.info("플레이어 순서 정보: {}", this.gameTurnInfo.toString());
        log.info("첫 번째 플레이어 정보: {}", this.gameTurnInfo.get(0).getNickname());
        log.info("게임 카운트 수: {} ", this.count);

        return new NextPlayerRes(this.gameTurnInfo.get(0).getNickname(), this.randomWord, this.count);
    }

    // 다음 플레이어 정보(닉네임), 초성, 게임 전체 턴 횟수 반환
    public NextPlayerRes getNextPlayer(String currPlayer) {
        log.info("플레이어 순서 정보 {} : ", this.gameTurnInfo.toString());
        int countOfPlayer = this.gamePlayers.getPlayers().size();
        int nextPlayerIndex = 0; //다음 턴의 플레이어 index

        for (int i = 0; i < countOfPlayer; i++) {
            //현재 플레이어 다음 index 위치에 있는 플레이어 == 다음 턴의 플레이어
            if (this.gameTurnInfo.get(i).getNickname().equals(currPlayer)) {
                nextPlayerIndex = (i + 1) % (countOfPlayer);
            }
        }

        log.info("다음 플레이어 순서는? : {}", nextPlayerIndex + 1);

        //그 다음 턴의 플레이어가 첫 번째 턴의 플레이어일 때
        if (nextPlayerIndex == 0) this.count++; //한 바퀴 돌았으므로 ++

        log.info("게임 카운트 수: {} ", this.count);

        return new NextPlayerRes(this.gameTurnInfo.get(nextPlayerIndex).getNickname(), this.randomWord, this.count);
    }

    //플레이어가 정답 맞췄을 경우, 정답 맞춘 개수를 갱신
    public void setPlusGameScore(String nickname) {
        List<Player> players = this.gamePlayers.getPlayers();

        for (Player p : players) {
            if (p.getUser().getNickname().equals(nickname)) {
                p.setCorrect(p.getCorrect() + 1);
            }
        }

        log.info("현재 참가자들의 정답 정보: {}", players.toString());
    }

    //게임 진행 중, 플레이어가 맞춘 단어들을 저장
    public void addWord(String answerWord) {
        this.words.add(answerWord);
    }

    //방금 말한 단어가 새로운 단어인지(이전에 누군가가 말했던 단어 아닌지) 여부를 반환
    public boolean isNewWord(String word) {
        for (String s : this.words) {
            if (s.equals(word)) return false;
        }

        return true;
    }

    //게임 결과 반환 및 우승자 선정
    public GameEndRes getGameEndInfo() {
        int mostCorrPlayerCnt = 0; //가장 많이 단어를 맞춘 사람의 정답 횟수

        List<Player> players = this.gamePlayers.getPlayers();

        //플레이어가 3턴 동안 맞춘 단어 개수를 gameResults에 저장
        for (Player p : players) {
            this.gameResults.add(new PlayerRes(p.getUser().getNickname(), p.getCorrect()));
        }

        // 내림차순 정렬
        Collections.sort(this.gameResults);

        // 최고 점수
        mostCorrPlayerCnt = gameResults.get(0).getCorrcnt();
        log.info("최고 점수: {}", mostCorrPlayerCnt);

        //우승자 선정
        for (PlayerRes p : this.gameResults) {
            if (mostCorrPlayerCnt == p.getCorrcnt()) this.gameWinners.add(p.getNickname());
        }

        log.info("게임 우승자들: {}", this.gameWinners.toString());

        GameEndRes gameEndRes = new GameEndRes(this.gameResults);

        return gameEndRes;
    }

    //게임 우승자 반환
    public List<String> getWinners() {
        return this.gameWinners;
    }

    //게임 종료
    public void gameEnd() {
        if (this.isGameStarted) {
            this.isGameStarted = false;
        }
    }

    @Override
    public String toString() {
        return "[초성]: " + this.randomWord + ", [플레이어 순서]: " + this.gameTurnInfo.toString();
    }

    @Override
    public List<GameUpdateInfo> getGameUpdateInfoList() {
        List<GameUpdateInfo> list = new ArrayList<>();
        int winnerCount = gameWinners.size();
        int count = 0;
        for (PlayerRes playerRes : gameResults) {
            list.add(new GameUpdateInfo(playerRes.getNickname(), playerRes.getCorrcnt() * 3, count++ < winnerCount));
        }

        list.remove(list.size() - 1);

        return list;
    }
}
