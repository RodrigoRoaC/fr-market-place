import React, { useEffect, useRef, useState } from 'react'
import DoctorTable from '../../components/Doctor/DoctorTable/DoctorTable'
import emptyDoctor from '../../data/doctor';
import { DoctorService } from '../../services/Doctor/DoctorService';

const Doctor = () => {
  const toast = useRef(null);
  const [mode, setMode] = useState('CREATE');
  const [submitted, setSubmitted] = useState(false);
  const [doctorDialog, setDoctorDialog] = useState(false);
  const [doctor, setDoctor] = useState({ ...emptyDoctor });  

  const [doctors, setDoctors] = useState(null);    

  const doctorService = new DoctorService();

  useEffect(() => {
    doctorService.getAllDoctors()
      .then(res => setDoctors(res.data))
      .catch(err => {
        console.error(err);
      });
  })

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

        submitted = {submitted}
        mode = {mode}
        doctorDialog = {doctorDialog}
      />
    </div>
  )
}

export default Doctor;
