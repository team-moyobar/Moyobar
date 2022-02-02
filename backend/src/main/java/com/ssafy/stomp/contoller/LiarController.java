package com.ssafy.stomp.contoller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LiarController {

    private final Logger logger = LoggerFactory.getLogger(LiarController.class);

    @Autowired
    private SimpMessagingTemplate webSocket;

    // @Payload stomp에서 전송하는 데이터를 받기위한 어노테이션
    @MessageMapping("/liar/{roomId}")
    public void SendLiarMessage(@DestinationVariable long roomId, @Payload String msg) {
        logger.info("receive liar " + msg);
        webSocket.convertAndSend("/topic/liar", msg);
    }
}
