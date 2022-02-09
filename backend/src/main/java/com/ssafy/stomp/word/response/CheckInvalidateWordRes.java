package com.ssafy.stomp.word.response;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 사용자가 말한 단어가 사전에 등록된 단어인지 유무를 판단하기 위해 서버에 요청할 시, 서버가 응답할 메시지 형식 정의
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class CheckInvalidateWordRes {
    private String nickname;
    private String word;
    private String initial;
    private String result; //OK or Fail

    public CheckInvalidateWordRes(String nickname, String word, String initial){
        this.nickname = nickname;
        this.word = word;
        this.initial = initial;
    }
}
