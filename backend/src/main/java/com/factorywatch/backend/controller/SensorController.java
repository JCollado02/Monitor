package com.factorywatch.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.factorywatch.backend.model.SensorData;

@RestController // tells us this class handles web requests
@RequestMapping("/api") // everyhthing here comes after /api
public class SensorController {

    @PostMapping("/sensor-data") // when we get a POST request at this url, do the following:
    public ResponseEntity<String> recieveSensorData(@RequestBody SensorData data) {
        System.out.println("Got temp: " + data.getTemperature());
        return ResponseEntity.ok("Success");
    }

    @GetMapping("/health") // when get a GET here, do this
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("FactoryWatch API is running");
    }

}
