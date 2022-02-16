package com.ssafy.api.service;

import com.ssafy.common.exception.RoomNotFoundException;
import com.ssafy.db.entity.room.ActionType;
import com.ssafy.db.entity.room.History;
import com.ssafy.db.entity.room.Room;
import com.ssafy.db.entity.user.User;
import com.ssafy.db.repository.room.HistoryRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service("historyService")
public class HistoryServiceImpl implements HistoryService {

    @Autowired
    private HistoryRepository historyRepository;
    @Autowired
    private RoomService roomService;

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
        history.setExited(new Date());

        List<User> users = getUserInRoom(room.getId());

        users.remove(user);

        if (users.size() == 0) {
            room.setIsActive(1);
        } else if (room.getOwner() == user) {
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
