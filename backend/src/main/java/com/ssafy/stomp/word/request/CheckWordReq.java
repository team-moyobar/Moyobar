package com.ssafy.stomp.word.request;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 사용자가 말한 단어가 사전에 등록된 단어인지 유무를 판단하기 위해 서버에 요청할 시, 클라이언트가 보낼 메시지 형식 정의
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class CheckWordReq {
    private String nickname;
    private String word;
    private String initial;
}
