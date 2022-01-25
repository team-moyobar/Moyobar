package com.ssafy.api.service;

import com.ssafy.api.request.RoomRegisterPostReq;
import com.ssafy.db.entity.Room;
import com.ssafy.db.entity.User;

import java.util.Optional;

public interface RoomService {
    Room createRoom(RoomRegisterPostReq roomRegisterInfo, User owner);

    Room getRoomById(long roomId);

}
