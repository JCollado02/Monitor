import { Cpu, Wifi, Battery, Search, RefreshCw, Settings, CheckCircle2, X, AlertTriangle } from 'lucide-react';

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-[32px] p-6 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 ${className}`}>
    {children}
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    online: "bg-emerald-100 text-emerald-700",
    offline: "bg-slate-100 text-slate-500",
    maintenance: "bg-amber-100 text-amber-700",
    warning: "bg-amber-100 text-amber-700",
    normal: "bg-emerald-100 text-emerald-700",
    critical: "bg-rose-100 text-rose-700",
  };
  
  const icons = {
    online: <CheckCircle2 size={14} />,
    offline: <X size={14} />,
    maintenance: <Settings size={14} />,
    warning: <AlertTriangle size={14} />,
    normal: <CheckCircle2 size={14} />,
    critical: <AlertTriangle size={14} />,
  };

  return (
    <span className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${styles[status] || styles.online}`}>
      {icons[status]}
      <span>{status}</span>
    </span>
  );
};

function SensorsView({ deviceReadings, getStatus }) {
  // Convert device readings to device inventory format
  const devices = deviceReadings.map((reading, index) => ({
    id: reading.deviceId,
    name: reading.deviceId,
    zone: 'Zone ' + (index % 3 + 1),
    type: 'Temp/Humidity',
    status: getStatus(reading.temperature),
    battery: 85 - (index * 5), // Mock battery data
    signal: 90 - (index * 10), // Mock signal data
    lastSeen: new Date(reading.timestamp).toLocaleTimeString(),
    temperature: reading.temperature,
    humidity: reading.humidity,
  }));

  return (
    <div className="App">
      <h1>Device Management</h1>
      <p className="subtitle" style={{ marginBottom: '2rem' }}>Monitor connection health and sensor status</p>

      {/* Search Bar */}
      <div className="flex justify-end mb-6">
        <div className="relative group w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search ID or Zone..." 
            className="w-full bg-white border border-slate-200 rounded-full pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Devices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {devices.map(device => (
          <Card key={device.id} className="relative group hover:border-blue-200 transition-colors">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${device.status === 'critical' || device.status === 'offline' ? 'bg-slate-100 text-slate-400' : 'bg-blue-50 text-blue-600'}`}>
                  <Cpu size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{device.name}</h3>
                  <p className="text-xs text-slate-400 font-mono">{device.type}</p>
                </div>
              </div>
              <StatusBadge status={device.status} />
            </div>

            {/* Tech Specs Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                  <Battery size={14} /> Battery
                </div>
                <div className="font-bold text-slate-700">
                  {device.battery}%
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className={`h-full rounded-full ${device.battery < 20 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${device.battery}%` }}></div>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                  <Wifi size={14} /> Signal
                </div>
                <div className="font-bold text-slate-700 flex items-center gap-1">
                  {device.signal}%
                  {device.signal > 50 ? <span className="w-2 h-2 bg-emerald-500 rounded-full ml-auto"></span> : <span className="w-2 h-2 bg-amber-500 rounded-full ml-auto"></span>}
                </div>
              </div>
            </div>

            {/* Device Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="text-xs text-slate-400">
                Zone: <span className="font-medium text-slate-600">{device.zone}</span>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-blue-600 transition-colors" title="View Details">
                  <RefreshCw size={16} />
                </button>
                <button className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition-colors" title="Settings">
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

export default SensorsView;