import React, { useContext, useEffect, useRef, useState } from 'react';
import AppointmentForm from '../../components/Appointment/AppointmentForm/AppointmentForm';
import AppointmentTable from '../../components/Appointment/AppointmentTable/AppointmentTable';
import { UserContext } from '../../context/UserContext';
import emptyAppointment from '../../data/appointment';
import { AppointmentService } from '../../services/Appointment/AppointmentService';
import { DoctorService } from '../../services/Doctor/DoctorService';
import { RequestAppointmentService } from '../../services/RequestAppointmentService';
import { parseAppointments } from '../../utils/parser';

const Appointment = () => {
  const { user } = useContext(UserContext);
  const toast = useRef(null);
  const [appointmentDialog, setAppointmentDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [appointment, setAppointment] = useState({...emptyAppointment});
  const [appointments, setAppointments] = useState([]);

  const [especialidades, setEspecialidades] = useState([]);
  const [tipoDocumento, setTipoDocumento] = useState([]);
  const [tipoAtencion, setTipoAtencion] = useState([]);

  const [doctores, setDoctores] = useState([]);
  const [disponibilidad, setDisponibilidad] = useState([]);

  const appointmentService = new AppointmentService();
  const doctorService = new DoctorService();
  const reqAppointmentService = new RequestAppointmentService();

  useEffect(() => {
    appointmentService.getAppointments(user.cod_usuario, user.cod_perfil)
      .then(res => setAppointments(parseAppointments(res.data)))
      .catch(err => {
        console.error(err);
      });
    doctorService.getEspecialidades()
      .then(res => setEspecialidades(res.data))
      .catch(err => {
        console.error(err);
      });
    reqAppointmentService.getComboData()
      .then(({ data }) => {
        setTipoDocumento(data.tipoDocumento);
        setTipoAtencion(data.atencionData);
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

          setDoctores = {setDoctores}
          setDisponibilidad = {setDisponibilidad}
      />
      <AppointmentForm
        appointmentDialog = {appointmentDialog}
        setAppointmentDialog = {setAppointmentDialog}
        submitted = {submitted}
        setSubmitted = {setSubmitted}
        appointment = {appointment}
        setAppointment = {setAppointment}
        appointments = {appointments}
        setAppointments = {setAppointments}
        emptyAppointment = {emptyAppointment}
        toast = {toast}
        tipoDocumento = {tipoDocumento}
        tipoEspecialidad = {especialidades}
        tipoAtencion = {tipoAtencion}

        doctores = {doctores}
        setDoctores = {setDoctores}
        disponibilidad = {disponibilidad}
        setDisponibilidad = {setDisponibilidad}
      />
    </div>
  )
}

export default Appointment;
