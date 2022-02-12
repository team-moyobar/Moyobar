package com.ssafy.db.repository.room;

import com.ssafy.db.entity.room.Room;
import com.ssafy.db.entity.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface RoomRepository extends JpaRepository<Room, Long> {

    Optional<Room> findRoomById(long roomId);

    Page<Room> findAllByIsActive(int isActive, Pageable pageable);

    Page<Room> findAllByIsActiveAndTitleContainingIgnoreCase(int isActive, String keyword, Pageable pageable);

    Page<Room> findAllByIsActiveAndOwnerIn(int isActive, List<User> users, Pageable pageable);

    Page<Room> findAllByIsActiveAndDescriptionContainingIgnoreCase(int isActive, String keyword, Pageable pageable);

    @Query("select r from Room r where r.isActive = :isActive" +
            " and (upper(r.title) like upper(concat('%',:keyword, '%')) " +
            " or upper(r.description) like upper(concat('%',:keyword, '%'))" +
            " or upper(r.owner.nickname) like upper(concat('%',:keyword, '%')))")
    Page<Room> findAllByIsActiveAndKeyword(int isActive, String keyword, Pageable pageable);
}
