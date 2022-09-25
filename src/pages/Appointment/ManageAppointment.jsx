import React, { useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import FirstStep from '../../components/Appointment/RequestSteps/FirstStep';
import FourthStep from '../../components/Appointment/RequestSteps/FourthStep';
import SecondStep from '../../components/Appointment/RequestSteps/SecondStep';
import ThirdStep from '../../components/Appointment/RequestSteps/ThirdStep';
import Stepper from '../../components/Stepper/Stepper';
import { fields, steps } from '../../data/appointment-flow';
import { RequestAppointmentService } from '../../services/RequestAppointmentService';

const ManageAppointment = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const toast = useRef(null);
  const [form, setForm] = useState({...fields});
  
  const [departamentos, setDepartamentos] = useState(0);

  useEffect(() => {
    const reqAppointmentService = new RequestAppointmentService();
    reqAppointmentService.getComboData()
      .then(({ data }) => setDepartamentos(data.departamento));
  }, [])

  return (
    <div className='wrapper'>
      <Toast ref={toast} />
      <Stepper
        interactive={false}
        items={steps.items}
        activeIndex = {activeIndex}
        setActiveIndex = {setActiveIndex}
      />

      <FirstStep 
        toast = {toast}
        currentStep = {activeIndex}
        setActiveIndex = {setActiveIndex}
        form = {form}
        setForm = {setForm}
      />
      <SecondStep 
        toast = {toast}
        currentStep = {activeIndex}
        setActiveIndex = {setActiveIndex}
        form = {form}
        setForm = {setForm}
      />
      <ThirdStep 
        toast = {toast}
        currentStep = {activeIndex}
        setActiveIndex = {setActiveIndex}
        form = {form}
        setForm = {setForm}
        departamentos = {departamentos}
      />
      <FourthStep 
        toast = {toast}
        currentStep = {activeIndex}
        setActiveIndex = {setActiveIndex}
        form = {form}
        setForm = {setForm}
      />

    </div>
  )
}

export default ManageAppointment;
