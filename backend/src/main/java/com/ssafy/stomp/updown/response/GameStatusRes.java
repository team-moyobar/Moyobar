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
public class GameStatusRes {

    private int orderIndex;
    private int currentTurnCount;
    private int totalTurnCount;
    private List<String> userOrder;
    private int userAnswer;
    private GameResultType resultType;

    public static GameStatusRes of(GameManager gameManager, GameResultType result, int userAnswer) {
        GameStatusRes res = new GameStatusRes();
        res.setOrderIndex(gameManager.getOrderIndex());
        res.setCurrentTurnCount(gameManager.getCurrentTurnCount());
        res.setTotalTurnCount(gameManager.getTotalTurnCount());
        res.setUserOrder(gameManager.getUserOrder());
        res.setResultType(result);
        res.setUserAnswer(userAnswer);
        return res;
    }
}
