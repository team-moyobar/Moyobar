package com.ssafy.common.exception;

import lombok.AllArgsConstructor;

public class InvalidValueException extends BusinessException {
    public InvalidValueException(ErrorCode errorCode){
        super(errorCode);
    }
}
