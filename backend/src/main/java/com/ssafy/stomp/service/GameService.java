package com.ssafy.stomp.service;
import com.ssafy.db.entity.game.Game;
import com.ssafy.db.entity.user.User;

import java.util.List;

public interface GameService {
    Game createGame(String gameName);
    Game updateGame(long gameId, String winner);
    Game updateGame(long gameId, List<String> winners);
    List<User> getWinners(long gameId);
}
