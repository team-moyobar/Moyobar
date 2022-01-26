package com.ssafy.api.service;

import com.ssafy.api.request.RoomRegisterPostReq;
import com.ssafy.api.request.RoomUpdatePutReq;
import com.ssafy.db.entity.Room;
import com.ssafy.db.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface RoomService {
    Room createRoom(RoomRegisterPostReq roomRegisterInfo, User owner);

    Room getRoomById(long roomId);

    void updateRoom(long roomId, RoomUpdatePutReq updateInfo, User owner);

    Page<Room> getActiveRoomList(Pageable pageable);
}
