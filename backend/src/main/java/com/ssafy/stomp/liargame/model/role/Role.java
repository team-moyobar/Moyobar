package com.ssafy.stomp.liargame.model.role;

import com.ssafy.stomp.liargame.model.Player;

/**
 * 라이어 게임에서 주어지는 역할에 대한 추상클래스 정의
 */

public abstract class Role {
    private RoleType roleType;

    public Role(RoleType roleType) {
        this.roleType = roleType;
    }

    public String getRoleType() {
        return roleType.name();
    }

//    public abstract void vote(Player player);

    @Override
    public String toString() {
        return roleType.name();
    }

    public boolean isLiar() {
        return roleType.equals(RoleType.LIAR);
    }
}
