package com.moyobar.stomp.model.service;
import com.moyobar.db.entity.game.Game;
import com.moyobar.db.entity.room.Room;
import com.moyobar.db.entity.user.User;
import com.moyobar.stomp.model.GameUpdateInfo;

import java.util.List;

public interface GameService {
    Game createGame(String gameName);
    Game updateGame(long gameId, GameUpdateInfo info);
    Game updateGame(long gameId, List<GameUpdateInfo> infos);
    List<User> getWinners(long gameId);
    void createGameInRoom(Room room, Game game);
}
