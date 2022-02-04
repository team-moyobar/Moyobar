package com.ssafy.stomp.liargame.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 *  라이어 게임 시작 시 클라이언트가 보낼 메시지 형식 정의
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class GameStartMessage {
    //private long roomId;
    private String subject; //방장이 선택한 주제
}
