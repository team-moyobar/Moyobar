package com.ssafy.api.service;

import com.ssafy.db.entity.History;

public interface HistoryService {
    History createHistory(History history);

    boolean existsUserInRoom(long userId);
}
