import { 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  AlertOctagon, 
  Settings, 
  X,
  ChevronRight
} from 'lucide-react';

//Card Component
export const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-[32px] p-6 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 ${className}`}>
    {children}
  </div>
);

//Navigation Button 
export const PillButton = ({ active, onClick, icon: Icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-3 rounded-full transition-all duration-300 font-medium text-sm ${
      active 
        ? 'bg-slate-900 text-white shadow-lg transform scale-105' 
        : 'bg-transparent text-slate-500 hover:bg-slate-100'
    }`}
  >
    <Icon size={18} />
    <span>{label}</span>
  </button>
);

//toggle switch 
export const Toggle = ({ label, checked, onChange }) => (
    <div className="flex items-center justify-between py-3">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <button 
            onClick={() => onChange(!checked)}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${checked ? 'bg-blue-600' : 'bg-slate-200'}`}
        >
            <span className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
    </div>
);

// settingslist
export const SettingItem = ({ icon: Icon, label, subLabel, action }) => (
    <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer group">
        <div className="flex items-center gap-4">
            <div className="p-2 bg-slate-100 text-slate-600 rounded-xl group-hover:bg-white group-hover:shadow-sm transition-all">
                <Icon size={20} />
            </div>
            <div>
                <p className="text-sm font-bold text-slate-900">{label}</p>
                {subLabel && <p className="text-xs text-slate-400">{subLabel}</p>}
            </div>
        </div>
        {action || <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-500" />}
    </div>
);

// status badges,for sensor status, consider different colors
export const StatusBadge = ({ status }) => {
  const styles = {
    online: "bg-emerald-100 text-emerald-700",
    offline: "bg-slate-100 text-slate-500",
    maintenance: "bg-amber-100 text-amber-700",
    warning: "bg-rose-100 text-rose-700",
    active: "bg-rose-100 text-rose-700",
    resolved: "bg-slate-100 text-slate-500",
    acknowledged: "bg-blue-100 text-blue-700",
  };
  
  const icons = {
    online: <CheckCircle2 size={14} />,
    offline: <X size={14} />,
    maintenance: <Settings size={14} />,
    warning: <AlertTriangle size={14} />,
    active: <AlertOctagon size={14} />,
    resolved: <CheckCircle2 size={14} />,
    acknowledged: <Activity size={14} />,
  };

  const normalizedStatus = status === 'normal' ? 'online' : status === 'critical' ? 'warning' : status;

  return (
    <span className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${styles[normalizedStatus] || styles.online}`}>
      {icons[normalizedStatus]}
      <span>{normalizedStatus}</span>
    </span>
  );
};