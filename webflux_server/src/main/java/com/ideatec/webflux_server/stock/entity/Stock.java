package com.ideatec.webflux_server.stock.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.HashMap;
import java.util.List;

@Document(collection = "stock")
@Getter
@AllArgsConstructor
@ToString
public class Stock {

    @Id
    private String objectId;

    private String stock;

    private String date;

    private List<HashMap<String, Object>> trade_data;

}
