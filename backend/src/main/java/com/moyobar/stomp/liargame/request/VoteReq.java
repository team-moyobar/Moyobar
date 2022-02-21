package com.moyobar.stomp.liargame.request;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
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
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class VoteReq {
    private String voter; // 투표 참여한 플레이어
    private String vote; // 플레이어가 누구를 투표했는지
}
