package com.ssafy.db.repository.user;

import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

/**
 * 유저 모델 관련 디비 쿼리 생성을 위한 구현 정의.
 */
@RequiredArgsConstructor
@Repository
public class UserRepositorySupport {
    private final JPAQueryFactory jpaQueryFactory;
//    QUser qUser = QUser.user;

//    public Optional<User> findUserByUserId(String userId) {
//        User user = jpaQueryFactory.select(qUser).from(qUser)
//                .where(qUser.userId.eq(userId)).fetchOne();
//        if(user == null) return Optional.empty();
//        return Optional.ofNullable(user);
//    }
}