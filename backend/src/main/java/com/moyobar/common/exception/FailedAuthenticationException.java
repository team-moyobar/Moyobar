package com.moyobar.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Authorization Bearer token을 요청보내지 않았을 시 호출되는 예외클래스
 */

@ResponseStatus(HttpStatus.UNAUTHORIZED)
public class FailedAuthenticationException extends RuntimeException {
    public FailedAuthenticationException(String message) {
        super(message);
    }

    public FailedAuthenticationException(String message, Throwable cause) {
        super(message, cause);
    }
}
