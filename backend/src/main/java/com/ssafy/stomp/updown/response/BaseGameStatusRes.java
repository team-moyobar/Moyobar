package com.ssafy.stomp.updown.response;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.ssafy.stomp.updown.model.GameStatus;
import com.ssafy.stomp.updown.model.UserInfo;
import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class BaseGameStatusRes {

    private GameStatus gameStatus;
    private Map<String, UserInfo> userInfo;

}
