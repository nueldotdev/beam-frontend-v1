import React, { useState } from 'react'
import '../styles/sidebar.css'
import beamlogo from '../assets/dashboard-images/beamlogo.png'
import { Link } from 'react-router-dom'
import { SidebarData } from '../constants/SidebarData'
import { useNavigate } from 'react-router-dom'

function Sidebar() {
  const [activeItem, setActiveItem] = useState('dashboard')
  const [collapsed, setCollapsed] = useState(false)
   const navigate = useNavigate();

 

  const bottomItems = [
    { id: 'settings', icon: '⚙️', label: 'Settings', badge: null },
    { id: 'help', icon: '❓', label: 'Help', badge: null },
  ]

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Header */}
      <div className="sidebar-header">
        <div className={`logo ${collapsed ? 'hide' : ''}`}>
            <img src={beamlogo} className='logo-icon' alt="Beam Logo" />
        </div>
       
      </div>

    {/* Main navigation */}
    

<nav className="sidebar-nav">
  {SidebarData.filter(item => !['logout', 'help'].includes(item.id)).map((item) => (
    <button
      key={item.id}
      className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
      onClick={() => {
        setActiveItem(item.id);
        navigate(item.route); // <-- Navigate to route
      }}
      title={item.label}
    >
      <span className="nav-icon">
        {typeof item.icon === 'string'
          ? item.icon
          : React.createElement(
              activeItem === item.id && item['icon.active'] ? item['icon.active'] : item.icon
            )}
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