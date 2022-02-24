package com.moyobar.db.repository.user;

import com.moyobar.db.entity.user.Drink;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


/**
 * 주량 모델 관련 디비 쿼리 생성을 위한 JPA Query Method 인터페이스 정의.
 */
@Repository
public interface DrinkRepository extends JpaRepository<Drink, Long>{
}