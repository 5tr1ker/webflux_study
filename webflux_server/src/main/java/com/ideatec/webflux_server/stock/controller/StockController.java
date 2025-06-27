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

    @GetMapping("/test")
    public ResponseEntity<?> testApi() {
        HashMap<String, Object> result = new HashMap<>();

        result.put("message" , "success");

        return ResponseEntity.ok(result);
    }

    @GetMapping
    public Mono<? extends ResponseEntity<?>> getTestData() {
        return Mono.just(ResponseEntity.status(HttpStatus.OK).body("TEST DATA"));
    }

}
