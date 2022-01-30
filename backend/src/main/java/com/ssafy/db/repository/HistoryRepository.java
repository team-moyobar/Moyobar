package com.ssafy.db.repository;

import com.ssafy.db.entity.ActionType;
import com.ssafy.db.entity.History;
import com.ssafy.db.entity.Room;
import com.ssafy.db.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HistoryRepository extends JpaRepository<History, Long> {
    boolean existsByUserIdAndAction(long userId, ActionType actionType);

    Optional<History> findByUserAndRoomAndAction(User user, Room room, ActionType actionType);

    List<History> findAllByRoomAndAction(Room room, ActionType actionType);
}
