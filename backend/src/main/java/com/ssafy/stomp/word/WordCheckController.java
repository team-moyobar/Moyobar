package com.ssafy.stomp.word;

import com.ssafy.common.service.ApiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@RestController
public class WordCheckController {

    @Value("${opendict.key")
    private String OPEN_DICT_KEY;
    private final String OPEN_DICT_URL = "https://opendict.korean.go.kr/api/search";

    @Autowired
    ApiService<Map> apiService;

    @GetMapping("/word/check")
    public ResponseEntity<Map> check(@RequestParam String word){

        URI uri = UriComponentsBuilder
                .fromUriString(OPEN_DICT_URL)
                .queryParam("key", OPEN_DICT_KEY)
                .queryParam("req_type", "json")
                .queryParam("q", word)
                .queryParam("advanced","y")
                .queryParam("type1", "word")
                .queryParam("type3", "general")
                .queryParam("pos", 1)
                .build()
                .encode(StandardCharsets.UTF_8)
                .toUri();

        return ResponseEntity.ok(apiService.get(uri.toString(), HttpHeaders.EMPTY, Map.class).getBody());

    }
}
