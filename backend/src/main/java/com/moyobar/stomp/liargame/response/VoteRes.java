package com.moyobar.stomp.liargame.response;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 플레이어들로부터 투표 정보를 받았는지 여부 및 현재 몇 명이 투표에 참여했는지 정보를 반환
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class VoteRes {
    private int votecnt; //투표 참여한 참가자 수
    private Boolean participate; //중복 투표 여부
    private Boolean isvote; //기권이면 false, 누군가를 투표했다면 true
}
