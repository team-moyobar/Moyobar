package com.ssafy.stomp.updown.response;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.ssafy.stomp.updown.model.GameStatus;
import com.ssafy.stomp.updown.model.UserInfo;
import com.ssafy.stomp.updown.model.manager.GameManager;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class BaseGameStatusRes {

    private GameStatus gameStatus;
    private List<UserInfo> userInfo;

    public static BaseGameStatusRes of(GameManager gameManager){
        BaseGameStatusRes res = new BaseGameStatusRes();
        res.setGameStatus(gameManager.getGameStatus());
        res.setUserInfo(gameManager.getUserInfo());

        return res;
    }
}
