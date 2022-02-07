package com.ssafy.api.service;

import com.ssafy.db.entity.History;
import com.ssafy.db.entity.Room;
import com.ssafy.db.entity.User;

import java.util.List;

public interface HistoryService {
    History createHistory(Room room, User user);

    boolean existsUserInRoom(long userId);

    void leaveRoom(User user, Room room);

    List<User> getUserInRoom(long roomId);

    History getHistoryInRoom(User user, Room room);
}
