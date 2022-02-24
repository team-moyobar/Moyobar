package com.moyobar.stomp.liargame.model;

import com.moyobar.db.entity.user.User;
import com.moyobar.stomp.liargame.model.role.Role;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.List;

/**
 * 게임 참가자들에 관련된 로직 정의
 */

@Slf4j
public class GamePlayer {
    private List<Player> players; //게임 참가자 정보

    // 참가자 리스트 추가하는 생성자
    public GamePlayer(List<User> users) {
        this.players = new ArrayList<>();

        for (User user : users) {
            this.players.add(new Player(user));
        }
    }

    // 게임 참가자 수
    public int countOfPlayers() {
        return this.players.size();
    }

    // 라이어 수
    public int countOfLiar() { return (int) this.players.stream().filter(player -> player.isLiar()).count(); }

    // 라이어 누구?
    public Player getLiar(){
        for (int i = 0; i < countOfPlayers(); i++) { // role 분배
            if(this.players.get(i).getRole().isLiar()) {
                log.info("참가자 {} 는 라이어 ",this.players.get(i).getUser().getNickname());
                return players.get(i);
            }
        }

        return null;
    }

    // 일반 플레이어 누구?
    public List<Player> getMembers(){
        List<Player> members = new ArrayList<>();

        for (int i = 0; i < countOfPlayers(); i++) { // role 분배
            if(this.players.get(i).getRole().isLiar()) {
                continue;
            }
            members.add(this.players.get(i));
        }

        return members;
    }

    // 랜덤 역할 분배
    public void setRole(List<Role> roles) {
        for (int i = 0; i < countOfPlayers(); i++) { // role 분배
            this.players.get(i).setRole(roles.get(i));
            log.info("참가자 {} 의 역할 : {} ",this.players.get(i).getUser().getNickname(), roles.get(i));
        }
    }

    // 제시어 분배
    public void setSubjects(String subject){
        for (int i = 0; i < countOfPlayers(); i++) { // subject 분배
            this.players.get(i).setSubject(subject);
            log.info("참가자 {} 의 제시어 : {} ",this.players.get(i).getUser().getNickname(), this.players.get(i).getSubject());
        }
    }

    // 모든 player 정보 가져오기
    public List<Player> getPlayers() {
        List<Player> list = new ArrayList<>();

        for (Player player : this.players) {
            list.add(player);
        }

        return list;
    }

    // 해당 player 정보 가져오기
    public Player getPlayer(String nickname) {
        for (Player player : this.players) {
            if (player.getUser().getNickname().equals(nickname)) {
                return player;
            }
        }
        return null;
    }
}
