package com.moyobar.common.exception;

public class NicknameDuplicatedException extends InvalidValueException {

    public NicknameDuplicatedException() {
        super(ErrorCode.NICKNAME_DUPLICATION);
    }
}
