import React, { useContext, useEffect, useRef, useState } from 'react';
import AppointmentTable from '../../components/Appointment/AppointmentTable/AppointmentTable';
import { UserContext } from '../../context/UserContext';
import emptyAppointment from '../../data/appointment';
import { AppointmentService } from '../../services/Appointment/AppointmentService';
import { parseAppointments } from '../../utils/parser';

const Appointment = () => {
  const { user } = useContext(UserContext);
  const toast = useRef(null);
  const [appointmentDialog, setAppointmentDialog] = useState(false);
  const [appointment, setAppointment] = useState({...emptyAppointment});
  const [appointments, setAppointments] = useState([]);

  const appointmentService = new AppointmentService();

  useEffect(() => {
    appointmentService.getAppointments(user.cod_usuario, user.cod_perfil)
      .then(res => setAppointments(parseAppointments(res.data)))
      .catch(err => {
        console.error(err);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className='wrapper'>
      <AppointmentTable
          toast = {toast}
          setAppointmentDialog = {setAppointmentDialog}
          appointment = {appointment}
          setAppointment = {setAppointment}
          appointments = {appointments}
          setAppointments = {setAppointments}
          userPerfil = {user.cod_perfil}
      />
    </div>
  )
}

export default Appointment;
