package com.moyobar.common.exception;

public class UserIdDuplicatedException extends InvalidValueException {

    public UserIdDuplicatedException() {
        super(ErrorCode.USER_ID_DUPLICATION);
    }
}
