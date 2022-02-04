package com.ssafy.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * WebSocket 기본 설정을 정의한 클래스. url 설정
 */

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/from/"); //이 경로를 subscribe하는 클라이언트에게 메세지 전달
        registry.setApplicationDestinationPrefixes("/to"); //cilent에서 send요청 처리
    }

    // END POINT 정의. 클라이언트는 {백엔드 주소}/moyobar/~/~를 통해 요청을 보냄
    @Override public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/moyobar").setAllowedOriginPatterns("*").withSockJS();
    }
}
