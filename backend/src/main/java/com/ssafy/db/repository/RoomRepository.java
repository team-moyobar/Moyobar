package com.ssafy.db.repository;

import com.ssafy.db.entity.Room;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoomRepository  extends JpaRepository<Room, Long > {

    Optional<Room> findRoomById(long roomId);

    Page<Room> findAllByIsActive(int isActive, Pageable pageable);
}
