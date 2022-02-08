package com.ssafy.api.service;

import com.ssafy.api.request.RoomRegisterPostReq;
import com.ssafy.api.request.RoomUpdatePutReq;
import com.ssafy.db.entity.room.ActionType;
import com.ssafy.db.entity.room.Room;
import com.ssafy.db.entity.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface RoomService {
    Room createRoom(RoomRegisterPostReq roomRegisterInfo, User owner);

    Room getRoomById(long roomId);

    void updateRoom(Room room, RoomUpdatePutReq updateInfo, User owner);

    Page<Room> getActiveRoomList(String searchBy, String keyword, Pageable pageable);

    void updateRoom(Room room);

    List<User> findUserListByRoomId(long roomId, ActionType actionType);
}
