package com.ssafy.config;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;

import java.util.ArrayList;
import java.util.List;

/**
 * 어플리케이션 구성 설정 관리 클래스
 */

@Data
@EnableAsync
@Configuration //해당 클래스에서 빈을 등록
@ConfigurationProperties(prefix = "app")
public class AppConfig {
    private List<String> authorizedRedirectUris = new ArrayList<>();

    private String tokenSecret;

    private long tokenExpirationMsec;
}
