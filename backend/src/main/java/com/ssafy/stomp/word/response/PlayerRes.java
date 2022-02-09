package com.ssafy.stomp.word.response;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 플레이어의 게임 결과값 정의
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class PlayerRes implements Comparable<PlayerRes>{
    private String nickname; //닉네임
    private int corrcnt; //맞춘 개수

    //내림차순 정렬
    @Override
    public int compareTo(PlayerRes o) {
        return Integer.compare(o.corrcnt, this.corrcnt);
    }

    @Override
    public String toString(){
        return "{nickname: "+this.nickname + ", corrcnt: " + this.corrcnt +"}";
    }
}
