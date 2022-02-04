package com.ssafy.api.service;

import com.ssafy.api.request.RoomRegisterPostReq;
import com.ssafy.api.request.RoomUpdatePutReq;
import com.ssafy.common.exception.RoomNotFoundException;
import com.ssafy.db.entity.Room;
import com.ssafy.db.entity.RoomType;
import com.ssafy.db.entity.User;
import com.ssafy.db.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


/**
 * 미팅 룸 관련 비즈니스 로직 처리를 위한 서비스 구현 정의.
 */
@Service("roomService")
public class RoomServiceImpl implements RoomService {


    @Autowired
    RoomRepository roomRepository;

    @Autowired
    UserService userService;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Override
    public Room createRoom(RoomRegisterPostReq registerInfo, User owner) {
        Room room = new Room();

        room.setOwner(owner);
        room.setTitle(registerInfo.getTitle());
        room.setDescription(registerInfo.getDescription());
        if (registerInfo.getMax() != 0)
            room.setMax(registerInfo.getMax());
        else
            room.setMax(6);
        if (registerInfo.getType() == RoomType.PRIVATE && registerInfo.getPassword() != null)
            room.setPassword(passwordEncoder.encode(registerInfo.getPassword()));
        if (registerInfo.getThumbnail() != null)
            room.setThumbnail(registerInfo.getThumbnail());
        room.setType(registerInfo.getType());
        room.setTheme(registerInfo.getTheme());
        return roomRepository.save(room);
    }

    @Override
    public Room getRoomById(long roomId) {
        Room room = roomRepository.findRoomById(roomId).orElseThrow(RoomNotFoundException::new);
        return room;
    }


    @Override
    public void updateRoom(Room room, RoomUpdatePutReq updateInfo, User owner) {

        if (updateInfo.getType() != null)
            room.setType(updateInfo.getType());
        if (updateInfo.getMax() != 0)
            room.setMax(updateInfo.getMax());
        if (updateInfo.getThumbnail() != null)
            room.setThumbnail(updateInfo.getThumbnail());
        if (updateInfo.getDescription() != null)
            room.setDescription(updateInfo.getDescription());
        if (updateInfo.getTitle() != null)
            room.setTitle(updateInfo.getTitle());
        if (updateInfo.getPassword() != null) {
            if (room.getType() == RoomType.PRIVATE) {
                room.setPassword(passwordEncoder.encode(updateInfo.getPassword()));
            } else {
                room.setPassword(null);
            }
        }
        if (updateInfo.getOwner() != null)
            room.setOwner(owner);

        room.setTheme(updateInfo.getTheme());
        roomRepository.save(room);
    }

    @Override
    public Page<Room> getActiveRoomList(String searchBy, String keyword, Pageable pageable) {
        if (searchBy.equals("all")){
            List<User> users = userService.searchUserByNickname(keyword);
            return roomRepository.findAllByDescriptionContainingIgnoreCaseOrTitleContainingIgnoreCaseOrOwnerInAndIsActive(keyword, keyword,users, 0, pageable);
        }
        else if (searchBy.equals("title")) {
            return roomRepository.findAllByIsActiveAndTitleContainingIgnoreCase(0, keyword, pageable);
        } else if (searchBy.equals("description")) {
            return roomRepository.findAllByIsActiveAndDescriptionContainingIgnoreCase(0, keyword, pageable);
        } else if (searchBy.equals("owner")) {
            List<User> users = userService.searchUserByNickname(keyword);
            return roomRepository.findAllByIsActiveAndOwnerIn(0, users, pageable);
        } else {
            return roomRepository.findAllByIsActive(0, pageable);
        }
    }

    @Override
    public void updateRoom(Room room) {
        roomRepository.save(room);
    }

}
