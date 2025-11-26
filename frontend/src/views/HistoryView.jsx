import { useState, useMemo } from 'react';
import { 
  Download, 
  Thermometer, 
  ArrowUpRight, 
  Droplets, 
  Activity, 
  Maximize2 
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar
} from 'recharts';
import { Card } from '../components/Shared';

// TODO: maybe make it so we can see charts per sensor? also add expansion of charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip-label">{label}</p>
        <p className="chart-tooltip-value">
           <span className="chart-tooltip-dot" style={{ backgroundColor: payload[0].color }}></span>
           {payload[0].value}
           <span className="chart-tooltip-unit">
             {payload[0].name === 'Temperature' ? '°C' : payload[0].name === 'Humidity' ? '%' : ' Events'}
           </span>
        </p>
      </div>
    );
  }
  return null;
};

export default function HistoryView({ readings = [], getStatus }) {
    const [timeRange, setTimeRange] = useState('7D');
    
    const processChartData = (range) => {
        if (readings.length === 0) return [];

        //keep 30 days?
        const now = new Date();
        const filtered = readings.filter(r => {
            const readingDate = new Date(r.timestamp);
            if (range === '24H') return now - readingDate < 24 * 60 * 60 * 1000;
            if (range === '7D') return now - readingDate < 7 * 24 * 60 * 60 * 1000;
            if (range === '30D') return now - readingDate < 30 * 24 * 60 * 60 * 1000;
            return true;
        });

        // Sort readings by timestamp
        filtered.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        // Group readings by time period
        const grouped = {};
        filtered.forEach(reading => {
            const date = new Date(reading.timestamp);
            let key;
            
            if (range === '24H') {
                // Group by hour with date to avoid mixing different days (thx claude lol, didnt see)
                key = `${date.getHours().toString().padStart(2, '0')}:00`;
            } else if (range === '7D') {
                key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            } else {
                key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            }

            if (!grouped[key]) {
                grouped[key] = { temps: [], hums: [], events: 0, timestamp: date };
            }
            grouped[key].temps.push(reading.temperature);
            grouped[key].hums.push(reading.humidity);
            
            // Count events (any warnings and critical, consider just warnings?)
            const status = getStatus(reading.temperature);
            if (status === 'warning' || status === 'critical') {
                grouped[key].events++;
            }
        });

        // Convert to chart format and sort by timestamp
        return Object.entries(grouped)
            .map(([name, data]) => ({
                name,
                temperature: parseFloat((data.temps.reduce((a, b) => a + b, 0) / data.temps.length).toFixed(1)),
                humidity: parseFloat((data.hums.reduce((a, b) => a + b, 0) / data.hums.length).toFixed(1)),
                events: data.events,
                timestamp: data.timestamp
            }))
            .sort((a, b) => a.timestamp - b.timestamp);
    };

    const chartData = useMemo(() => processChartData(timeRange), [readings, timeRange]);

    // Calculate stats from raw readings
    const avgTemp = chartData.length > 0 
        ? (chartData.reduce((acc, curr) => acc + curr.temperature, 0) / chartData.length).toFixed(1)
        : '--';

    const maxTemp = readings.length > 0  // Use raw readings, not chartData, fixes peak from being incorrct
        ? Math.max(...readings.map(r => r.temperature)).toFixed(1)
        : '--';

    const avgHum = chartData.length > 0 
        ? (chartData.reduce((acc, curr) => acc + curr.humidity, 0) / chartData.length).toFixed(1)
        : '--';
        
    const totalEvents = chartData.reduce((acc, curr) => acc + curr.events, 0);

    const handleExport = () => {
        const csv = [
            ['Time', 'Temperature (°C)', 'Humidity (%)', 'Events'],
            ...chartData.map(d => [d.name, d.temperature, d.humidity, d.events])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });  // cool csv option
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `monitor-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    return (
      <div className="view-container">
        <div className="view-header">
            <div>
                <h2 className="view-title-section">Analytics Dashboard<span className="view-title-accent">.</span></h2>
                <p className="view-subtitle">Historical performance analysis and data visualization</p>
            </div>
            <div className="analytics-controls">
                <button className="export-button" onClick={handleExport}>
                    <Download size={14} /> Export CSV
                </button>
                <div className="filter-buttons">
                    {['24H', '7D', '30D'].map(range => (
                        <button 
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`filter-button ${timeRange === range ? 'filter-button--active' : ''}`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        <div className="stats-grid stats-grid--four">
            <Card className="stat-card-gradient">
                <div className="stat-card-label">
                    <Thermometer size={12}/> Avg Temp
                </div>
                <div className="stat-card-value">{avgTemp}°C</div>
            </Card>
            
            <Card className="stat-card-gradient">
                <div className="stat-card-label stat-card-label--rose">
                    <ArrowUpRight size={12}/> Peak Temp
                </div>
                <div className="stat-card-value stat-card-value--rose">{maxTemp}°C</div>
            </Card>
            
            <Card className="stat-card-gradient">
                <div className="stat-card-label stat-card-label--blue">
                    <Droplets size={12}/> Avg Humidity
                </div>
                <div className="stat-card-value stat-card-value--blue">{avgHum}%</div>
            </Card>
            
            <Card className="stat-card-gradient">
                <div className="stat-card-label">
                    <Activity size={12}/> Total Events
                </div>
                <div className="stat-card-value">{totalEvents}</div>
            </Card>
        </div>

        <div className="charts-grid">
            
            <Card className="chart-card" style={{ minHeight: '400px' }}>
                <div className="chart-card-header">
                    <div>
                        <h3 className="chart-card-title">Temperature Trend</h3>
                        <p className="chart-card-subtitle">Thermal fluctuations over {timeRange}</p>
                    </div>
                    <button className="chart-expand-button">
                        <Maximize2 size={16} />
                    </button>
                </div>
                <div className="chart-container">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#e11d48" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#e11d48" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="temperature" name="Temperature" stroke="#e11d48" strokeWidth={3} fillOpacity={1} fill="url(#colorTemp)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <Card className="chart-card" style={{ minHeight: '400px' }}>
                 <div className="chart-card-header">
                    <div>
                        <h3 className="chart-card-title">Humidity Levels</h3>
                        <p className="chart-card-subtitle">Environmental moisture tracking</p>
                    </div>
                    <button className="chart-expand-button">
                        <Maximize2 size={16} />
                    </button>
                </div>
                <div className="chart-container">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorHum" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="humidity" name="Humidity" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorHum)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <Card className="chart-card chart-card--full" style={{ minHeight: '350px' }}>
                <div className="chart-card-header">
                    <div>
                        <h3 className="chart-card-title">System Activity & Alerts</h3>
                        <p className="chart-card-subtitle">Frequency of triggered events per period</p>
                    </div>
                     <div className="chart-legend">
                        <span className="chart-legend-dot"></span>
                        <span className="chart-legend-label">Events</span>
                     </div>
                </div>
                <div className="chart-container chart-container--bar">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10}interval={2}/>
                            <Tooltip content={<CustomTooltip />} cursor={{fill: '#f8fafc'}} />
                            <Bar dataKey="events" name="Events" fill="#1e293b" radius={[4, 4, 0, 0]} maxBarSize={50} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>

        </div>
      </div>
    );
}