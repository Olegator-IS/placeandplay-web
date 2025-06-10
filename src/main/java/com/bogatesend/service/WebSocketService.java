package com.bogatesend.service;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public WebSocketService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void notifyEventUpdate(Long orgId) {
        messagingTemplate.convertAndSend("/topic/place/" + orgId, new EventUpdateMessage("EVENT_UPDATE"));
    }
}

class EventUpdateMessage {
    private String type;
    private long timestamp;

    public EventUpdateMessage(String type) {
        this.type = type;
        this.timestamp = System.currentTimeMillis();
    }

    // Геттеры и сеттеры
    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }
} 