package com.ssafy.stomp.liargame.model.manager;

import com.ssafy.api.service.RoomService;
import com.ssafy.db.entity.ActionType;
import com.ssafy.stomp.liargame.model.Player;

import com.ssafy.stomp.liargame.response.GameEndRes;
import com.ssafy.stomp.liargame.model.GamePlayer;
import com.ssafy.stomp.liargame.response.RoleSubjectRes;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import com.ssafy.db.entity.User;

import java.util.*;

/**
 * 라이어 게임에 필요한 로직을 관리
 */

@Getter
@Setter
@Slf4j
@NoArgsConstructor
public class GameManager {
    private RoomService roomService; //DB로부터 해당 방에 참가 중인 참가자 정보 얻어오기 위함
    private GamePlayer gamePlayers; //해당 방의 플레이어 정보
    private Map<String, Integer> votePlayers; //투표 정보

    private Long roomId; //현재 방 번호
    private boolean isGameStarted; //게임 시작 여부

    //방 별로 라이어 게임 시작 후, 필요한 정보를 저장한다 : 유저별로 역할 분담 & 제시어 주기
    public GameManager (Long roomId, RoomService roomService, String theme) {
        this.roomId = roomId;
        this.roomService = roomService;
        this.isGameStarted= true;

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
    public void setVoteInfo(String voteInfo){
        // 투표 정보 갱신
        for(Map.Entry<String, Integer> e : this.votePlayers.entrySet()) {
            if(e.getKey().equals(voteInfo)) this.votePlayers.put(voteInfo, e.getValue()+1);
        }

        log.info("투표 현황: {}", this.votePlayers.toString());
    }

    // 투표 정보에 따라 게임 결과를 응답
    public GameEndRes getVoteResult(){
        String liar = this.gamePlayers.getLiar().getUser().getNickname();
        int playerCnt = this.gamePlayers.countOfPlayers();
        String mostVote=null;

        // 가장 많은 득표 수 받은 사람 구하기
        List<Map.Entry<String, Integer>> playerList = new ArrayList<Map.Entry<String, Integer>>(this.votePlayers.entrySet());

        // 득표 수 기준으로 내림 차순 정렬
        Collections.sort(playerList, (p1, p2) -> {
            return p2.getValue().compareTo(p1.getValue());
        });

        // 내림차순 정렬이 되었으므로 해시맵에서 가장 먼저 뽑아오는 데이터가 곧 가장 많은 득표 수 받은 사람
        for(Map.Entry<String, Integer> entry : playerList) {
            mostVote = entry.getKey();
            break;
        }

        log.info("투표 결과(내림차순)");
        for(Map.Entry<String, Integer> entry : playerList) {
            log.info("{} : {}", entry.getKey(), entry.getValue());
        }

        // 과반수 이상이 라이어를 잘 지목했다면
        if(this.votePlayers.get(liar) >= Math.ceil(playerCnt/2+0.0)) {
            return new GameEndRes(liar, mostVote, "player");
        }
        else {
            return new GameEndRes(liar, mostVote, "liar");
        }
    }

    @Override
    public String toString(){
        return "[라이어]: "+ this.gamePlayers.getLiar().getUser().getNickname()+", [투표]: "+votePlayers.toString();
    }
}
