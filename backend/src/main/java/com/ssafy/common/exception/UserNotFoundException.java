package com.ssafy.common.exception;

public class UserNotFoundException extends EntityNotFoundException{

    public UserNotFoundException(){
        super(ErrorCode.USER_NOT_FOUND);
    }
}
