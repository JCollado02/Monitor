package com.factorywatch.backend.controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.factorywatch.backend.model.SensorData;
import com.factorywatch.backend.model.SensorReading;
import com.factorywatch.backend.repository.SensorReadingRepository;

import jakarta.validation.Valid;

@RestController // tells us this class handles web requests
@RequestMapping("/api") // everyhthing here comes after /api
public class SensorController {

    @Autowired
    private SensorReadingRepository repository;

    // GET api status
    @GetMapping("/health") // when get a GET here, do this
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("FactoryWatch API is running");
    }

    // ------------------------------------------------------------------------------------------------------//
    // POST requests
    // POST new sensor data
    @PostMapping("/sensor-data") // when we get a POST request at this url, do the following:
    public ResponseEntity<String> recieveSensorData(@Valid @RequestBody SensorData data) {

        SensorReading reading = new SensorReading(data.getTemperature(), data.getHumidity(), data.getDeviceId());
        repository.save(reading);

        return ResponseEntity.ok("Success");
    }

    // -------------------------------------------------------------------------------------------------------//
    // GET requests

    // GET all readings
    @GetMapping("/sensor-data") // get data
    public List<SensorReading> getData() {
        return repository.findAll();
    }

    // GET reading from ID
    @GetMapping("/sensor-data/{id}") // get data
    public ResponseEntity<?> getReadingByID(@PathVariable Long id) {
        Optional<SensorReading> result = repository.findById(id);

        // Check if it exists
        if (result.isPresent()) {
            return ResponseEntity.ok(result.get());
        } else {
            // 404
            return ResponseEntity.notFound().build();
        }
    }

    // query endpoint to filter by devices
    @GetMapping("/sensor-data/device/{deviceId}") // get data
    public List<SensorReading> getDeviceById(@PathVariable String deviceId) {
        return repository.findByDeviceId(deviceId);
    }

    // GET by date range
    @GetMapping("/sensor-data/range")
    public List<SensorReading> getReadingsByDateRange(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        // string to localDateTime
        LocalDateTime start = LocalDateTime.parse(startDate);
        LocalDateTime end = LocalDateTime.parse(endDate);

        return repository.findByDateRange(start, end);
    }

    // ------------------------------------------------------------------------------------------------------------//

    // DELETE requests

    @DeleteMapping("/sensor-data/{id}")
    public ResponseEntity<?> deleteReading(@PathVariable Long id) {
        // if found delete + return 204, else 404
        if (repository.existsById(id)) {
            repository.deleteById(id);

            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // exception handler for invalid date/time
    @ExceptionHandler(DateTimeParseException.class)
    public ResponseEntity<String> handleDateParseException(DateTimeParseException ex) {
        return ResponseEntity.badRequest()
                .body("Invalid date format. Use ISO format: 2025-11-13T17:00:00");
    }
}
