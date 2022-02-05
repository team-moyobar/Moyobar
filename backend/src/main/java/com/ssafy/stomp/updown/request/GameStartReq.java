package com.ssafy.stomp.updown.request;

import com.ssafy.stomp.updown.model.GameType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GameStartReq {
    GameType gameType;
    int answer;
}
