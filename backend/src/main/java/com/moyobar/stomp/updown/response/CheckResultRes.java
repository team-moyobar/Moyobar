package com.moyobar.stomp.updown.response;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.moyobar.stomp.updown.model.CheckResultType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class CheckResultRes {
    private String userName;
    private int userAnswer;
    private CheckResultType resultType;

    public static CheckResultRes of(String userName, int userAnswer, CheckResultType resultType){
        CheckResultRes res = new CheckResultRes();
        res.setUserName(userName);
        res.setUserAnswer(userAnswer);
        res.setResultType(resultType);
        return res;
    }
}
