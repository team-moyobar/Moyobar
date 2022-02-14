
package com.ssafy.stomp.liargame.model.manager;

import com.ssafy.api.service.RoomService;
import com.ssafy.db.entity.room.ActionType;
import com.ssafy.db.entity.user.User;
import com.ssafy.stomp.liargame.model.GamePlayer;
import com.ssafy.stomp.liargame.model.Player;
import com.ssafy.stomp.liargame.request.VoteReq;
import com.ssafy.stomp.liargame.response.GameEndRes;
import com.ssafy.stomp.liargame.response.RoleSubjectRes;
import com.ssafy.stomp.liargame.response.VotingStatusRes;
import com.ssafy.stomp.model.manager.BaseGameManager;
import com.ssafy.stomp.model.GameUpdateInfo;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

import java.util.*;

/**
 * 라이어 게임에 필요한 로직을 관리
 */

@Getter
@Setter
@Slf4j
@NoArgsConstructor
public class GameManager implements BaseGameManager {
    private RoomService roomService; //DB로부터 해당 방에 참가 중인 참가자 정보 얻어오기 위함
    private GamePlayer gamePlayers; //해당 방의 플레이어 정보
    private Map<String, Integer> votePlayers; //투표 정보
    private List<String> gameWinners; //승자 닉네임

    private Long roomId; //현재 방 번호
    private boolean isGameStarted; //게임 시작 여부
    private Long gameId;

    public boolean getGameStatus(){
        return this.isGameStarted;
    }

    //방 별로 라이어 게임 시작 후, 필요한 정보를 저장한다 : 유저별로 역할 분담 & 제시어 주기
    public GameManager (Long roomId, RoomService roomService, String theme) {
        this.roomId = roomId;
        this.roomService = roomService;
        this.isGameStarted= true;
        gameWinners = new ArrayList<>(); //초기화

        //해당 방에 있는 참가자 정보 모두 가져오기
        List<User> users = roomService.findUserListByRoomId(roomId, ActionType.JOIN);

        for(User s : users){
            log.info("게임 참가자 정보 : {} ", s.getNickname());
        }

        this.gamePlayers = new GamePlayer(users); //해당 유저들을 게임 플레이어로 등록

        // 투표 정보 담기 위한 해시맵 초기화
        this.votePlayers = new HashMap<>();
        for(Player p : this.gamePlayers.getPlayers()) {
            this.votePlayers.put(p.getUser().getNickname(), 0);
        }

        RoleManager.assignRoleToPlayers(this.gamePlayers); //역할 분담
        SubjectManager.assignSubectToPlayers(this.gamePlayers, theme); //제시어 분담
    }

    //유저의 역할과 제시어를 모두 return
    //ex) [ {nickname: 닉넴, roletype: LIAR, keyword: 하마 }, {nickname: 안녕, roletype: MEMBER, keyword: 오리 }, ... ]
    public List<RoleSubjectRes> getAllRoleNameSubject() {
        List<RoleSubjectRes> list = new ArrayList<>();

        List<Player> players = this.gamePlayers.getPlayers();

        for(int i=0; i<players.size(); i++){
            //i번째 플레이어의 정보를 list에 담기
            list.add(new RoleSubjectRes(players.get(i).getUser().getNickname(), players.get(i).getRole().getRoleType(), players.get(i).getSubject()));
        }

        return list;
    }

    // 참가자들이 투표한 사람이 누구인지에 대한 정보 저장
    public void setVoteInfo(VoteReq voteReq){
        String voteInfo = voteReq.getVote();

        // 누가 누굴 투표했는지 정보를 저장
        List<Player> players = this.gamePlayers.getPlayers();

        for(int i=0; i<players.size(); i++){
            if(voteReq.getVoter().equals(players.get(i).getUser().getNickname())){
                players.get(i).setVoteTurn(true); //해당 참가자는 투표에 방금 막 참여했음
                players.get(i).setVote(voteInfo); //해당 참가자가 투표한 사람
            }
        }

        // 투표 정보 갱신
        for(Map.Entry<String, Integer> e : this.votePlayers.entrySet()) {
            if(e.getKey().equals(voteInfo)) this.votePlayers.put(voteInfo, e.getValue()+1);
        }

        log.info("투표 현황: {}", this.votePlayers.toString());
    }

