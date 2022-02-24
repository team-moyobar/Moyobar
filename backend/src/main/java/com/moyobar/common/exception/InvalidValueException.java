package com.moyobar.common.exception;

public class InvalidValueException extends BusinessException {
    public InvalidValueException(ErrorCode errorCode){
        super(errorCode);
    }
}
