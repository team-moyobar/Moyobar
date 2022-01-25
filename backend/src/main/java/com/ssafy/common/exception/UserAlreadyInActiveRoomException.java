package com.ssafy.common.exception;

public class UserAlreadyInActiveRoomException extends BusinessException{

    public UserAlreadyInActiveRoomException() {
        super(ErrorCode.USER_ALREADY_IN_ROOM);
    }
}
