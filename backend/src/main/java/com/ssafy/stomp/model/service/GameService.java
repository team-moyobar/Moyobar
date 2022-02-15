package com.ssafy.stomp.model.service;
import com.ssafy.db.entity.game.Game;
import com.ssafy.db.entity.game.GameInRoom;
import com.ssafy.db.entity.room.Room;
import com.ssafy.db.entity.user.User;
import com.ssafy.stomp.model.GameUpdateInfo;

import java.util.List;

public interface GameService {
    Game createGame(String gameName);
    Game updateGame(long gameId, GameUpdateInfo info);
    Game updateGame(long gameId, List<GameUpdateInfo> infos);
    List<User> getWinners(long gameId);
    void createGameInRoom(Room room, Game game);
}
