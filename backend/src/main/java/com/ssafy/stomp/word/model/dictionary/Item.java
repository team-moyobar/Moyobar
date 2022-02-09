package com.ssafy.stomp.word.model.dictionary;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
@Getter
@Setter
public class Item {
    private String word;
    private List<Sense> sense;
}
