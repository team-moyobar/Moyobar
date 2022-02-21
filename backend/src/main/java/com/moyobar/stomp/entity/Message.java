package com.moyobar.stomp.entity;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

/**
 * 채팅 시 client와 주고받을 모델 정의
 */

@Getter
@Setter
public class Message {
    private String username;
    private String content;
    private Date date;

    public Message(String username, String content, Date date) {
        this.username = username;
        this.content = content;
        this.date = date;
    }

}
