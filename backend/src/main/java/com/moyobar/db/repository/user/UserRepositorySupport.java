package com.moyobar.db.repository.user;

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
}