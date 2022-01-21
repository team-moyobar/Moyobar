package com.ssafy.config;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;

import java.util.ArrayList;
import java.util.List;

@Data
@EnableAsync
@Configuration
@ConfigurationProperties(prefix = "app")
public class AppConfig {
    private List<String> authorizedRedirectUris = new ArrayList<>();

    private String tokenSecret;

    private long tokenExpirationMsec;

    //openvidu 설정
//    @Bean
//    public OpenVidu openVidu(@Value("${openvidu.secret}") String secret,
//                             @Value("${openvidu.url}") String openviduUrl) {
//        return new OpenVidu(openviduUrl, secret);
//    }
}
