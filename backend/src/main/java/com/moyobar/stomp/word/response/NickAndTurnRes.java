package com.moyobar.stomp.word.response;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 플레이어들의 닉네임, 순서 정보
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class NickAndTurnRes {
    private String nickname;
    private int turn;

    @Override
    public String toString(){
        return "["+nickname+", "+turn+"]";
    }
}
