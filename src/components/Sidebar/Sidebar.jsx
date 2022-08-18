import React, { useState } from 'react'
import { Link } from "react-router-dom";
import { SidebarData } from './SidebarData';

import 'primeicons/primeicons.css';
import './Sidebar.css';

function Sidebar() {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  return (
    <>
      <div className='navbar'>
        <Link to='#' className='menu-bars'>
          <i className="pi pi-bars" onClick={ showSidebar }></i>
        </Link>
        <h2>Proyecto Marketplace CMD</h2>
      </div>
      <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
        <ul className='nav-menu-items' onClick={ showSidebar }>
          <li className='navbar-toggle'>
            <Link to='#' className='menu-bars'>
              <i className="pi pi-times"></i>
            </Link>
          </li>
          {
            SidebarData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    {item.icon}
                    <span className='nav-link-sidebar'>{item.title}</span>
                  </Link>
                </li>
              );
            })
          }
        </ul>
      </nav>
    </>
  )
}

export default Sidebar;
