package com.ssafy.common.exception;

public class PasswordDuplicatedException extends InvalidValueException {
    public PasswordDuplicatedException() {
        super(ErrorCode.PASSWORD_DUPLICATION);
    }
}
