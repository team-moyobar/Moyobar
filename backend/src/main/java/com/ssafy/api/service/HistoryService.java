package com.ssafy.api.service;

import com.ssafy.db.entity.History;
import com.ssafy.db.entity.Room;
import com.ssafy.db.entity.User;

public interface HistoryService {
    History createHistory(Room room, User user);

    boolean existsUserInRoom(long userId);

    int getCountOfUserInRoom(long roomId);

    History getHistoryUserJoinInRoom(long userId, long roomId);

    void leaveRoom(History history);
}
