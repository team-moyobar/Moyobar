package com.moyobar.stomp.model.manager;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.moyobar.stomp.model.GameUpdateInfo;

import java.util.List;


@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public interface BaseGameManager {

    public List<GameUpdateInfo> getGameUpdateInfoList();
}
