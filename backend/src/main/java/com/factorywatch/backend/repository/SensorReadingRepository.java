package com.factorywatch.backend.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.factorywatch.backend.model.SensorReading;

@Repository
public interface SensorReadingRepository extends JpaRepository<SensorReading, Long> {
    List<SensorReading> findByDeviceId(String deviceId);

    // custom query for getting readings from certain times
    @Query("SELECT s FROM SensorReading s WHERE s.timestamp BETWEEN :start AND :end ORDER BY s.timestamp DESC")
    List<SensorReading> findByDateRange(@Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);
}
