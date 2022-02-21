package com.moyobar.common.exception;

public class PasswordDuplicatedException extends InvalidValueException {
    public PasswordDuplicatedException() {
        super(ErrorCode.PASSWORD_DUPLICATION);
    }
}
