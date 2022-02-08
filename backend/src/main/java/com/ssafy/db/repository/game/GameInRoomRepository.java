package com.ssafy.db.repository.game;

import com.ssafy.db.entity.game.GameInRoom;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * meeting_has_game 모델 관련 디비 쿼리 생성을 위한 JPA Query Method 인터페이스 정의.
 */
public interface GameInRoomRepository extends JpaRepository<GameInRoom, Long> {

}
