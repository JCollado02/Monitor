package com.factorywatch.backend.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity // tells us this class is a database table
public class SensorReading {

    @Id // marks this value as primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // auto-gens a value for IDs
    private Long id;

    private Double temperature;
    private Double humidity;
    private String deviceId;
    private LocalDateTime timestamp;

    // default constructor
    public SensorReading() {
    }

    // new readings constructor, time and id are auto generated
    public SensorReading(Double temperature, Double humidity, String deviceId) {
        this.temperature = temperature;
        this.humidity = humidity;
        this.deviceId = deviceId;
        this.timestamp = LocalDateTime.now();
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getTemperature() {
        return temperature;
    }

    public void setTemperature(Double temperature) {
        this.temperature = temperature;
    }

    public Double getHumidity() {
        return humidity;
    }

    public void setHumidity(Double humidity) {
        this.humidity = humidity;
    }

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

}
