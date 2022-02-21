package com.moyobar.stomp.word.model.dictionary;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class Channel {
    private String title;
    private String link;
    private String description;
    private String lastbuilddate;
    private int total;
    private int start;
    private int num;
    private List<Item> item;

}
