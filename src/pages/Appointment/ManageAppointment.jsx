import React, { useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import FirstStep from '../../components/Appointment/RequestSteps/FirstStep';
import FourthStep from '../../components/Appointment/RequestSteps/FourthStep';
import SecondStep from '../../components/Appointment/RequestSteps/SecondStep';
import ThirdStep from '../../components/Appointment/RequestSteps/ThirdStep';
import Stepper from '../../components/Stepper/Stepper';
import { fields, steps } from '../../data/appointment-flow';
import { RequestAppointmentService } from '../../services/RequestAppointmentService';
import './ManageAppointment.css';

const ManageAppointment = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const toast = useRef(null);
  const [form, setForm] = useState({...fields});
  
  const [departamentos, setDepartamentos] = useState([]);
  const [tipoAtencion, setTipoAtencion] = useState([]);
  const [tipoModalidad, setTipoModalidad] = useState([]);

  useEffect(() => {
    const reqAppointmentService = new RequestAppointmentService();
    reqAppointmentService.getComboData()
      .then(({ data }) => {
        const _filterAtentionData = data.atencionData.filter(ad => [2, 3].includes(ad.value));
        setDepartamentos(data.departamento);
        setTipoAtencion(_filterAtentionData);
        setTipoModalidad(data.modalidadData);
      });
  }, []);

  return (
    <div className='step-wrapper'>
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
        tipoAtencion = {tipoAtencion}
        tipoModalidad = {tipoModalidad}
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
