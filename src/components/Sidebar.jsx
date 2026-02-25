import React, { useState } from 'react'
import '../styles/sidebar.css'
import { Link } from 'react-router-dom'
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
          {SidebarData.filter(item => !['logout', 'help'].includes(item.id)).map((item) => (
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
          {SidebarData.filter(item => ['logout'].includes(item.id)).map((item) => (

            <Link to={item.path || '#'}>
            <button
            key={item.id}
            className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
            onClick={() => setActiveItem(item.id)}
            >
            <span className="nav-icon">{typeof item.icon === 'string' ? item.icon : React.createElement(activeItem === item.id && item['icon.active'] ? item['icon.active'] : item.icon)}</span>
            {item.label}
            </button>
            </Link>
          ))}
        </nav>

      
    </div>
  )
}

export default Sidebar