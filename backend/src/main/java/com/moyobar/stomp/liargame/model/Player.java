package com.moyobar.stomp.liargame.model;

import com.moyobar.stomp.liargame.model.role.Role;
import lombok.Getter;
import lombok.Setter;
import com.moyobar.db.entity.user.User;

/**
 * 게임 참가자에 대한 정보 정의
 */

@Getter
@Setter
public class Player {
    private User user; //게임 참가자의 기본 회원 정보
    private Role role; //게임 참가자의 역할(LIAR OR MEMBER)
    private String subject; //게임 참가자에게 주어지는 제시어 정보
    private boolean isVoteTurn; //투표 턴이 왔는지
    private String vote; //투표한 사람(기권 or 닉네임)

    public Player(User user) {
        this.user = user;
    }

    public boolean isLiar() {
        return this.role.isLiar();
    }

    @Override
    public String toString() {
        return "Player{" +
                "user=" + user.getNickname() +
                ", role=" + role +
                ", subject='" + subject + '\'' +
                ", isVoteTurn=" + isVoteTurn +
                ", vote='" + vote + '\'' +
                '}';
    }
}
