package com.ssafy.db.repository;

import com.ssafy.db.entity.Room;
import com.ssafy.db.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RoomRepository  extends JpaRepository<Room, Long > {

    Optional<Room> findRoomById(long roomId);

    Page<Room> findAllByIsActive(int isActive, Pageable pageable);

    Page<Room> findAllByIsActiveAndTitleContainingIgnoreCase(int isActive, String keyword, Pageable pageable);

    Page<Room> findAllByIsActiveAndOwnerIn(int isActive, List<User> users, Pageable pageable);

    Page<Room> findAllByIsActiveAndDescriptionContainingIgnoreCase(int isActive, String keyword, Pageable pageable);
}
