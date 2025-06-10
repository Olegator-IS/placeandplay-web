package com.example.placeandplay.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;
import org.springframework.web.socket.server.HandshakeInterceptor;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    private static final Logger logger = LoggerFactory.getLogger(WebSocketConfig.class);

    private static final String[] ALLOWED_ORIGINS = {
        "http://localhost:3002",
        "http://95.46.96.94:8080",
        "http://placeandplay.uz",
        "https://placeandplay.uz"
    };

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        logger.info("[WebSocket] Configuring message broker");
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app");
        config.setUserDestinationPrefix("/user");
        logger.info("[WebSocket] Message broker configured successfully");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        logger.info("[WebSocket] Registering STOMP endpoints");
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns(ALLOWED_ORIGINS)
                .addInterceptors(new HandshakeInterceptor() {
                    @Override
                    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                                 WebSocketHandler wsHandler, Map<String, Object> attributes) {
                        logger.info("[WebSocket] Before handshake - Request from: {}", request.getRemoteAddress());
                        String token = request.getHeaders().getFirst("Authorization");
                        if (token != null && token.startsWith("Bearer ")) {
                            token = token.substring(7);
                            attributes.put("token", token);
                            logger.info("[WebSocket] Token extracted and stored in attributes");
                        } else {
                            logger.warn("[WebSocket] No valid token found in request");
                        }
                        return true;
                    }

                    @Override
                    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                             WebSocketHandler wsHandler, Exception exception) {
                        if (exception != null) {
                            logger.error("[WebSocket] Handshake failed", exception);
                        } else {
                            logger.info("[WebSocket] Handshake completed successfully");
                        }
                    }
                })
                .withSockJS()
                .setClientLibraryUrl("https://cdnjs.cloudflare.com/ajax/libs/sockjs-client/1.5.0/sockjs.min.js")
                .setWebSocketEnabled(true)
                .setSessionCookieNeeded(false)
                .setDisconnectDelay(5000)
                .setHeartbeatTime(25000);
        logger.info("[WebSocket] STOMP endpoints registered successfully");
    }

    @Override
    public void configureWebSocketTransport(WebSocketTransportRegistration registration) {
        logger.info("[WebSocket] Configuring transport settings");
        registration.setMessageSizeLimit(128 * 1024)    // 128KB
                   .setSendBufferSizeLimit(512 * 1024)  // 512KB
                   .setSendTimeLimit(20000)             // 20 seconds
                   .setTimeToFirstMessage(30000);       // 30 seconds
        logger.info("[WebSocket] Transport settings configured successfully");
    }
} 