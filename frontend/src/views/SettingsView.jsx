import { useState } from 'react';
import { 
  Bell, 
  Mail, 
  Moon, 
  Globe, 
  Shield, 
  Database, 
  RefreshCw, 
  LogOut 
} from 'lucide-react';
import { Card, Toggle, SettingItem } from '../components/Shared';

//TODO: currently no functioanlty on this page, add it
export default function SettingsView() {
    const [notifications, setNotifications] = useState(true);
    const [emailReports, setEmailReports] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [autoRefresh, setAutoRefresh] = useState(true);

    return (
        <div className="view-container settings-container">
            <div>
                <h2 className="view-title-section">Settings<span className="view-title-accent">.</span></h2>
                <p className="view-subtitle">Manage your preferences and account settings</p>
            </div>

            <Card className="profile-card">
                <div className="profile-avatar">
                    AU
                </div>
                <div className="profile-info">
                    <div className="profile-header">
                        <h3 className="profile-name">Admin User</h3>
                        <span className="profile-badge">Supervisor</span>
                    </div>
                    <p className="profile-email">admin.user@monitor.com</p>
                </div>
                <button className="profile-edit-button">
                    Edit Profile
                </button>
            </Card>

            <div className="settings-grid">
                <Card className="settings-section">
                    <h4 className="settings-section-title">General Preferences</h4>
                    
                    <div className="setting-row">
                        <div className="setting-row-content">
                            <div className="setting-icon setting-icon--indigo">
                                <Bell size={18} />
                            </div>
                            <span className="setting-label">Push Notifications</span>
                        </div>
                        <Toggle checked={notifications} onChange={setNotifications} />
                    </div>

                    <div className="setting-row">
                        <div className="setting-row-content">
                            <div className="setting-icon setting-icon--purple">
                                <Mail size={18} />
                            </div>
                            <span className="setting-label">Email Reports</span>
                        </div>
                        <Toggle checked={emailReports} onChange={setEmailReports} />
                    </div>

                    <div className="setting-row">
                        <div className="setting-row-content">
                            <div className="setting-icon setting-icon--slate">
                                <Moon size={18} />
                            </div>
                            <span className="setting-label">Dark Mode (Beta)</span>
                        </div>
                        <Toggle checked={darkMode} onChange={setDarkMode} />
                    </div>
                </Card>

                <Card className="settings-section">
                    <h4 className="settings-section-title">System & Security</h4>
                    
                    <SettingItem icon={Globe} label="Language" subLabel="English (US)" />
                    <SettingItem icon={Shield} label="Security" subLabel="2FA Enabled" />
                    <SettingItem icon={Database} label="Data Refresh" subLabel="Every 5 seconds" />
                    
                    <div className="setting-row setting-row--bordered">
                         <div className="setting-row-content">
                            <div className="setting-icon setting-icon--emerald">
                                <RefreshCw size={18} />
                            </div>
                            <span className="setting-label">Auto-Refresh</span>
                        </div>
                        <Toggle checked={autoRefresh} onChange={setAutoRefresh} />
                    </div>
                </Card>
            </div>
            
            <button className="logout-button">
                <LogOut size={20} />
                Log Out of Session
            </button>

            
            {/*24=year, K=month (Nov), 001=iteration*/}
            <p className="version-footer">Monitor OS v1.0.1 • Build 24K001</p>
        </div>
    );
}