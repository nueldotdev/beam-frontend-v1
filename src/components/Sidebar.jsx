import React, { useState } from 'react'
import '../styles/sidebar.css'
import beamlogo from '../assets/dashboard-images/beamlogo.png'
import { Link } from 'react-router-dom'
import { SidebarData } from '../constants/SidebarData'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

function Sidebar({closeSidebar,isOpen}) {
  const [collapsed, setCollapsed] = useState(false)


  const navigate = useNavigate();
  const location = useLocation(); // ✅ REQUIRED

  return (
     <div className={`sidebar ${isOpen ? "open" : ""}`}>

      <div className="sidebar-header">
        <div className={`logo ${collapsed ? 'hide' : ''}`}>
          <img src={beamlogo} className='logo-icon' alt="Beam Logo" />
          <h2 className="logo-text">Beam</h2>
        </div>
         <button className="close-btn" onClick={closeSidebar}>
          ✕
        </button>
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

            <span className="nav-label">
              {item.label}
            </span>
    
            
        
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

          {item.label}
        </Link>
      );
    })}
</nav>

    </div>
  )
}

export default Sidebar