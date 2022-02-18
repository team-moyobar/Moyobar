package com.ssafy.api.service;

import com.ssafy.api.request.RoomRegisterPostReq;
import com.ssafy.api.request.RoomUpdatePutReq;
import com.ssafy.common.exception.RoomNotFoundException;
import com.ssafy.db.entity.room.ActionType;
import com.ssafy.db.entity.room.History;
import com.ssafy.db.entity.room.Room;
import com.ssafy.db.entity.room.RoomType;
import com.ssafy.db.entity.user.User;
import com.ssafy.db.repository.room.HistoryRepository;
import com.ssafy.db.repository.room.RoomRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


/**
 * 미팅 룸 관련 비즈니스 로직 처리를 위한 서비스 구현 정의.
 */
@Slf4j
@Service("roomService")
public class RoomServiceImpl implements RoomService {

    @Autowired
    private RoomRepository roomRepository;
    @Autowired
    private HistoryRepository historyRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

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
        if (searchBy == null)
            return roomRepository.findAllByIsActive(0, pageable);

        if (searchBy.equals("all")){
            return roomRepository.findAllByIsActiveAndKeyword(0, keyword, pageable);
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

    //RoomId에 있는 유저 정보 모두 가져오기
    @Override
    public List<User> findUserListByRoomId(long roomId, ActionType actionType) {
        //history 테이블로부터 방 번호, 해당 방에 JOIN 중인 유저에 대한 정보 얻어오기
        List<History> histories = historyRepository.findAllByRoomIdAndAction(roomId, actionType);

        log.info("방에 JOIN 중인 유저 인원 수: {} ", histories.size());

        //해당 방에 참가중인 유저 리스트 저장
        List<User> players =new ArrayList<>();

        //얻어온 histories 테이블 결과값으로부터 User 추출 후 players 배열에 담아주기
        for(History h : histories){
            User player = h.getUser();
            players.add(player);
        }

        return players;
    }

    @Override
    public void updateRoom(Room room) {
        roomRepository.save(room);
    }

}
