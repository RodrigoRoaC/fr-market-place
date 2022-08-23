import React, { useContext } from 'react'
import AppointmentTable from '../../components/AppointmentTable/AppointmentTable';
import DataTableCrud from '../../components/DataTableCrud/DataTableCrud'
import { UserContext } from '../../context/UserContext';

function Appointment() {
  const { user } = useContext(UserContext);

  return (
    <div className = 'wrapper'>
      {
        user.cod_perfil === 3 
          ? <DataTableCrud />
          : <AppointmentTable />
      }
      
    </div>
  )
}

export default Appointment;
