package com.moyobar.stomp.liargame.response;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
/**
 * 주제 및 플레이어의 닉네임, 역할과 제시어 정보 배열 응답
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class GameStartRes {
    private String subject;
    private List<RoleKeywordRes> rolekeyword;
}
