import React, { useContext, useState } from 'react';
import { classNames } from 'primereact/utils';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { AutoComplete } from 'primereact/autocomplete';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

import './RegisterAppointment.css';
import { AppointmentService } from '../../services/AppointmentService';
import { UserContext } from '../../context/UserContext';

function RegisterAppointmentForm({ 
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
  departamento = [],
  tipoPlan = [],
  tipoPrograma = [],
  tipoAtencion = [],
  tipoModalidad = [],
  tipoServicio = [],
}) {
  const { user } = useContext(UserContext);
  const [filteredDep, setFilteredDep] = useState(null);
  const [selectedDep, setSelectedDep] = useState(null);

  const tipoAtencionData = [
    {
      value: 1,
      label: 'TBD'
    },
    {
      value: 2,
      label: 'TBD'
    },
  ];

  const hideDialog = () => {
    setSelectedDep(null);
    setSubmitted(false);
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

  const getSelectedDep = () => {
    const sd = departamento?.find(d => d.value === appointment.departamento);

    return sd || { label: '', value: '' };
  }

  const searchDep = (event) => {
    setTimeout(() => {
      let _filteredDep;
      if (!event.query.trim().length) {
        _filteredDep = [...departamento];
      }
      else {
        _filteredDep = filteredDep.filter((dep) => {
          console.log('SEARCH', dep);
          return dep.label.toLowerCase().startsWith(event.query.toLowerCase());
        });
      }

      setFilteredDep(_filteredDep);
    }, 250);
  }

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _appointment = {...appointment};
    _appointment[`${name}`] = val;

    setAppointment(_appointment);
  }

  const onDropDownChange = (e, name) => {
    if (e.value?.value) {
      let _appointment = {...appointment};
      _appointment[`${name}`] = e.value?.value;
      setAppointment(_appointment);
      setSelectedDep(e.value);
    }
  }

  const saveAppointment = async () => {
    const appointmentService = new AppointmentService();
    setSubmitted(true);
    let _appointments = [...appointments];
    console.log(appointment);
    if (appointment.cod_solicitud) {
      const index = findIndexById(appointment.cod_solicitud);
      const updateRes = await appointmentService.update({ ...appointment, cod_usuario: user.cod_usuario });
      if (updateRes.error) {
        toast.current.show({ severity: 'error', summary: 'Appoinment Edit error', detail: 'Edit failed', life: 3000 });
        return;
      }
      _appointments[index] = updateRes.data;
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Appointment Updated', life: 3000 });

      setAppointments(_appointments);
      setAppointmentDialog(false);
      setAppointment(emptyAppointment);
      return;
    }
    const registerRes = await appointmentService.register({ ...appointment, cod_usuario: user.cod_usuario });
    if (registerRes.error) {
      toast.current.show({ severity: 'error', summary: 'Appoinment Register error', detail: 'Register failed', life: 3000 });
      return;
    }
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Appointment Created', life: 3000 });
    setAppointments([registerRes.data, ...appointments]);
    setAppointmentDialog(false);
    setAppointment(emptyAppointment);
  }

  const appointmentDialogFooter = (
    <React.Fragment>
      <Button label='Cancelar' icon='pi pi-times' className='p-button-text' onClick={hideDialog} />
      <Button label='Completar Datos' icon='pi pi-check' className='p-button-text' onClick={saveAppointment} />
    </React.Fragment>
  );

  return (
    <Dialog visible={appointmentDialog} style={{ width: '950px' }} header='Registrar solicitud' modal className='p-fluid' footer={appointmentDialogFooter} onHide={hideDialog}>
      <div className='div-form-table'>
        <h4>Contacto</h4>
          <div className='group-form-table'>
            <div className='field'>
              <label htmlFor='nombre'>Nombre</label>
              <InputText id='nombres' value={appointment.nombres} onChange={(e) => onInputChange(e, 'nombres')} required autoFocus className={classNames({ 'p-invalid': submitted && !appointment.nombres })} />
              {submitted && !appointment.nombres && <small className='p-error'>Nombre es requerido.</small>}
            </div>
            <div className='field'>
              <label htmlFor='apellido'>Apellido</label>
              <InputText id='apellido' value={appointment.ape_paterno} onChange={(e) => onInputChange(e, 'ape_paterno')} required autoFocus className={classNames({ 'p-invalid': submitted && !appointment.ape_paterno })} />
              {submitted && !appointment.ape_paterno && <small className='p-error'>Apellido es requerido.</small>}
            </div>
            <div className='field'>
              <label htmlFor='edad'>Edad</label>
              <InputText id='edad' value={appointment.edad} onChange={(e) => onInputChange(e, 'edad')} required autoFocus className={classNames({ 'p-invalid': submitted && !appointment.edad })} />
              {submitted && !appointment.edad && <small className='p-error'>Age es requerido.</small>}
            </div>
          </div>
          <div className='group-form-table'>
            <div className='field'>
            <label htmlFor='departamento'>Departamento</label>
              <AutoComplete dropdown forceSelection field='label' value={selectedDep || getSelectedDep()} suggestions={filteredDep} completeMethod={searchDep} onChange={(e) => onDropDownChange(e, 'departamento')} aria-label='Departamentos'/>
            </div>
            <div className='field'>
              <label htmlFor='provincia'>Provincia</label>
              <Dropdown optionLabel='label' optionValue='value' value={appointment.provincia} options={tipoAtencionData} onChange={(e) => onInputChange(e, 'provincia')} placeholder='Selecciona una provincia'/>
            </div>
            <div className='field'>
              <label htmlFor='distrito'>Distrito</label>
              <Dropdown optionLabel='label' optionValue='value' value={appointment.distrito} options={tipoAtencionData} onChange={(e) => onInputChange(e, 'distrito')} placeholder='Selecciona un distrito'/>
            </div>
          </div>
          <div className='group-form-table'>
            <div className='field'>
              <label htmlFor='cod_tipo_doc'>Tipo Documento</label>
              <Dropdown optionLabel='label' optionValue='value' value={appointment.cod_tipo_doc} options={tipoDocumento} onChange={(e) => onInputChange(e, 'cod_tipo_doc')} placeholder='Selecciona una documento'/>
            </div>
            <div className='field'>
              <label htmlFor='num_documento'>N° Documento</label>
              <InputText id='num_documento' value={appointment.num_documento} onChange={(e) => onInputChange(e, 'num_documento')} required autoFocus className={classNames({ 'p-invalid': submitted && !appointment.num_documento })} />
              {submitted && !appointment.num_documento && <small className='p-error'>Documento es requerido.</small>}
            </div>
            <div className='field'>
              <label htmlFor='email'>Email</label>
              <InputText id='email' value={appointment.email} onChange={(e) => onInputChange(e, 'email')} required autoFocus className={classNames({ 'p-invalid': submitted && !appointment.email })} />
              {submitted && !appointment.email && <small className='p-error'>Email es requerido.</small>}
            </div>
          </div>
          <div className='group-form-table'>
            <div className='field'>
              <label htmlFor='direccion'>Dirección</label>
              <InputText id='direccion' value={appointment.direccion} onChange={(e) => onInputChange(e, 'direccion')} required autoFocus className={classNames({ 'p-invalid': submitted && !appointment.direccion })} />
              {submitted && !appointment.direccion && <small className='p-error'>Direccion es requerido.</small>}
            </div>
            <div className='field'>
              <label htmlFor='telefono'>Telefono</label>
              <InputText id='telefono' value={appointment.telefono1} onChange={(e) => onInputChange(e, 'telefono1')} required autoFocus className={classNames({ 'p-invalid': submitted && !appointment.telefono1 })} />
              {submitted && !appointment.telefono1 && <small className='p-error'>Telefono es requerido.</small>}
            </div>
          </div>

        <h4>Servicio</h4>
          <div className='group-form-table'>
            <div className='field'>
              <label htmlFor='cod_plan'>Tipo Plan</label>
              <Dropdown optionLabel='label' optionValue='value' value={appointment.cod_plan} options={tipoPlan} onChange={(e) => onInputChange(e, 'cod_plan')} placeholder='Selecciona un plan'/>
            </div>
            <div className='field'>
              <label htmlFor='cod_iafa'>Tipo Programa</label>
              <Dropdown optionLabel='label' optionValue='value' value={appointment.cod_iafa} options={tipoPrograma} onChange={(e) => onInputChange(e, 'cod_iafa')} placeholder='Selecciona un programa'/>
            </div>
            <div className='field'>
              <label htmlFor='cod_tipo_atencion'>Tipo Atencion</label>
              <Dropdown optionLabel='label' optionValue='value' value={appointment.cod_tipo_atencion} options={tipoAtencion} onChange={(e) => onInputChange(e, 'cod_tipo_atencion')} placeholder='Selecciona una atencion'/>
            </div>
          </div>
          <div className='group-form-table'>
            <div className='field'>
              <label htmlFor='cod_tipo_servicio'>Tipo Servicio</label>
              <Dropdown optionLabel='label' optionValue='value' value={appointment.cod_tipo_servicio} options={tipoServicio} onChange={(e) => onInputChange(e, 'cod_tipo_servicio')} placeholder='Selecciona un servicio'/>
            </div>
            <div className='field'>
              <label htmlFor='cod_modalidad'>Modalidad Servicio</label>
              <Dropdown optionLabel='label' optionValue='value' value={appointment.cod_modalidad} options={tipoModalidad} onChange={(e) => onInputChange(e, 'cod_modalidad')} placeholder='Selecciona una modalidad'/>
            </div>
            <div className='field'>
              <label htmlFor='numero_autorizacion'>N° Autorizacion</label>
              <InputText id='numero_autorizacion' value={appointment.numero_autorizacion} onChange={(e) => onInputChange(e, 'numero_autorizacion')} required autoFocus className={classNames({ 'p-invalid': submitted && !appointment.numero_autorizacion })} />
              {submitted && !appointment.numero_autorizacion && <small className='p-error'>Numero autorizacion es requerido.</small>}
            </div>
          </div>

        <h4>Cita</h4>
          <div className='group-form-table'>
            <div className='field col-12 md:col-4'>
              <label htmlFor='fecha_programacion'>Fecha Programacion</label>
              <Calendar dateFormat='dd/mm/yy' id='fecha_programacion' value={appointment.fecha_programacion} onChange={(e) => onInputChange(e, 'fecha_programacion')} showIcon />
            </div>
            <div className='field col-12 md:col-4'>
              <label htmlFor='hora_programacion'>Hora Programacion</label>
              <Calendar timeOnly showTime hourFormat="12" id='hora_programacion' value={appointment.hora_programacion} onChange={(e) => onInputChange(e, 'hora_programacion')}></Calendar>
            </div>
            <div className='field col-12 md:col-4'>
              <label htmlFor='fecha_autorizacion'>Fecha Autorizacion</label>
              <Calendar dateFormat='dd/mm/yy' id='fecha_autorizacion' value={appointment.fecha_autorizacion} onChange={(e) => onInputChange(e, 'fecha_autorizacion')} showIcon />
            </div>
          </div>
          <div className='formgrid grid'>
            <div className='field col'>
              <label htmlFor='sintomas'>Sintomas</label>
              <InputTextarea id='sintomas' value={appointment.sintomas} onChange={(e) => onInputChange(e, 'sintomas')} required rows={3} cols={20} />
            </div>
          </div>
          <div className='formgrid grid'>
            <div className='field col'>
              <label htmlFor='diagnostico'>Diagnostico</label>
              <InputTextarea id='diagnostico' value={appointment.diagnostico} onChange={(e) => onInputChange(e, 'diagnostico')} required rows={3} cols={20} />
            </div>
          </div>
      </div>
    </Dialog>
  )
}

export default RegisterAppointmentForm;
