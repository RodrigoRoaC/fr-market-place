import React, { useContext, useState } from 'react'
import { Link } from "react-router-dom";
import { SidebarData } from './SidebarData';

import 'primeicons/primeicons.css';
import './Sidebar.css';
import { UserContext } from '../../context/UserContext';
import { Button } from 'primereact/button';

function Sidebar() {
  const { user, setUser} = useContext(UserContext);
  // const [sidebar, setSidebar] = useState(false);

  // const showSidebar = () => setSidebar(!sidebar);

  const logOut = () => {
    localStorage.removeItem('cmd_user');
    setUser(null);
  }

  return (
    <>
      {/* <div className='navbar'>
        <Link to='#' className='menu-bars'>
          <i className="pi pi-bars" onClick={ showSidebar }></i>
        </Link>
        <h2>Proyecto Marketplace CMD</h2>
      </div> */}
      <nav className='nav-menu active'>
        <ul className='nav-menu-items'>
          <div class="perfil">
            <i class='pi pi-align-left'></i>
            <span class="perfil_name">{user.cod_perfil}</span>
          </div>
          {
            SidebarData.map((item, index) => {
              if (!item.acl.includes(user.cod_perfil)) {
                return (<React.Fragment key={index}></React.Fragment>);
              }
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    <i className={item.icon}></i>
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
