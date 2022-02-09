package com.ssafy.stomp.word.model;

import com.ssafy.db.entity.user.User;
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

    // 모든 player 정보 가져오기
    public List<Player> getPlayers() {
        List<Player> list = new ArrayList<>();

        for (Player player : this.players) {
            list.add(player);
        }

        return list;
    }
}
