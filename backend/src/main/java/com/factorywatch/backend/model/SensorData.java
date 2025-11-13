package com.factorywatch.backend.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;

public class SensorData {
    @NotNull
    private Double temperature;
    @NotNull
    private Double humidity;
    @NotBlank
    private String deviceId;

    public SensorData() {
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
}
