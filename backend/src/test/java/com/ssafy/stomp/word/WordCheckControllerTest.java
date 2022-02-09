package com.ssafy.stomp.word;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.ssafy.stomp.word.model.dictionary.DictionaryResult;
import com.ssafy.stomp.word.model.service.WordCheckService;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@Slf4j
@SpringBootTest
class WordCheckControllerTest {

    @Autowired
    WordCheckService checkService;

    @Test
    void 초성게임단어확인() {

        String cho = "ㅁㄴ";

        String word = "가나";

        boolean isEqual = checkService.equalsToWord(cho, word);
        boolean isInDictionary = checkService.isInDictionary(word);
        log.info("초성: {}, 사용자 입력값: {}, 결과: {}", cho, word, isEqual);
        log.info("사전에 있는 단어인지 확인: {}", isInDictionary);

        assertTrue(isEqual && isInDictionary);
    }
}