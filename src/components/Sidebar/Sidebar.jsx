import React, { useContext, useState } from 'react'
import { Link } from "react-router-dom";
import { SidebarData } from './SidebarData';

import 'primeicons/primeicons.css';
import './Sidebar.css';
import { UserContext } from '../../context/UserContext';
import { Button } from 'primereact/button';

function Sidebar() {
  const { user, setUser} = useContext(UserContext);
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  const logOut = () => {
    localStorage.removeItem('cmd_user');
    setUser(null);
  }

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
              if (!item.acl.includes(user.cod_perfil)) {
                return (<React.Fragment key={index}></React.Fragment>);
              }
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
          <div className='cerrar-sesion'>
            <li className=' nav-text'>
              <Button icon='pi pi-power-off' className='white p-button-text' label='Cerrar Sesión' onClick={logOut}/>
            </li>
          </div>
        </ul>
      </nav>
    </>
  )
}

export default Sidebar;
