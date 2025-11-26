import { 
  Thermometer, 
  Droplets, 
  Activity, 
  Zap 
} from 'lucide-react';
import { Card, StatusBadge } from '../components/Shared';

export default function MainView({ readings, stats, loading, getStatus, isDeviceOnline }) {
  return (
    <div className="view-container view-container--large-gap">
      <div className="view-header">
        <div>
          <h1 className="view-title-main">
            Monitor<span className="view-title-accent">.</span>
          </h1>
          <p className="view-subtitle">Real-Time Industrial Sensor Monitoring</p>
        </div>
        <button className="action-button">
          <Zap size={16} className="fill-current" />
          Action Center
        </button>
      </div>

      <div className="stats-grid">
        <Card className="card stat-card">
          <div className="stat-icon stat-icon--temp">
            <Thermometer size={24} />
          </div>
          <div>
            <p className="stat-label">Avg Temp</p>
            <p className="stat-value">{stats.avgTemp}°C</p>
          </div>
        </Card>
        
        <Card className="card stat-card">
          <div className="stat-icon stat-icon--humidity">
            <Droplets size={24} />
          </div>
          <div>
            <p className="stat-label">Avg Humidity</p>
            <p className="stat-value">{stats.avgHumidity}%</p>
          </div>
        </Card>
        
        <Card className="card stat-card">
          <div className="stat-icon stat-icon--activity">
            <Activity size={24} />
          </div>
          <div>
            <p className="stat-label">Active Devices</p>
            <p className="stat-value">{stats.uniqueDevices} Units</p>
          </div>
        </Card>
      </div>

      <Card className="card table-container">
        <div className="table-header">
          <h3 className="table-title">Live Sensor Readings</h3>
          <span className="table-endpoint">GET /api/sensor-data</span>
        </div>
        
        {loading ? (
          <div className="table-loading">Loading sensor data...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Device</th>
                  <th>Temperature</th>
                  <th>Humidity</th>
                  <th>Timestamp</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {readings.map(reading => {
                  const isOnline = isDeviceOnline(reading.timestamp);
                  const status = isOnline ? getStatus(reading.temperature) : 'offline';
                  
                  return (
                    <tr key={reading.deviceId} className={!isOnline ? 'row-offline' : ''}>
                      <td className="table-device-id">{reading.deviceId}</td>
                      <td>
                        <div className="table-temperature">
                          <span className={`temp-indicator ${
                            !isOnline 
                              ? 'temp-indicator--offline' 
                              : reading.temperature > 30 
                                ? 'temp-indicator--hot' 
                                : 'temp-indicator--normal'
                          }`}></span>
                          <span className="temp-value">
                            {isOnline ? `${reading.temperature}°C` : '--'}
                          </span>
                        </div>
                      </td>
                      <td className="table-humidity">
                        {isOnline ? `${reading.humidity}%` : '--'}
                      </td>
                      <td className="table-timestamp">
                        {new Date(reading.timestamp).toLocaleString()}
                      </td>
                      <td><StatusBadge status={status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}