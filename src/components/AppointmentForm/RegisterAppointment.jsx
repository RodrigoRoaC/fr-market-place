import React, { useContext, useState } from 'react';
import { classNames } from 'primereact/utils';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { AutoComplete } from 'primereact/autocomplete';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';

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
    <Dialog visible={appointmentDialog} style={{ width: '950px'}} header='Registrar solicitud' modal className='p-fluid' footer={appointmentDialogFooter} onHide={hideDialog}>
      <div className='div-form-table'>
        <Divider align="left">
            <div className="inline-flex align-items-center">
                <b>Paciente</b>
            </div>
        </Divider>
          <div className='group-form-contac'>
            <div className='nombre field'>
              <label htmlFor='nombres'>Nombre</label>
              <InputText id='nombres' value={appointment.nombres} onChange={(e) => onInputChange(e, 'nombres')} required autoFocus className={classNames({ 'p-invalid': submitted && !appointment.nombres })} />
              {submitted && !appointment.nombres && <small className='p-error'>Nombre es requerido.</small>}
            </div>
            <div className='apepat field'>
              <label htmlFor='apePat'>Apellido Paterno</label>
              <InputText id='apePat' value={appointment.ape_paterno} onChange={(e) => onInputChange(e, 'ape_paterno')} required autoFocus className={classNames({ 'p-invalid': submitted && !appointment.ape_paterno })} />
              {submitted && !appointment.ape_paterno && <small className='p-error'>Apellido Paterno es requerido.</small>}
            </div>
            <div className='apemat field'>
              <label htmlFor='apeMat'>Apellido Materno</label>
              <InputText id='apeMat' value={appointment.ape_materno} onChange={(e) => onInputChange(e, 'ape_materno')} required autoFocus className={classNames({ 'p-invalid': submitted && !appointment.ape_materno })} />
              {submitted && !appointment.ape_materno && <small className='p-error'>Apellido Materno es requerido.</small>}
            </div>
            <div className='fnac field'>
              <label htmlFor='fecNac'>Fecha Nacimiento</label>
              <Calendar dateFormat='dd/mm/yy' id='fecNac' value={appointment.fec_nacimiento} onChange={(e) => onInputChange(e, 'fec_nacimiento')} required autoFocus className={classNames({ 'p-invalid': submitted && !appointment.fec_nacimiento })} showIcon />
              {submitted && !appointment.fec_nacimiento && <small className='p-error'>Fecha de Nacimiento es requerido.</small>}
            </div>
            <div className='depa field'>
              <label htmlFor='departamento'>Departamento</label>
              <AutoComplete dropdown forceSelection field='label' value={selectedDep || getSelectedDep()} suggestions={filteredDep} completeMethod={searchDep} onChange={(e) => onDropDownChange(e, 'departamento')} aria-label='Departamentos'/>
            </div>
            <div className='prov field'>
              <label htmlFor='provincia'>Provincia</label>
              <Dropdown optionLabel='label' optionValue='value' value={appointment.provincia} options={tipoAtencionData} onChange={(e) => onInputChange(e, 'provincia')} placeholder='Selecciona una provincia'/>
            </div>
            <div className='dist field'>
              <label htmlFor='distrito'>Distrito</label>
              <Dropdown optionLabel='label' optionValue='value' value={appointment.distrito} options={tipoAtencionData} onChange={(e) => onInputChange(e, 'distrito')} placeholder='Selecciona un distrito'/>
            </div>
            <div className='tdoc field'>
              <label htmlFor='cod_tipo_doc'>Tipo Documento</label>
              <Dropdown optionLabel='label' optionValue='value' value={appointment.cod_tipo_doc} options={tipoDocumento} onChange={(e) => onInputChange(e, 'cod_tipo_doc')} placeholder='Seleccionar'/>
            </div>
            <div className='ndoc field'>
              <label htmlFor='num_documento'>N° Documento</label>
              <InputText id='num_documento' value={appointment.num_documento} onChange={(e) => onInputChange(e, 'num_documento')} required autoFocus className={classNames({ 'p-invalid': submitted && !appointment.num_documento })} />
              {submitted && !appointment.num_documento && <small className='p-error'>Documento es requerido.</small>}
            </div>
            <div className='email field'>
              <label htmlFor='email'>Email</label>
              <InputText id='email' value={appointment.email} onChange={(e) => onInputChange(e, 'email')} required autoFocus className={classNames({ 'p-invalid': submitted && !appointment.email })} />
              {submitted && !appointment.email && <small className='p-error'>Email es requerido.</small>}
            </div>
            <div className='direc field'>
              <label htmlFor='direccion'>Dirección</label>
              <InputText id='direccion' value={appointment.direccion} onChange={(e) => onInputChange(e, 'direccion')} required autoFocus className={classNames({ 'p-invalid': submitted && !appointment.direccion })} />
              {submitted && !appointment.direccion && <small className='p-error'>Direccion es requerido.</small>}
            </div>
            <div className='tel1 field'>
              <label htmlFor='telefono1'>Telefono 1</label>
              <InputText id='telefono1' value={appointment.telefono1} onChange={(e) => onInputChange(e, 'telefono1')} required autoFocus className={classNames({ 'p-invalid': submitted && !appointment.telefono1 })} />
              {submitted && !appointment.telefono1 && <small className='p-error'>Telefono 1 es requerido.</small>}
            </div>
            <div className='tel2 field'>
              <label htmlFor='telefono2'>Telefono 2</label>
              <InputText id='telefono2' value={appointment.telefono2} onChange={(e) => onInputChange(e, 'telefono2')} required autoFocus className={classNames({ 'p-invalid': submitted && !appointment.telefono2 })} />
              {submitted && !appointment.telefono2 && <small className='p-error'>Telefono 2 es requerido.</small>}
            </div>
          </div>

        <Divider align="left">
            <div className="inline-flex align-items-center">
                <b>Servicio</b>
            </div>
        </Divider>
          <div className='group-form-serv'>
            <div className='tplan field'>
              <label htmlFor='cod_plan'>Tipo Plan</label>
              <Dropdown optionLabel='label' optionValue='value' value={appointment.cod_plan} options={tipoPlan} onChange={(e) => onInputChange(e, 'cod_plan')} placeholder='Selecciona un plan'/>
            </div>
            <div className='tprograma field'>
              <label htmlFor='cod_iafa'>Tipo Programa</label>
              <Dropdown optionLabel='label' optionValue='value' value={appointment.cod_iafa} options={tipoPrograma} onChange={(e) => onInputChange(e, 'cod_iafa')} placeholder='Selecciona un programa'/>
            </div>
            <div className='tatencion field'>
              <label htmlFor='cod_tipo_atencion'>Tipo Atencion</label>
              <Dropdown optionLabel='label' optionValue='value' value={appointment.cod_tipo_atencion} options={tipoAtencion} onChange={(e) => onInputChange(e, 'cod_tipo_atencion')} placeholder='Selecciona una atencion'/>
            </div>
            <div className='tservicio field'>
              <label htmlFor='cod_tipo_servicio'>Tipo Servicio</label>
              <Dropdown optionLabel='label' optionValue='value' value={appointment.cod_tipo_servicio} options={tipoServicio} onChange={(e) => onInputChange(e, 'cod_tipo_servicio')} placeholder='Selecciona un servicio'/>
            </div>
            <div className='modalidad field'>
              <label htmlFor='cod_modalidad'>Modalidad Servicio</label>
              <Dropdown optionLabel='label' optionValue='value' value={appointment.cod_modalidad} options={tipoModalidad} onChange={(e) => onInputChange(e, 'cod_modalidad')} placeholder='Selecciona una modalidad'/>
            </div>
            <div className='nauto field'>
              <label htmlFor='numero_autorizacion'>N° Autorizacion</label>
              <InputText id='numero_autorizacion' value={appointment.numero_autorizacion} onChange={(e) => onInputChange(e, 'numero_autorizacion')} required autoFocus className={classNames({ 'p-invalid': submitted && !appointment.numero_autorizacion })} />
              {submitted && !appointment.numero_autorizacion && <small className='p-error'>Numero autorizacion es requerido.</small>}
            </div>
          </div>

          <Divider align="left">
            <div className="inline-flex align-items-center">
                <b>Cita</b>
            </div>
        </Divider>
          <div className='group-form-cita'>
            <div className='fecprog field'>
              <label htmlFor='fecha_programacion'>Fecha Programacion</label>
              <Calendar dateFormat='dd/mm/yy' id='fecha_programacion' value={appointment.fecha_programacion} onChange={(e) => onInputChange(e, 'fecha_programacion')} showIcon />
            </div>
            <div className='horaprog field'>
              <label htmlFor='hora_programacion'>Hora Programacion</label>
              <Calendar timeOnly showTime hourFormat="12" id='hora_programacion' value={appointment.hora_programacion} onChange={(e) => onInputChange(e, 'hora_programacion')}></Calendar>
            </div>
            <div className='fecauto field'>
              <label htmlFor='fecha_autorizacion'>Fecha Autorizacion</label>
              <Calendar dateFormat='dd/mm/yy' id='fecha_autorizacion' value={appointment.fecha_autorizacion} onChange={(e) => onInputChange(e, 'fecha_autorizacion')} showIcon />
            </div>
            <div className='sintomas field'>
              <label htmlFor='sintomas'>Sintomas</label>
              <InputTextarea id='sintomas' value={appointment.sintomas} onChange={(e) => onInputChange(e, 'sintomas')} required rows={3} cols={20} />
            </div>
            <div className='diagnostico field'>
                <label htmlFor='diagnostico'>Diagnostico</label>
                <InputTextarea id='diagnostico' value={appointment.diagnostico} onChange={(e) => onInputChange(e, 'diagnostico')} required rows={3} cols={20} />
              </div>
          </div>
      </div>
    </Dialog>
  )
}

export default RegisterAppointmentForm;
