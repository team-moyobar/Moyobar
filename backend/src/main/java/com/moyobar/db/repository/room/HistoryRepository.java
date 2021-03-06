package com.moyobar.db.repository.room;

import com.moyobar.db.entity.room.ActionType;
import com.moyobar.db.entity.room.History;
import com.moyobar.db.entity.room.Room;
import com.moyobar.db.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * meeting_history 모델 관련 디비 쿼리 생성을 위한 JPA Query Method 인터페이스 정의.
 */

public interface HistoryRepository extends JpaRepository<History, Long> {
    boolean existsByUserIdAndAction(long userId, ActionType actionType);

    Optional<History> findByUserAndRoomAndAction(User user, Room room, ActionType actionType);

    //방 번호와 방 실행 상태 여부를 넘겨주기
    List<History> findAllByRoomIdAndAction(long roomId, ActionType actionType);

    List<History> findAllByUserIdAndAction(long id, ActionType actionType);
}
