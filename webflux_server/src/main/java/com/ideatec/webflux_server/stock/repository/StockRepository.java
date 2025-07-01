package com.ideatec.webflux_server.stock.repository;

import com.ideatec.webflux_server.stock.entity.Stock;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface StockRepository extends MongoRepository<Stock, String> {

    @Query(value = "{ 'stock': ?0, 'date': ?1, 'trade_data.time': ?2 }" ,
            fields = "{ 'stock': 1, 'date': 1, 'trade_data.$': 1 }")
    Stock findByStockAndDateAndTime(String stock, String date, String time);

}
