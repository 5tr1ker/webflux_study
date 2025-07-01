package com.ideatec.webflux_server.stock.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.HashMap;

@RestController
@RequestMapping("/stock")
public class StockController {

    @GetMapping("/health")
    public Mono<? extends ResponseEntity<?>> healthCheck() {
        HashMap<String, Object> body = new HashMap<>();
        body.put("status" , "success");

        return Mono.just(ResponseEntity.status(HttpStatus.OK).body(body));
    }

}
