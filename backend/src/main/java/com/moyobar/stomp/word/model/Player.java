package com.moyobar.stomp.word.model;

import com.moyobar.db.entity.user.User;
import lombok.Getter;
import lombok.Setter;

/**
 * 게임 참가자에 대한 정보 정의
 */

@Getter
@Setter
public class Player {
    private User user; //게임 참가자의 기본 회원 정보
    private int turn; //게임 참가자의 순서
    private int correct; // 정답 맞춘 횟수

    public Player(User user) {
        this.user = user;
    }

    @Override
    public String toString(){
        return "Player=[닉네임: "+user.getNickname()+", 순서: "+turn + ", 정답: "+correct+"]";
    }
}
