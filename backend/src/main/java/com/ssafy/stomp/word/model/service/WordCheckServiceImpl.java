package com.ssafy.stomp.word.model.service;

import com.ssafy.stomp.word.model.dictionary.DictionaryResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

@Slf4j
@Service("wordCheckService")
public class WordCheckServiceImpl implements WordCheckService {

    private final char[] CHOSEONG = {'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'};

    @Value("${opendict.key}")
    private String OPEN_DICT_KEY;
    private final String OPEN_DICT_URL = "http://opendict.korean.go.kr/api/search";

    @Autowired
    private RestTemplate restTemplate;

    @Override
    public boolean isInDictionary(String word) {
        URI uri = UriComponentsBuilder
                .fromUriString(OPEN_DICT_URL)
                .queryParam("key", OPEN_DICT_KEY)
                .queryParam("req_type", "json")
                .queryParam("q", word)
                .queryParam("part", "word")
                .queryParam("advanced", "y")
                .queryParam("type1", "word")
                .queryParam("type3", "general")
                .queryParam("pos", 1)
                .build()
                .toUri();

        restTemplate.getInterceptors().add(((request, body, execution) -> {
            ClientHttpResponse response = execution.execute(request, body);
            response.getHeaders().setContentType(MediaType.APPLICATION_JSON);
            return response;
        }));

        DictionaryResult result = restTemplate.getForObject(uri.toString(), DictionaryResult.class);
        int total = result != null && result.getChannel() != null ? result.getChannel().getTotal() : 0;

        return total > 0;
    }

    @Override
    public boolean equalsToWord(String choseong, String search) {
        char[] chs = choseong.toCharArray();
        char[] s = search.toCharArray();

        if (chs.length != s.length) return false;

        int len = chs.length;
        for (int i = 0; i < len; i++) {
            if (s[i] >= 0xAC00) {
                char idx = (char) ((s[i] - 0xAC00) / 28 / 21);

                if (chs[i] != CHOSEONG[idx]) return false;
            } else
                return false;
        }
        return true;
    }
}
