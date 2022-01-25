package com.ssafy.api.service;

import com.ssafy.api.request.RoomRegisterPostReq;
import com.ssafy.api.request.RoomUpdatePutReq;
import com.ssafy.common.exception.RoomNotFoundException;
import com.ssafy.db.entity.Room;
import com.ssafy.db.entity.User;
import com.ssafy.db.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

/**
 * 미팅 룸 관련 비즈니스 로직 처리를 위한 서비스 구현 정의.
 */
@Service("roomService")
public class RoomServiceImpl implements RoomService {

    @Autowired
    RoomRepository roomRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Override
    public Room createRoom(RoomRegisterPostReq registerInfo, User owner) {
        Room room = new Room();

        room.setOwner(owner);
        room.setTitle(registerInfo.getTitle());
        room.setDescription(registerInfo.getDescription());
        room.setMax(registerInfo.getMax());
        if (registerInfo.getPassword() != null)
            room.setPassword(passwordEncoder.encode(registerInfo.getPassword()));
        room.setThumbnail(registerInfo.getThumbnail());
        room.setType(registerInfo.getType());
        return roomRepository.save(room);
    }

    @Override
    public Room getRoomById(long roomId) {
        Room room = roomRepository.findRoomById(roomId).orElseThrow(RoomNotFoundException::new);
        return room;
    }


    @Transactional
    @Override
    public void updateRoom(long roomId, RoomUpdatePutReq updateInfo, User owner) {

        Room room = getRoomById(roomId);

        room.setType(updateInfo.getType());
        room.setMax(updateInfo.getMax());
        room.setThumbnail(updateInfo.getThumbnail());
        room.setDescription(updateInfo.getDescription());
        room.setTitle(updateInfo.getTitle());
        if(updateInfo.getPassword()!= null){
            room.setPassword(passwordEncoder.encode(updateInfo.getPassword()));
        }

        room.setOwner(owner);
    }

}
