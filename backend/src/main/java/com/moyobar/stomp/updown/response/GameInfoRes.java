package com.moyobar.stomp.updown.response;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.moyobar.stomp.updown.model.GameStatusType;
import com.moyobar.stomp.updown.model.manager.GameManager;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class GameInfoRes {

    private GameStatusType gameStatus;
    private CheckResultRes result;
    private int nextUserIndex;
    private int turnCount;
    private List<String> userOrder;

    public static GameInfoRes of(GameManager gameManager, CheckResultRes result){
        GameInfoRes res = new GameInfoRes();
        res.setGameStatus(gameManager.getGameStatus());
        res.setResult(result);
        res.setNextUserIndex(gameManager.getOrderIndex());
        res.setTurnCount(gameManager.getTurnCount());
        res.setUserOrder(gameManager.getUserOrder());

        return res;
    }
}
