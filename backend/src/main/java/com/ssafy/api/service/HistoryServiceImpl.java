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
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service("historyService")
public class HistoryServiceImpl implements HistoryService{

    @Autowired
    HistoryRepository historyRepository;

    @Autowired
    RoomService roomService;

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
    public History getHistoryInRoom(User user, Room room) {
        return historyRepository.findByUserAndRoomAndAction(user, room, ActionType.JOIN)
                .orElseThrow(RoomNotFoundException::new);
    }

    @Override
    public void leaveRoom(User user, Room room) {
        History history = getHistoryInRoom(user, room);

        history.setAction(ActionType.EXIT);
        history.setExited(LocalDateTime.now());

        List<User> users = getUserInRoom(room.getId());

        users.remove(user);

        if (users.size() == 0){
            room.setIsActive(1);
        }else if (room.getOwner() == user){
            room.setOwner(users.get(0));
        }

        roomService.updateRoom(room);
        historyRepository.save(history);
    }

    @Override
    public List<User> getUserInRoom(long roomId) {
        return historyRepository.findAllByRoomIdAndAction(roomId, ActionType.JOIN)
                .stream().map(History::getUser).collect(Collectors.toList());
    }
}
