package com.ssafy.stomp.liargame.response;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 *  라이어 게임 종료(투표 결과 응답) 시 보낼 메시지 형식 정의
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class GameEndRes {
    private String liar; //라이어가 누구인지
    private String mostvote; //가장 많은 투표 받은 사람
    private String winner; //이긴 사람 - player or liar
}
