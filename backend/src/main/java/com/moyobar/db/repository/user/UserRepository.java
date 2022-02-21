package com.moyobar.db.repository.user;

import com.moyobar.db.entity.user.User;
import org.kurento.client.internal.server.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 유저 모델 관련 디비 쿼리 생성을 위한 JPA Query Method 인터페이스 정의.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // 아래와 같이, Query Method 인터페이스(반환값, 메소드명, 인자) 정의를 하면 자동으로 Query Method 구현됨.
    Optional<User> findByUserId(String userId);
    Optional<User> findByNickname(String nickname);
    boolean existsByUserId(String userId);
    boolean existsByNickname(String nickname);

    List<User> findByNicknameContainingIgnoreCase(String keyword);

    @Query("select count(u.id) + 1 from User u where u.score > :#{#user.score}")
    long getUserRank(@Param("user") User user);
}