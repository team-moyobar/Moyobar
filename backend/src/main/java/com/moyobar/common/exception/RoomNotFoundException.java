package com.moyobar.common.exception;

public class RoomNotFoundException extends EntityNotFoundException{

    public RoomNotFoundException(){
        super(ErrorCode.ROOM_NOT_FOUND);
    }
}
