import React, { useEffect, useRef, useState } from 'react'
import DoctorForm from '../../components/Doctor/DoctorForm/DoctorForm';
import DoctorTable from '../../components/Doctor/DoctorTable/DoctorTable'
import emptyDoctor from '../../data/doctor';
import { RequestAppointmentService } from '../../services/RequestAppointmentService';
import { DoctorService } from '../../services/Doctor/DoctorService';

const Doctor = () => {
  const toast = useRef(null);
  const [mode, setMode] = useState('CREATE');
  const [submitted, setSubmitted] = useState(false);
  const [doctorDialog, setDoctorDialog] = useState(false);
  const [doctor, setDoctor] = useState({ ...emptyDoctor });  

  const [doctors, setDoctors] = useState(null);
  const [especilidades, setEspecilidades] = useState(null);
  const [ventanaHoraria, setVentanaHoraria] = useState(null);
  const [tipoDocumentos, setTipoDocumentos] = useState(null);
  const [tipoAtencion, setTipoAtencion] = useState(null);

  const [selectedHorarios, setSelectedHorarios] = useState([]);

  const doctorService = new DoctorService();
  const reqAppointmentService = new RequestAppointmentService();

  useEffect(() => {
    doctorService.getAllDoctors()
      .then(res => setDoctors(res.data))
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
    reqAppointmentService.getComboData()
      .then(({ data }) => {
        setTipoDocumentos(data.tipoDocumento);
        setTipoAtencion(data.atencionData);
      });
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className='wrapper'>
      <DoctorTable
        toast = {toast}
        emptyDoctor = {emptyDoctor}
        setDoctorDialog = {setDoctorDialog}
        setDoctor = {setDoctor}
        doctor = {doctor}
        doctors = {doctors}
        setDoctors = {setDoctors}
        setMode = {setMode}
        setSubmitted = {setSubmitted}
        setSelectedHorarios = {setSelectedHorarios}
      />
      <DoctorForm
        toast = {toast}
        emptyDoctor = {emptyDoctor}
        doctorDialog = {doctorDialog}
        setDoctorDialog = {setDoctorDialog}

        doctor = {doctor}
        setDoctor = {setDoctor}
        doctors = {doctors}
        setDoctors = {setDoctors}

        submitted = {submitted}
        setSubmitted = {setSubmitted}
        mode = {mode}
        especilidades = {especilidades}
        ventanaHoraria = {ventanaHoraria}
        tipoDocumentos = {tipoDocumentos}
        tipoAtencion = {tipoAtencion}
        selectedHorarios = {selectedHorarios}
        setSelectedHorarios = {setSelectedHorarios}
      />
    </div>
  )
}

export default Doctor;
