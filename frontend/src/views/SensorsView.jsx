import { Search, Cpu, Battery, Wifi, RefreshCw, Settings, Thermometer, Droplets } from 'lucide-react';
import { Card, StatusBadge } from '../components/Shared';
import { formatTimestamp } from '../utils/formatTime';

export default function SensorsView({ readings = [], getStatus, isDeviceOnline }) {
    const devices = readings.map(reading => {
        const isOnline = isDeviceOnline(reading.timestamp);
        
        //all needed info for cards, add ability to name sensors?
        return {
            id: reading.deviceId,
            name: `Sensor ${reading.deviceId}`,
            status: isOnline ? getStatus(reading.temperature) : 'offline',
            temperature: reading.temperature,
            humidity: reading.humidity,
            lastSeen: formatTimestamp(reading.timestamp),
            isOnline: isOnline,
            battery: 85 + Math.floor(Math.random() * 15),  // RANDOM BATTERY LEVELS TILL WE IMPLEMENT ACTUAL READINGS
            signal: isOnline ? 70 + Math.floor(Math.random() * 30) : 0 // RANDOM SIGNAL LEVELS TILL WE IMPLEMENT ACTUAL READINGS
        };
    });

    return (
        <div className="view-container">
            <div className="view-header">
                <div>
                    <h2 className="view-title-section">
                        Device Management<span className="view-title-accent">.</span>
                    </h2>
                    <p className="view-subtitle">Monitor sensor health and readings</p>
                </div>
                <div className="search-input-wrapper">
                    {/*TODO: Add functionality*/}
                    <Search className="search-icon" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search Device ID..." 
                        className="search-input"
                    />
                </div>
            </div>

            <div className="devices-grid">
                {devices.map(device => (
                    <Card key={device.id} className="device-card">
                        <div className="device-card-header">
                            <div className="device-card-info">
                                {/*TODO: Custom status' for different scenarios*/}
                                <div className={`device-card-icon ${
                                    !device.isOnline || device.status === 'critical'
                                        ? 'device-card-icon--offline' 
                                        : 'device-card-icon--active'
                                }`}>
                                    <Cpu size={24} />
                                </div>
                                <div>
                                    <h3 className="device-name">{device.name}</h3>
                                    <p className="device-id">{device.id}</p>
                                </div>
                            </div>
                            <StatusBadge status={device.status} />
                        </div>
                        
                        <div className="device-metrics-grid">
                            <div className="device-metric">
                                <div className="device-metric-label">
                                    <Thermometer size={14} /> Temperature
                                </div>
                                {/*TODO: change to 'merica units? */}
                                <div className="device-metric-value">
                                    {device.isOnline ? `${device.temperature.toFixed(1)}°C` : '--'}
                                </div>
                            </div>
                            
                            <div className="device-metric">
                                <div className="device-metric-label">
                                    <Droplets size={14} /> Humidity
                                </div>
                                <div className="device-metric-value">
                                    {device.isOnline ? `${device.humidity.toFixed(1)}%` : '--'}
                                </div>
                            </div>

                            {/*TODO: Add real readings*/}
                            <div className="device-metric">
                                <div className="device-metric-label">
                                    <Battery size={14} /> Battery
                                </div>
                                <div className="device-metric-value">
                                    {device.battery}%
                                    <div className="battery-bar">
                                        <div 
                                            className={`battery-bar-fill ${device.battery < 20 ? 'battery-bar-fill--low' : 'battery-bar-fill--normal'}`}
                                            style={{ width: `${device.battery}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                            
                            {/*TODO: Add real readings*/}
                            <div className="device-metric">
                                <div className="device-metric-label">
                                    <Wifi size={14} /> Signal
                                </div>
                                <div className="device-metric-value">
                                    {device.isOnline ? `${device.signal}%` : 'Offline'}
                                </div>
                            </div>
                        </div>
                        
                        {/*TODO: Add functionality for settings and refresh, refresh just refreshes page, settings shows pop up menu. custom names?*/}
                        <div className="device-footer">
                            <div className="device-zone-info">
                                Last: <span className="device-zone-value">{device.lastSeen}</span>
                            </div>
                            <div className="device-actions">
                                <button 
                                    className="icon-button icon-button--primary" 
                                    title="Restart"
                                    disabled={!device.isOnline}
                                >
                                    <RefreshCw size={16} />
                                </button>
                                <button className="icon-button">
                                    <Settings size={16} />
                                </button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}