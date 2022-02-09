package com.ssafy.stomp.word.model.service;

public interface WordCheckService {

    boolean isInDictionary(String word);

    boolean equalsToWord(String word, String userWord);
}
