package com.ssafy.stomp.updown.response;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.ssafy.stomp.updown.model.GameResultType;
import com.ssafy.stomp.updown.model.manager.GameManager;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class PlayGameStatusRes extends BaseGameStatusRes{

    private int turnIndex;
    private List<String> userOrder;
    private int userAnswer;
    private GameResultType result;

    public static PlayGameStatusRes of(GameManager gameManager, GameResultType result) {
        PlayGameStatusRes res = new PlayGameStatusRes();
        res.setGameStatus(gameManager.getGameStatus());
        res.setUserInfo(gameManager.getUserInfo());
        res.setTurnIndex(gameManager.getTurnIndex());
        res.setUserOrder(gameManager.getUserOrder());
        res.setResult(result);

        return res;
    }

    public static PlayGameStatusRes of(GameManager gameManager, GameResultType result, int userAnswer) {
        PlayGameStatusRes res = of(gameManager, result);
        res.setUserAnswer(userAnswer);
        return res;
    }

}
