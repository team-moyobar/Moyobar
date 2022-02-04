package com.ssafy.stomp.liargame.model.manager;

import com.ssafy.api.service.RoomService;
import com.ssafy.db.entity.ActionType;
import com.ssafy.stomp.liargame.model.Player;

import com.ssafy.stomp.liargame.response.GamePlayer;
import com.ssafy.stomp.liargame.response.RoleSubjectResult;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import com.ssafy.db.entity.User;

import java.util.ArrayList;
import java.util.List;

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

        RoleManager.assignRoleToPlayers(this.gamePlayers); //역할 분담
        SubjectManager.assignSubectToPlayers(this.gamePlayers, theme); //제시어 분담
    }

    //유저의 역할과 제시어를 모두 return
    //ex) { {nickname: 닉넴, roleType: LIAR, subject: 하마 }, {nickname: 안녕, roleType: MEMBER, subject: 오리 }, ... }
    public List<RoleSubjectResult> allRoldNameAndSubject() {
        List<RoleSubjectResult> list = new ArrayList<>();

        List<Player> players = this.gamePlayers.getPlayers();

        for(int i=0; i<players.size(); i++){
            //i번째 플레이어의 정보를 list에 담기
            list.add(new RoleSubjectResult(players.get(i).getUser().getNickname(), players.get(i).getRole().getRoleType(), players.get(i).getSubject()));
        }

        return list;
    }

    @Override
    public String toString() {
        return "GameManager{" +
                "gamePlayers=" + gamePlayers +
                ", roomId=" + roomId +
                ", isGameStarted=" + isGameStarted +
                '}';
    }
}
