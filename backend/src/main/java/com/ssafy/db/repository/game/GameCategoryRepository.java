package com.ssafy.db.repository.game;

import com.ssafy.db.entity.game.GameCategory;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * game_category 모델 관련 디비 쿼리 생성을 위한 JPA Query Method 인터페이스 정의.
 */
public interface GameCategoryRepository extends JpaRepository<GameCategory, Long> {
    boolean existsByName(String name);

    GameCategory findByName(String gameName);
}
