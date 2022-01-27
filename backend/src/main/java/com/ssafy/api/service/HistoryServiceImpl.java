package com.ssafy.api.service;

import com.ssafy.common.exception.BusinessException;
import com.ssafy.common.exception.RoomNotFoundException;
import com.ssafy.db.entity.ActionType;
import com.ssafy.db.entity.History;
import com.ssafy.db.entity.Room;
import com.ssafy.db.entity.User;
import com.ssafy.db.repository.HistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.swing.*;
import java.util.Optional;

@Service("historyService")
public class HistoryServiceImpl implements HistoryService{

    @Autowired
    HistoryRepository historyRepository;

    @Override
    public History createHistory(Room room, User user) {
        History history = new History();

        history.setUser(user);
        history.setRoom(room);

        return historyRepository.save(history);
    }

    @Override
    public boolean existsUserInRoom(long userId) {
        return historyRepository.existsByUserIdAndAction(userId, ActionType.JOIN);
    }

    @Override
    public int getCountOfUserInRoom(long roomId) {
        return historyRepository.countUserIdByRoomIdAndAction(roomId, ActionType.JOIN);
    }

    @Override
    public History getHistoryUserJoinInRoom(long userId, long roomId) {
        return historyRepository.findHistoryByUserIdAndRoomIdAndAction(userId, roomId, ActionType.JOIN)
                .orElseThrow(RoomNotFoundException::new);
    }

    @Override
    public void leaveRoom(History history) {
        history.setAction(ActionType.EXIT);

        historyRepository.save(history);
    }
}
