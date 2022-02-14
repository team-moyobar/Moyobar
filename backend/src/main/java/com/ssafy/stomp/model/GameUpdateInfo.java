package com.ssafy.stomp.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GameUpdateInfo {

    private String nickname;
    private int addedScore;
    private boolean isWinner;
}
