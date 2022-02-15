package com.ssafy.stomp.liargame.model.manager;

import com.ssafy.stomp.liargame.model.Subject;
import com.ssafy.stomp.liargame.model.GamePlayer;
import lombok.extern.slf4j.Slf4j;

import java.util.*;

/**
 *  참가자에게 제시어 분배해주는 클래스
 */

@Slf4j
public class SubjectManager {

    // 게임 참가자에게 제시어 분배하기
    public static void assignSubjectToPlayers(GamePlayer players, String theme) {
        log.info("참가자 수 : {}" , players.countOfPlayers());

        log.info("방장이 선택한 주제 : {} ", theme);

        //방장이 선택한 주제(theme)에 맞는 제시어 가져오기
        Subject subject = new Subject(theme);
        List<String> subjects = subject.getSubjects();

        // 제시어 섞기~!!
        Collections.shuffle(Arrays.asList(subjects));
        String liarSub = subjects.get(0); // 라이어에게 줄 주제 하나 뽑고
        subjects.remove(0); // 그 주제는 제외시키기

        // 또 섞기~!!
        Collections.shuffle(Arrays.asList(subjects));
        String memberSub = subjects.get(0); // 일반 플레이어에게 줄 주제 하나 뽑기

        players.setSubjects(liarSub, memberSub);
    }
}
