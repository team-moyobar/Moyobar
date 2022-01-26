package com.ssafy.db.repository;

import com.ssafy.db.entity.ActionType;
import com.ssafy.db.entity.History;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HistoryRepository extends JpaRepository<History, Long> {
    boolean existsByUserIdAndAction(long userId, ActionType actionType);

    int countUserIdByRoomIdAndAction(long roomId, ActionType actionType);

    Optional<History> findHistoryByUserIdAndRoomIdAndAction(long userId, long roomId, ActionType actionType);
}
