package com.ssafy.stomp.liargame.model;

import com.ssafy.stomp.liargame.model.role.Role;
import lombok.Getter;
import lombok.Setter;
import com.ssafy.db.entity.user.User;

/**
 * 게임 참가자에 대한 정보 정의
 */

@Getter
@Setter
public class Player {
    private User user; //게임 참가자의 기본 회원 정보
    private Role role; //게임 참가자의 역할(LIAR OR MEMBER)
    private String subject; //게임 참가자에게 주어지는 제시어 정보

    public Player(User user) {
        this.user = user;
    }

    public boolean isLiar() {
        return this.role.isLiar();
    }
}
