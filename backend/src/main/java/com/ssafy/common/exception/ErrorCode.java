package com.ssafy.common.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {

    // Common
    INVALID_TYPE_VALUE(400, "C001", "Invalid Type Value"),
    INTERNET_SERVER_ERROR(500, "C002", "Internet Server Error"),
    INVALID_INPUT_VALUE(400, "C003", "Invalid Input Value"),
    UNAUTHORIZED(401, "C004", "Unauthorized"),
    ENTITY_NOT_FOUND(400, "C005", "Entity Not Found"),

    // User
    USER_ID_DUPLICATION(409, "U001","Id is Duplicated" ),
    NICKNAME_DUPLICATION(409, "U002","Nickname is Duplicated" ),
    PASSWORD_MISMATCH(400, "U003", "Password Not Match"),
    USER_NOT_FOUND(400, "U004", "User Not Found"),
    USER_ALREADY_IN_ROOM(400, "U005", "User Already In Active Room"),
    PASSWORD_DUPLICATION(400, "U006", "Same Value As The Current Password"),

    // Meeting
    ROOM_NOT_FOUND(400, "R001", "Room Not Found"),
    USER_NOT_ROOM_OWNER(401, "R002", "Request User is Not Owner of Room")

    ;
    private int status;
    private final String code;
    private final String message;

}
