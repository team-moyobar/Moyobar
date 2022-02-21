package com.moyobar.stomp.liargame.model.role;

/**
 * 일반 플레이어의 역할(타입) 정의
 */

public class Member extends Role {
    public Member() {
        super(RoleType.PLAYER);
    }
}
