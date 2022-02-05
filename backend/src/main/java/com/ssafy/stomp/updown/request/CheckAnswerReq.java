package com.ssafy.stomp.updown.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CheckAnswerReq {
    private String nickname;
    private int number;
}
