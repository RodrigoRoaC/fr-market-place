import React, { useContext, useEffect, useRef, useState } from 'react'
import SingleDoctor from '../../components/Doctor/DoctorForm/SingleDoctor';
import { UserContext } from '../../context/UserContext';
import emptyDoctor from '../../data/doctor';
import { AppointmentService } from '../../services/AppointmentService';
import { DoctorService } from '../../services/Doctor/DoctorService';
import { dateToISOString } from '../../utils/parser';

const SingleDoctorPage = () => {
  const { user } = useContext(UserContext);
  const toast = useRef(null);
  const [doctor, setDoctor] = useState({ ...emptyDoctor });  

  const [especilidades, setEspecilidades] = useState(null);
  const [ventanaHoraria, setVentanaHoraria] = useState(null);
  const [tipoDocumentos, setTipoDocumentos] = useState(null);

  const [selectedHorarios, setSelectedHorarios] = useState([]);

  const doctorService = new DoctorService();
  const appointmentService = new AppointmentService();

  useEffect(() => {
    doctorService.getDoctor(user.cod_usuario)
      .then(res => {
        setDoctor(res.data)
        doctorService.getVentanaHorariaByDate({ fecha_reserva: dateToISOString(), cod_doctor: res.data.cod_doctor })
        .then(({ data }) => setSelectedHorarios((data || []).map(d => d.value)))
      })
      .catch(err => {
        console.error(err);
      });
    doctorService.getVentanaHoraria()
      .then(res => setVentanaHoraria(res.data))
      .catch(err => {
        console.error(err);
      });
    doctorService.getEspecialidades()
      .then(res => setEspecilidades(res.data))
      .catch(err => {
        console.error(err);
      });
    appointmentService.getComboData()
      .then(({ data }) => setTipoDocumentos(data.tipoDocumento))
      .catch(err => {
        console.error(err);
      });
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className='wrapper'>
      <SingleDoctor
        toast = {toast}

        doctor = {doctor}
        setDoctor = {setDoctor}

        especilidades = {especilidades}
        ventanaHoraria = {ventanaHoraria}
        tipoDocumentos = {tipoDocumentos}
        selectedHorarios = {selectedHorarios}
        setSelectedHorarios = {setSelectedHorarios}
      />
    </div>
  )
}

export default SingleDoctorPage;
