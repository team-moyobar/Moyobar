package com.ssafy.stomp.updown.response;

import com.ssafy.stomp.updown.model.GameStatus;
import com.ssafy.stomp.updown.model.UserStatus;
import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class GameStatusRes {

    private GameStatus gameStatus;
    private Map<String, UserStatus> userStatus;
}
