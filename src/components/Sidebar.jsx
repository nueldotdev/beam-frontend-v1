import React, { useState } from 'react'
import '../styles/sidebar.css'
import { SidebarData } from '../constants/SidebarData'

function Sidebar() {
  const [activeItem, setActiveItem] = useState('dashboard')
  const [collapsed, setCollapsed] = useState(false)

 

  const bottomItems = [
    { id: 'settings', icon: '⚙️', label: 'Settings', badge: null },
    { id: 'help', icon: '❓', label: 'Help', badge: null },
  ]

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Header */}
      <div className="sidebar-header">
        <div className={`logo ${collapsed ? 'hide' : ''}`}>
          <span className="logo-icon">🎯</span>
        </div>
       
      </div>

    {/* Main navigation */}
        <nav className="sidebar-nav">
          {SidebarData.filter(item => !['settings', 'help'].includes(item.id)).map((item) => (
            <button
            key={item.id}
            className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
            onClick={() => setActiveItem(item.id)}
            title={item.label}
            >
            <span className="nav-icon">
            {typeof item.icon === 'string' ? item.icon : React.createElement(activeItem === item.id && item['icon.active'] ? item['icon.active'] : item.icon)}
            </span>
            <span className={`nav-label ${collapsed ? 'hide' : ''}`}>
              {item.label}
            </span>
            {item.badge && (
              <span className={`badge ${collapsed ? 'badge-small' : ''}`}>
            {item.badge}
              </span>
            )}
            </button>
          ))}
        </nav>

        {/* Bottom navigation */}
        <nav className="sidebar-nav-bottom">
          {SidebarData.filter(item => ['settings', 'help'].includes(item.id)).map((item) => (
            <button
            key={item.id}
            className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
            onClick={() => setActiveItem(item.id)}
            >
            <span className="nav-icon">{typeof item.icon === 'string' ? item.icon : React.createElement(activeItem === item.id && item['icon.active'] ? item['icon.active'] : item.icon)}</span>
            </button>
          ))}
        </nav>

        {/* Profile section */}
      {/* <div className="sidebar-profile">
         <div className="profile-avatar">JD</div>
         <div className={`profile-info ${collapsed ? 'hide' : ''}`}>
          <p className="profile-name">John Doe</p>
          <p className="profile-status">Online</p>
        </div>
      </div> */}

    </div>
  )
}

export default Sidebar