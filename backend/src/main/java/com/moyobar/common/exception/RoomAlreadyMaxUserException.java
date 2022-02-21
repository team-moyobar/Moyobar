package com.moyobar.common.exception;

public class RoomAlreadyMaxUserException extends BusinessException{
    public RoomAlreadyMaxUserException() {
        super(ErrorCode.ROOM_ALREADY_MAX_USER);
    }
}
