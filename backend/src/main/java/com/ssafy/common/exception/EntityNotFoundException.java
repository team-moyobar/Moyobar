package com.ssafy.common.exception;

public class EntityNotFoundException extends BusinessException{

    public EntityNotFoundException(ErrorCode errorCode){
        super(errorCode);
    }
}
