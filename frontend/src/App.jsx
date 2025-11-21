import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import DashboardView from './components/DashboardView';
import SensorsView from './components/SensorsView';
import { Activity, TrendingUp, Bell, Settings, Cpu } from 'lucide-react';

function App() {
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  // need to decide values + add more states
  const getStatus = (temperature) => {
    if (temperature > 35) return 'critical';
    if (temperature > 30) return 'warning';
    return 'normal';
  };

  useEffect(() => {
    axios.get('http://localhost:8080/api/sensor-data')
      .then(response => {
        setReadings(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  // just gives cool averages
  const stats = {
    avgTemp: readings.length > 0 
      ? (readings.reduce((sum, r) => sum + r.temperature, 0) / readings.length).toFixed(1)
      : '--',
    avgHumidity: readings.length > 0
      ? (readings.reduce((sum, r) => sum + r.humidity, 0) / readings.length).toFixed(1)
      : '--',
    uniqueDevices: new Set(readings.map(r => r.deviceId)).size,
    totalReadings: readings.length
  };

  // Get latest reading for each device
  const latestByDevice = {};
  readings.forEach(reading => {
    const deviceId = reading.deviceId;
    if (!latestByDevice[deviceId] || 
        new Date(reading.timestamp) > new Date(latestByDevice[deviceId].timestamp)) {
      latestByDevice[deviceId] = reading;
    }
  });

  //sorts by deviceId, need naming convention
  const deviceReadings = Object.values(latestByDevice).sort((a, b) => 
    a.deviceId.localeCompare(b.deviceId)
  );

  if (loading) {
    return (
      // look into customizing
      <div className="loading-screen">
        <div>Loading sensor data...</div>
      </div>
    );
  }

  return (
    <div className="app-container">
      
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">⚙</div>
          <div className="logo-text">
            <h2>FactoryWatch</h2>
            <p>Industrial OS</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <Activity size={18} />
            <span>Dashboard</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'sensors' ? 'active' : ''}`}
            onClick={() => setActiveTab('sensors')}
          >
            <Cpu size={18} />
            <span>Sensors</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <TrendingUp size={18} />
            <span>Analytics</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'alerts' ? 'active' : ''}`}
            onClick={() => setActiveTab('alerts')}
          >
            <Bell size={18} />
            <span>Alerts</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={18} />
            <span>Settings</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="connection-status">
            <span className="status-dot online"></span>
            <div>
              <p className="status-label">Connection</p>
              <p className="status-value">Online</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT, Using components */}
      <main className="main-content">
        {activeTab === 'dashboard' && (
          <DashboardView 
            stats={stats} 
            deviceReadings={deviceReadings} 
            getStatus={getStatus} 
          />
        )}
        
        {activeTab === 'sensors' && (
          <SensorsView 
            deviceReadings={deviceReadings}
            getStatus={getStatus} 
          />
        )}

        {activeTab === 'analytics' && (
          <div className="App">
            <h1>Analytics</h1>
            <p>Coming soon</p>
          </div>
        )}
        
        {activeTab === 'alerts' && (
          <div className="App">
            <h1>Alerts</h1>
            <p>Coming soon</p>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="App">
            <h1>Settings</h1>
            <p>Coming soon</p>
          </div>
        )}
      </main>

    </div>
  );
}

export default App;