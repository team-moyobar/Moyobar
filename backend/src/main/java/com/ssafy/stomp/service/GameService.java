package com.ssafy.stomp.service;
import com.ssafy.db.entity.Game;
import com.ssafy.db.entity.User;

public interface GameService {
    Game createGame(String gameName);
    Game updateGame(long gameId, String winner);
}
