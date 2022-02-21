package com.moyobar.api.service;

import com.moyobar.db.entity.room.History;
import com.moyobar.db.entity.room.Room;
import com.moyobar.db.entity.user.User;

import java.util.List;

public interface HistoryService {
    History createHistory(Room room, User user);

    boolean existsUserInRoom(long userId);

    void leaveRoom(User user, Room room);

    List<User> getUserInRoom(long roomId);

    History getHistoryInRoom(User user, Room room);
}
