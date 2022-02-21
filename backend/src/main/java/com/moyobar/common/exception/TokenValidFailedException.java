package com.moyobar.common.exception;

/*
* 토큰 유효성 검사 실패할 경우 호출되는 클래스
 */
public class TokenValidFailedException extends RuntimeException {

    public TokenValidFailedException() {
        super("Failed to generate Token.");
    }
}
