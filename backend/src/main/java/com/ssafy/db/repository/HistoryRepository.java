package com.ssafy.db.repository;

import com.ssafy.db.entity.ActionType;
import com.ssafy.db.entity.History;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HistoryRepository extends JpaRepository<History, Long> {
    boolean existsByUserIdAndAction(long userId, ActionType actionType);
}
