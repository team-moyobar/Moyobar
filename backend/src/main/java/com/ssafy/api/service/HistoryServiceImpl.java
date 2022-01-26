package com.ssafy.api.service;

import com.ssafy.db.entity.ActionType;
import com.ssafy.db.entity.History;
import com.ssafy.db.repository.HistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("historyService")
public class HistoryServiceImpl implements HistoryService{

    @Autowired
    HistoryRepository historyRepository;

    @Override
    public History createHistory(History history) {
        return historyRepository.save(history);
    }

    @Override
    public boolean existsUserInRoom(long userId) {
        return historyRepository.existsByUserIdAndAction(userId, ActionType.JOIN);
    }
}
