import React, { useContext } from 'react'
import RequestCrud from '../../components/Appointment/RequestTable/RequestCrud';
import RequestTable from '../../components/Appointment/RequestTable/RequestTable';
import { UserContext } from '../../context/UserContext';

function Appointment() {
  const { user } = useContext(UserContext);

  return (
    <div className = 'wrapper'>
      {
        user.cod_perfil === 3 
          ? <RequestCrud />
          : <RequestTable />
      }
    </div>
  )
}

export default Appointment;
