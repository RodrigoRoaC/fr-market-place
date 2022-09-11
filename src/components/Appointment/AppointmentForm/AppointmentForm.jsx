import React, { useContext } from 'react';
import { classNames } from 'primereact/utils';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';

import './AppointmentForm.css';
import { UserContext } from '../../../context/UserContext';
import { dateToISOString, parseAppointments } from '../../../utils/parser';
import { validateAppointmentValues } from '../../../utils/validations';
import { DoctorService } from '../../../services/Doctor/DoctorService';
import { AppointmentService } from '../../../services/Appointment/AppointmentService';

function AppointmentForm({ 
  appointmentDialog, 
  setAppointmentDialog, 
  submitted,
  setSubmitted,
  appointment = {}, 
  setAppointment, 
  appointments = [],
  setAppointments, 
  emptyAppointment, 
  toast, 
  tipoDocumento = [],
  tipoEspecialidad = [],
  tipoAtencion = [],

  doctores,
  setDoctores,
  disponibilidad,
  setDisponibilidad,
}) {
  const { user } = useContext(UserContext);

  const hideDialog = () => {
    setSubmitted(false);
    setAppointment(emptyAppointment);
    setAppointmentDialog(false);
  }

  const findIndexById = (cod_solicitud) => {
    let index = -1;
    for (let i = 0; i < appointments.length; i++) {
      if (appointments[i].cod_solicitud === cod_solicitud) {
        index = i;
        break;
      }
    }

    return index;
  }

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _appointment = {...appointment};
    _appointment[`${name}`] = val;

    setAppointment(_appointment);
  }

  const saveAppointment = async () => {
    const reqAppointmentService = new AppointmentService();
    setSubmitted(true);
    let _appointments = [...appointments];
    if (validateAppointmentValues(appointment)) {
      toast.current.show({ severity: 'error', summary: 'Appoinment Error', detail: 'Complete fields', life: 3000 });
      return;
    }
    
    const index = findIndexById(appointment.cod_cita);
    const updateRes = await reqAppointmentService.update({ ...appointment, cod_usuario: user.cod_usuario });
    if (updateRes.error) {
      toast.current.show({ severity: 'error', summary: 'Appoinment Edit error', detail: 'Edit failed', life: 3000 });
      return;
    }
    _appointments[index] = { ...(parseAppointments([updateRes.data])[0]) };
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Appointment Updated', life: 3000 });

    setAppointments(_appointments);
    setAppointment({ ...(parseAppointments([updateRes.data])[0]) });
    setAppointmentDialog(false);
    return;
  }

  const setDoctorData = async (e) => {
    if (!appointment.cod_especialidad || !appointment.cod_tipo_atencion) {
      setDoctores([]);
    }
  }

  const onDateChange = async (e, name) => {
    const values = e.value;
    let _appointment = { ...appointment };
    _appointment[`${name}`] = values;

    setAppointment(_appointment);

    const doctorService = new DoctorService();
    const { error, data } = await doctorService.getVentanaHorariaByDate({ fecha_reserva: dateToISOString(values), cod_doctor: _appointment.cod_doctor });
    if (error) {
      toast.current.show({ severity: 'error', summary: 'Error getting availability', detail: 'Availability failed', life: 3000 });
    }

    setDisponibilidad(data);
  }

  const onDoctorFilterChange = async (e, name) => {
    const values = e.value;
    let _appointment = { ...appointment };
    _appointment[`${name}`] = values;

    if (_appointment.cod_especialidad && _appointment.cod_tipo_atencion) {
      const doctorService = new DoctorService();
      const { error, data } = await doctorService.getComboDoctor(_appointment.cod_especialidad, _appointment.cod_tipo_atencion);
      if (error) {
        toast.current.show({ severity: 'error', summary: 'Error getting availability', detail: 'Availability failed', life: 3000 });
      }

      setDoctores(data);
      setAppointment(_appointment);
      return;
    }

    setAppointment({ ..._appointment, cod_doctor: '' });
    setDoctores([]);
    return;
  }

  const appointmentDialogFooter = (
    <React.Fragment>
      <Button label='Cancelar' icon='pi pi-times' className='p-button-text' onClick={hideDialog} />
      <Button label='Completar Datos' icon='pi pi-check' className='p-button-text' onClick={saveAppointment} />
    </React.Fragment>
  );

  return (
    <Dialog visible={appointmentDialog} style={{ width: '950px'}} header='Editar cita' modal className='p-fluid' footer={appointmentDialogFooter} onHide={hideDialog}>
      <div className='div-form-table'>
        <Divider align="left">
            <div className="inline-flex align-items-center">
                <b>Paciente</b>
            </div>
        </Divider>
          <div className='group-form-paciente-appointment'>
            <div className='nombre field'>
              <label htmlFor='nombres_paciente'>Nombres</label>
              <InputText id='nombres_paciente' value={appointment.nombres_paciente || ''} onChange={(e) => onInputChange(e, 'nombres_paciente')} className={classNames({ 'p-invalid': false })} disabled />
            </div>
            <div className='telefono1 field'>
              <label htmlFor='telefono1'>Telefono</label>
              <InputText id='telefono1' value={appointment.telefono1 || ''} onChange={(e) => onInputChange(e, 'telefono1')} className={classNames({ 'p-invalid': false })} disabled />
            </div>
            <div className='email field'>
              <label htmlFor='email'>Correo</label>
              <InputText id='email' value={appointment.email || ''} onChange={(e) => onInputChange(e, 'email')} className={classNames({ 'p-invalid': false })} disabled />
            </div>
            <div className='tdoc field'>
              <label htmlFor='cod_tipo_doc'>Tipo Documento</label>
              <Dropdown optionLabel='label' optionValue='value' value={appointment.cod_tipo_doc || ''} options={tipoDocumento} onChange={(e) => onInputChange(e, 'cod_tipo_doc')} placeholder='Seleccionar' disabled />
            </div>
            <div className='ndoc field'>
              <label htmlFor='num_documento'>N° Documento</label>
              <InputText id='num_documento' value={appointment.num_documento || ''} onChange={(e) => onInputChange(e, 'num_documento')} required autoFocus className={classNames({ 'p-invalid': false })} disabled />
            </div>

            <div className='sintomas field'>
              <label htmlFor='sintomas'>Sintomas</label>
              <InputTextarea id='sintomas' value={appointment.sintomas || ''} onChange={(e) => onInputChange(e, 'sintomas')} rows={3} cols={20} />
            </div>
            <div className='diagnostico field'>
              <label htmlFor='diagnostico'>Diagnostico</label>
              <InputTextarea id='diagnostico' value={appointment.diagnostico || ''} onChange={(e) => onInputChange(e, 'diagnostico')} rows={3} cols={20} />
            </div>
          </div>

        <Divider align="left">
            <div className="inline-flex align-items-center">
                <b>Doctor</b>
            </div>
        </Divider>
          <div className='group-form-doctor-appointment'>
            <div className='tespecialidad field'>
              <label htmlFor='cod_especialidad'>Especialidad</label>
              <Dropdown optionLabel='label' optionValue='value' value={appointment.cod_especialidad} options={tipoEspecialidad} onChange={(e) => onDoctorFilterChange(e, 'cod_especialidad')} placeholder='Selecciona un plan'/>
            </div>
            <div className='tatencion field'>
              <label htmlFor='cod_tipo_atencion'>Tipo Atencion</label>
              <Dropdown optionLabel='label' optionValue='value' value={appointment.cod_tipo_atencion} options={tipoAtencion} onChange={(e) => onDoctorFilterChange(e, 'cod_tipo_atencion')} placeholder='Selecciona un programa'/>
            </div>
            <div className='doctor field'>
              <label htmlFor='cod_doctor'>Doctor</label>
              <Dropdown optionLabel='label' optionValue='value' value={appointment.cod_doctor} options={doctores} onChange={(e) => onInputChange(e, 'cod_doctor')} placeholder='Selecciona un doctor' onMouseDown={(e) => setDoctorData(e)} />
            </div>
            <div className='fecreserva field'>
              <label htmlFor='fecha_reserva'>Fecha Reserva</label>
              <Calendar dateFormat='dd/mm/yy' id='fecRes' value={appointment.fecha_reserva} onChange={(e) => onDateChange(e, 'fecha_reserva')} required autoFocus className={classNames({ 'p-invalid': submitted && !appointment.fecha_reserva })} showIcon />
            </div>
            <div className='horario field'>
              <label htmlFor='cod_vent_horaria'>Horario</label>
              <Dropdown optionLabel='label' optionValue='value' value={appointment.cod_vent_horaria} options={disponibilidad} onChange={(e) => onInputChange(e, 'cod_vent_horaria')} placeholder='Selecciona un horario' />
            </div>
          </div>

        <Divider align="left">
          <div className="inline-flex align-items-center">
              <b>Cita</b>
          </div>
        </Divider>
          <div className='group-form-appointment'>
            <div className='observaciones field'>
              <label htmlFor='observaciones'>Observaciones</label>
              <InputTextarea id='observaciones' value={appointment.observaciones || ''} onChange={(e) => onInputChange(e, 'observaciones')} required rows={3} cols={20} />
            </div>
          </div>
      </div>
    </Dialog>
  )
}

export default AppointmentForm;
