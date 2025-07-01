package com.ideatec.webflux_server.stock.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ideatec.webflux_server.stock.repository.StockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.WebSocketMessage;
import org.springframework.web.reactive.socket.WebSocketSession;
import reactor.core.Disposable;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.time.Duration;
import java.util.HashMap;
import java.util.function.Function;

@Component
@RequiredArgsConstructor
public class CustomWebSocketHandler implements WebSocketHandler {

    private final ObjectMapper objectMapper;
    private final StockRepository stockRepository;
    private String time = "00:00";
    private String date = "2025-06-28";
    private String stock = "삼성전자";
    private String msg = "null";

    @Override
    public Mono<Void> handle(WebSocketSession session) {
        return session.receive()
                .map(WebSocketMessage::getPayloadAsText)
                .flatMap(body -> {
                    try {
                        HashMap<String, Object> map = objectMapper.readValue(body, HashMap.class);
                        this.time = map.get("time").toString();
                        this.date = map.get("date").toString();
                        this.stock = map.get("stock").toString();

                        Flux<WebSocketMessage> timeStream = Flux.interval(Duration.ofSeconds(1))
                                .map(tick -> {
                                    updateTime();
                                    this.msg = stockRepository.findByStockAndDateAndTime(stock, date, time).toString();
                                    return session.textMessage(msg);
                                });

                        return session.send(timeStream);
                    } catch (Exception e) {
                        return Mono.error(e);
                    }
                })
                .then();
    }

    public void updateTime() {
        String[] parts = time.split(":");
        int hour = Integer.parseInt(parts[0]);
        int minute = Integer.parseInt(parts[1]);

        minute += 1;
        if (minute >= 60) {
            minute = 0;
        }

        time = String.format("%02d:%02d", hour, minute);
    }

}
