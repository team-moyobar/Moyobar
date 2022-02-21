package com.moyobar.common.exception;

public class UserNotRoomOwnerException extends BusinessException{

    public UserNotRoomOwnerException() {
        super(ErrorCode.USER_NOT_ROOM_OWNER);
    }
}
