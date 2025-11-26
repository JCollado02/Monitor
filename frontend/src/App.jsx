import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { Activity, Bell, TrendingUp, Settings, Menu, X, Cpu } from 'lucide-react';
import { Card, PillButton } from './components/Shared';
import './App.css';
import logoImg from './assets/logo.png'; 

// Import Views
import MainView from './views/MainView';
import SensorsView from './views/SensorsView';
import AlertsView from './views/AlertsView';
import HistoryView from './views/HistoryView';
import SettingsView from './views/SettingsView';


export default function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const getStatus = (temperature) => {
    if (temperature > 35) return 'critical';
    if (temperature > 30) return 'warning';
    return 'normal';
  };

  // Check if device is online (reading within last 5 minutes, consider lower)
  const isDeviceOnline = (timestamp) => {
    const now = new Date();
    const readingTime = new Date(timestamp);
    const minutesSince = (now - readingTime) / (1000 * 60);
    return minutesSince < 5;
  };

  useEffect(() => {
    const fetchData = () => {
      axios.get('http://localhost:8080/api/sensor-data')
        .then(response => {
          setReadings(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          setLoading(false);
        });
    };

    fetchData();
    // Poll every 30 seconds for live updates
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

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

  const deviceReadings = Object.values(latestByDevice).sort((a, b) => 
    a.deviceId.localeCompare(b.deviceId)
  );

  // Count online devices
  const onlineDevices = deviceReadings.filter(r => isDeviceOnline(r.timestamp)).length;
  const connectionStatus = onlineDevices > 0 ? 'connected' : 'offline';

  if (loading) {
    return (
      <div className="loading-screen">
        <div>Loading sensor data...</div>
      </div>
    );
  }

  return (
    <div className="app-container">
      
      {/* Mobile Header */}
      <div className="mobile-header lg:hidden">
        <div className="flex items-center gap-2">
          <div className="logo-icon">
            <Activity size={18} className="text-white" />
          </div>
          <img src={logoImg} alt="Monitor" className="h-4 w-auto"/>
        </div>
        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="mobile-menu-button">
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className="app-wrapper">
        
        {/* Sidebar Navigation */}
        <aside className={`sidebar ${isSidebarOpen ? 'sidebar--open' : 'sidebar--closed'} lg:sidebar--open`}>
          <div className="hidden lg:flex items-center gap-3 mb-12 px-2">
            <div className="logo-icon logo-icon--large">
              <Activity size={20} className="text-white" />
            </div>
            <div>
              <img src={logoImg} alt="Monitor" className="h-5 w-auto"/>
              <p className="logo-subtitle">Industrial OS</p>
            </div>
          </div>

          <nav className="nav-menu">
            {[
              { id: 'Dashboard', label: 'Live Monitor', icon: Activity },
              { id: 'Sensors', label: 'Sensors', icon: Cpu }, 
              { id: 'Alerts', label: 'Alerts', icon: Bell }, 
              { id: 'Analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'Settings', label: 'Settings', icon: Settings }, 
            ].map((item) => (
              <PillButton 
                key={item.id}
                label={item.label}
                icon={item.icon}
                active={activeTab === item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              />
            ))}
          </nav>

          <div className="mt-auto pt-8">
            <Card className="connection-card !bg-slate-900 !text-white !border-none !p-5">
              <div className="relative z-10">
                <p className="text-xs text-slate-400 mb-1">Connection</p>
                <p className="font-bold text-lg flex items-center gap-2">
                  <span className={`connection-status-dot ${
                    connectionStatus === 'connected' 
                      ? 'connection-status-dot--online' 
                      : 'connection-status-dot--simulation'
                  }`}></span>
                  {onlineDevices} / {deviceReadings.length} Online
                </p>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <Activity size={100} />
              </div>
            </Card>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="main-content">
          <header className="main-header">
            <div className="breadcrumb">
              <span>Home</span>
              <span className="mx-2">/</span>
              <span className="breadcrumb-active">{activeTab}</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="notification-button">
                <Bell size={18} />
              </button>
              <div className="user-profile">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-bold text-slate-900">Admin User</p>
                  <p className="text-xs text-slate-500">Supervisor</p>
                </div>
                <div className="user-avatar">AU</div>
              </div>
            </div>
          </header>

          {activeTab === 'Dashboard' && (
            <MainView 
              stats={stats} 
              readings={deviceReadings} 
              loading={loading} 
              getStatus={getStatus}
              isDeviceOnline={isDeviceOnline}
            />
          )}
          {activeTab === 'Sensors' && (
            <SensorsView 
              readings={deviceReadings} 
              getStatus={getStatus}
              isDeviceOnline={isDeviceOnline}
            />
          )}
          {activeTab === 'Alerts' && <AlertsView />}
          {activeTab === 'Analytics' && (
            <HistoryView 
              readings={readings} 
              getStatus={getStatus}
            />
          )}
          {activeTab === 'Settings' && <SettingsView />}
        </main>
      </div>
    </div>
  );
}