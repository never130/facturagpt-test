import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import './styles/Dashboard.css';

function App() {
  const [currentView, setCurrentView] = useState('overview');
  const [theme, setTheme] = useState('light');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className={`app ${theme}`}>
      <Sidebar 
        currentView={currentView}
        onViewChange={setCurrentView}
        collapsed={sidebarCollapsed}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <div className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
        <header className="header">
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {sidebarCollapsed ? '☰' : '✕'}
          </button>
          <h1>📊 Dashboard Analytics</h1>
          <div className="header-actions">
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <div className="user-profile">
              <span className="user-avatar">👤</span>
              <span className="user-name">Admin</span>
            </div>
          </div>
        </header>
        <Dashboard currentView={currentView} theme={theme} />
      </div>
    </div>
  );
}

export default App; 