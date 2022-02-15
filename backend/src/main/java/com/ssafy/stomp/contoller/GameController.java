package com.ssafy.stomp.contoller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 통신 테스트용 컨트롤러
 */

@Slf4j
@RequiredArgsConstructor
@RestController
public class GameController {

    private final SimpMessagingTemplate webSocket;

    @MessageMapping("/sendTo")
    @SendTo("/topics/sendTo")
    public String SendToMessage() {
        log.info("receive sendTo");
        return "SendTo";
    }

    @MessageMapping("/Template")
    public void SendTemplateMessage() {
        log.info("receive Template");
        webSocket.convertAndSend("/topics/template", "Template");
    }

    @RequestMapping(value = "/api")
    public void SendAPI() {
        webSocket.convertAndSend("/topics/api", "API");
    }
}
