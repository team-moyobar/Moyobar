package com.moyobar.stomp.liargame.model.manager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import com.moyobar.stomp.liargame.model.role.Liar;
import com.moyobar.stomp.liargame.model.role.Member;
import com.moyobar.stomp.liargame.model.role.Role;
import com.moyobar.stomp.liargame.model.GamePlayer;
import lombok.extern.slf4j.Slf4j;

/**
 *  참가자 역할 분배해주는 클래스
 */

@Slf4j
public class RoleManager {

    // 게임 참가자에게 역할 분담하기
    public static void assignRoleToPlayers(GamePlayer players) {
        log.info("참가자 수 : {}" , players.countOfPlayers());

        // 역할 분담하기: 1명은 라이어, 나머지는 일반 유저
        List<Role> roles = new ArrayList<>();

        // 라이어는 한 명
        roles.add(new Liar());

        // 나머지 인원은 일반 유저
        for(int i = 0; i < players.countOfPlayers()-1; i++) {
            roles.add(new Member());
        }

        // 역할 분담 섞기~!! 누가 라이어가 될 지 아무도 모름
        Collections.shuffle(roles);
        players.setRole(roles);
    }
}
