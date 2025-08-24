import React from 'react';

function Sidebar({ currentView, onViewChange, collapsed, theme, onToggleTheme }) {
  const menuItems = [
    { id: 'overview', label: 'Vista General', icon: '📊' },
    { id: 'sales', label: 'Ventas', icon: '💰' },
    { id: 'users', label: 'Usuarios', icon: '👥' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'reports', label: 'Reportes', icon: '📋' },
    { id: 'settings', label: 'Configuración', icon: '⚙️' }
  ];

  return (
    <div className={`sidebar ${theme} ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">📊</span>
          {!collapsed && <span className="logo-text">Analytics</span>}
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => (
            <li key={item.id} className="nav-item">
              <button
                className={`nav-link ${currentView === item.id ? 'active' : ''}`}
                onClick={() => onViewChange(item.id)}
                title={collapsed ? item.label : ''}
              >
                <span className="nav-icon">{item.icon}</span>
                {!collapsed && <span className="nav-label">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <button
          className="theme-toggle-btn"
          onClick={onToggleTheme}
          title={collapsed ? 'Cambiar tema' : ''}
        >
          <span className="theme-icon">{theme === 'light' ? '🌙' : '☀️'}</span>
          {!collapsed && <span className="theme-label">Tema</span>}
        </button>
        
        {!collapsed && (
          <div className="user-info">
            <div className="user-avatar">👤</div>
            <div className="user-details">
              <div className="user-name">Admin User</div>
              <div className="user-role">Administrador</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar; 