package com.bogatesend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EventService {
    private static final Logger logger = LoggerFactory.getLogger(EventService.class);
    
    private final WebSocketService webSocketService;
    
    @Autowired
    public EventService(WebSocketService webSocketService) {
        this.webSocketService = webSocketService;
        logger.info("[EventService] Service initialized");
    }
    
    // При создании нового события
    public void createEvent(Event event) {
        logger.info("[EventService] Creating new event for orgId: {}", event.getOrgId());
        try {
            // ... существующая логика создания события ...
            
            // Уведомляем клиентов об обновлении
            webSocketService.notifyEventUpdate(event.getOrgId());
            logger.info("[EventService] Event created and notification sent successfully");
        } catch (Exception e) {
            logger.error("[EventService] Failed to create event", e);
            throw e;
        }
    }
    
    // При обновлении события
    public void updateEvent(Event event) {
        logger.info("[EventService] Updating event: {} for orgId: {}", event.getId(), event.getOrgId());
        try {
            // ... существующая логика обновления события ...
            
            // Уведомляем клиентов об обновлении
            webSocketService.notifyEventUpdate(event.getOrgId());
            logger.info("[EventService] Event updated and notification sent successfully");
        } catch (Exception e) {
            logger.error("[EventService] Failed to update event", e);
            throw e;
        }
    }
    
    // При удалении события
    public void deleteEvent(Long eventId, Long orgId) {
        logger.info("[EventService] Deleting event: {} for orgId: {}", eventId, orgId);
        try {
            // ... существующая логика удаления события ...
            
            // Уведомляем клиентов об обновлении
            webSocketService.notifyEventUpdate(orgId);
            logger.info("[EventService] Event deleted and notification sent successfully");
        } catch (Exception e) {
            logger.error("[EventService] Failed to delete event", e);
            throw e;
        }
    }
} 