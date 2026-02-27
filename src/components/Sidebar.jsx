import React, { useState } from 'react'
import '../styles/sidebar.css'
import beamlogo from '../assets/dashboard-images/beamlogo.png'
import { Link } from 'react-router-dom'
import { SidebarData } from '../constants/SidebarData'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  const navigate = useNavigate();
  const location = useLocation(); // ✅ REQUIRED

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>

      <div className="sidebar-header">
        <div className={`logo ${collapsed ? 'hide' : ''}`}>
          <img src={beamlogo} className='logo-icon' alt="Beam Logo" />
        </div>
      </div>

      {/* Main navigation */}
     <nav className="sidebar-nav">
  {SidebarData
    .filter(item => !['logout', 'help'].includes(item.id))
    .map((item) => {

      const isActive = location.pathname === item.path;

      return (
        <Link
          key={item.id}
          to={item.path}
          className={`nav-item ${isActive ? 'active' : ''}`}
        >
          <span className="nav-icon">
            {typeof item.icon === 'string'
              ? item.icon
              : React.createElement(
                  isActive && item['icon.active']
                    ? item['icon.active']
                    : item.icon
                )}
          </span>

          {!collapsed && (
            <span className="nav-label">
              {item.label}
            </span>
          )}

          {item.badge && !collapsed && (
            <span className="badge">
              {item.badge}
            </span>
          )}
        </Link>
      );
    })}
</nav>

      {/* Bottom navigation */}
      <nav className="sidebar-nav-bottom">
  {SidebarData
    .filter(item => item.id === 'logout')
    .map((item) => {

      const isActive = location.pathname === item.path;

      return (
        <Link
          key={item.id}
          to={item.path}
          className={`nav-item ${isActive ? 'active' : ''}`}
        >
          <span className="nav-icon">
            {typeof item.icon === 'string'
              ? item.icon
              : React.createElement(
                  isActive && item['icon.active']
                    ? item['icon.active']
                    : item.icon
                )}
          </span>

          {!collapsed && item.label}
        </Link>
      );
    })}
</nav>

    </div>
  )
}

export default Sidebar