    //투표에 참가한 사람의 수 (무효표 상관없이)
    public int getVoterCnt(){
        List<Player> players = this.gamePlayers.getPlayers();
        int cnt = 0;

        for(int i=0; i<players.size(); i++){
            if(players.get(i).isVoteTurn()) cnt++;
        }

        return cnt;
    }

    public void gameEnd(){
        if(this.isGameStarted){ //게임 종료
            this.isGameStarted = false;
        }
    }

    // 투표 정보에 따라 게임 결과를 응답 & 이긴 사람 저장
    public GameEndRes getVoteResult(){
        String liar = this.gamePlayers.getLiar().getUser().getNickname(); //라이어
        List<Player> members = this.gamePlayers.getMembers();
        int mostVotePlayerCnt = 0; //가장 많은 득표 받은 사람의 득표 수 저장
        int mostVoteCnt=0; //최다득표수 동점인 사람 몇 명인지 카운팅

        // 득표 수 기준으로 내림 차순 정렬
        List<Map.Entry<String, Integer>> playerList = new ArrayList<Map.Entry<String, Integer>>(this.votePlayers.entrySet());

        Collections.sort(playerList, (p1, p2) -> {
            return p2.getValue().compareTo(p1.getValue());
        });

        for(Map.Entry<String, Integer> entry : playerList) {
            mostVotePlayerCnt = entry.getValue();
            break;
        }

        for(Map.Entry<String, Integer> entry : playerList) {
            //만약 많은 득표 받은 사람 여러명이면
            if(entry.getValue()==mostVotePlayerCnt){
                mostVoteCnt++; //카운팅
            }
        }

        log.info("{} 표가 가장 많은 득표 수, 동점자는 {} 명", mostVotePlayerCnt, mostVoteCnt);

        // 투표 현황 리스트
        List<VotingStatusRes> votingList = new ArrayList<>();

        log.info("투표 결과(내림차순)");
        for(Map.Entry<String, Integer> entry : playerList) {
            log.info("{} : {}", entry.getKey(), entry.getValue());
            votingList.add(new VotingStatusRes(entry.getKey(), entry.getValue()));
        }

        // 가장 많은 득표 수 받은 사람 == liar 한 명일 경우
        if(mostVoteCnt==1 && this.votePlayers.get(liar)==mostVotePlayerCnt) {
            for(Player p: members){
                gameWinners.add(p.getUser().getNickname());
            }

            return new GameEndRes(liar, votingList, "player");
        }
        else { //동점자 발생 및 다른 사람이 득표 많이 받은 경우
            gameWinners.add(liar);

            return new GameEndRes(liar, votingList, "liar");
        }
    }

    public List<String> getWinners(){
        return this.gameWinners;
    }

    @Override
    public String toString(){
        return "[라이어]: "+ this.gamePlayers.getLiar().getUser().getNickname()+", [투표]: "+votePlayers.toString();
    }

    @Override
    public List<GameUpdateInfo> getGameUpdateInfoList() {
        List<GameUpdateInfo> list = new ArrayList<>();
        int gameScore = getGameScore();
        for (String winner : gameWinners) {
            list.add(new GameUpdateInfo(winner, gameScore, true));
        }

        return list;
    }
    private int getGameScore(){
        if (gameWinners.size() == 1 && gameWinners.get(0).equals(gamePlayers.getLiar().getUser().getNickname())){
            return gamePlayers.countOfPlayers();
        }else{
            return 10;
        }

    }
}
