package com.ssafy.stomp.word.model.dictionary;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Sense {
    private String cat;
    private String definition;
    private String link;
    private String origin;
    private String sense_no;
    private String target_code;
    private String type;
    private String pos;
}
