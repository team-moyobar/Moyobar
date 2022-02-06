package com.ssafy.stomp.updown.response;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.ssafy.stomp.updown.model.GameResultType;
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
}
