package com.ssafy.stomp.service;
import com.ssafy.db.entity.Game;
import com.ssafy.db.entity.GameCategory;
import com.ssafy.db.entity.User;

public interface GameService {
    Game createGame(GameCategory category);
    Game updateGame(long gameId, User winner);
}
