import React, { useState } from 'react';
import { AlertOctagon } from 'lucide-react';
import { Card, StatusBadge } from '../components/Shared';

//TODO: Add real alerts! This is just for show
export default function AlertsView() {
    const [filter, setFilter] = useState('all');
    
    {/*Possible alerts: low battery, update pending, etc */}
    const alertsData = [
      { id: 1, severity: 'critical', title: 'Overheating Detected', device: 'Sensor A-001', message: 'Temperature reached 95°C', time: '2 min ago', status: 'active' },
      { id: 2, severity: 'warning', title: 'Signal Instability', device: 'Sensor C-003', message: 'Packet loss > 15%', time: '15 min ago', status: 'active' },
      { id: 3, severity: 'info', title: 'System Update', device: 'Sensor C-003', message: 'Firmware v2.4.1 installed', time: '1 hour ago', status: 'resolved' },
    ];
    
    const filteredAlerts = filter === 'all' ? alertsData : alertsData.filter(a => a.severity === filter);
    
    return (
      <div className="view-container">
        <div className="view-header">
            <div>
            <h2 className="view-title-section">
                System Alerts<span className="view-title-accent">.</span></h2>
                <p className="view-subtitle">Incident management and audit log</p>
            </div>
            <div className="filter-buttons">
                {['all', 'critical', 'warning'].map(f => (
                    <button 
                        key={f} 
                        onClick={() => setFilter(f)} 
                        className={`filter-button ${filter === f ? 'filter-button--active' : ''}`}
                    >
                        {f}
                    </button>
                ))}
            </div>
        </div>
        
        {/*TODO: ADD TIME OF ALERT AND DEVICE NAME, MAKE CLICKABLE TO VIEW MORE INFO. Make tiny noti button on top redirect here or small menu? */}
        <div className="alerts-grid">
            {filteredAlerts.map((alert) => (
                <Card 
                    key={alert.id} 
                    className={`alert-card alert-card--${alert.severity}`}
                >
                    <div className="alert-card-content">
                        <div className="alert-card-main">
                            <div className={`alert-icon alert-icon--${alert.severity}`}>
                                <AlertOctagon size={20} />
                            </div>
                            <div className="alert-text">
                                <h3 className="alert-title">{alert.title}</h3>
                                <p className="alert-message">{alert.message}</p>
                            </div>
                        </div>
                        <StatusBadge status={alert.status} />
                    </div>
                </Card>
            ))}
        </div>
      </div>
    );
}