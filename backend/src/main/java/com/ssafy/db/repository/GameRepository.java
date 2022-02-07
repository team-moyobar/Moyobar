package com.ssafy.db.repository;

import com.ssafy.db.entity.Game;
import org.springframework.data.jpa.repository.JpaRepository;
/**
 * game 모델 관련 디비 쿼리 생성을 위한 JPA Query Method 인터페이스 정의.
 */

public interface GameRepository extends JpaRepository<Game, Long> {

}
