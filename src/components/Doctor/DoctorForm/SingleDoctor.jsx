import React, { useState } from 'react';
import { classNames } from 'primereact/utils';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';

import './DoctorForm.css';
import { Divider } from 'primereact/divider';

import { Dropdown } from 'primereact/dropdown';
import { DoctorService } from '../../../services/Doctor/DoctorService';
import { dateToISOString } from '../../../utils/parser';

function SingleDoctor({ 
  toast, 

  doctor = {}, 
  setDoctor, 

  especilidades = [],
  ventanaHoraria = [],
  tipoDocumentos = [],
  selectedHorarios,
  setSelectedHorarios,
}) {
  const [date, setDate] = useState(new Date());

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _doctor = {...doctor};
    _doctor[`${name}`] = val;

    setDoctor(_doctor);
  }

  const onDateChange = async (e, name) => {
    const values = e.value;
    let _doctor = { ...doctor };
    _doctor[`${name}`] = values;

    setDoctor(_doctor);

    const doctorService = new DoctorService();
    const { error, data } = await doctorService.getVentanaHorariaByDate({ fecha_reserva: dateToISOString(), cod_doctor: doctor.cod_doctor });
    if (error) {
      toast.current.show({ severity: 'error', summary: 'Error getting availability', detail: 'Availability failed', life: 3000 });
    }
    setSelectedHorarios((data || []).map(d => d.value));
    setDate(values);
  }

  return (
    <Dialog visible={true} style={{ width: '650px'}} header='Doctor' modal={false} className='p-fluid' closable={false} >
      <div className='div-form-table'>
          <Divider align="left">
            <div className="inline-flex align-items-center">
                <b>Doctor</b>
            </div>
          </Divider>
          <div className='group-form-register-doctor'>
            <div className='nombre field'>
              <label htmlFor='nombres'>Nombre</label>
              <InputText id='nombres' value={doctor.nombres || ''} onChange={(e) => onInputChange(e, 'nombres')} required className={classNames({ 'p-invalid': false })} disabled/>
            </div>
            <div className='apepat field'>
              <label htmlFor='apePat'>Apellido Paterno</label>
              <InputText id='apePat' value={doctor.ape_paterno || ''} onChange={(e) => onInputChange(e, 'ape_paterno')} required className={classNames({ 'p-invalid': false })} disabled />
            </div>
            <div className='apemat field'>
              <label htmlFor='apePat'>Apellido Materno</label>
              <InputText id='apePat' value={doctor.ape_materno || ''} onChange={(e) => onInputChange(e, 'ape_materno')} required className={classNames({ 'p-invalid': false })} disabled />
            </div>
            <div className='ndoc field'>
              <label htmlFor='num_documento'>{ doctor.desc_corta || 'DNI' }</label>
              <InputText id='num_documento' value={doctor.num_documento || ''} onChange={(e) => onInputChange(e, 'num_documento')} required className={classNames({ 'p-invalid': false })} disabled />
            </div>
            <div className='username field'>
              <label htmlFor='username'>Username</label>
              <InputText id='username' value={doctor.username || ''} onChange={(e) => onInputChange(e, 'username')} required className={classNames({ 'p-invalid': false })} disabled />
            </div>
            <div className='tipodoc field'>
              <label htmlFor='cod_tipo_doc'>Tipo Documento</label>
              <Dropdown optionLabel='label' optionValue='value' value={doctor.cod_tipo_doc} options={tipoDocumentos} onChange={(e) => onInputChange(e, 'cod_tipo_doc')} placeholder='Selecciona un documento' disabled />
            </div>
            <div className='especialidad field'>
              <label htmlFor='cod_especialidad'>Especialidad</label>
              <Dropdown optionLabel='label' optionValue='value' value={doctor.cod_especialidad} options={especilidades} onChange={(e) => onInputChange(e, 'cod_especialidad')} placeholder='Selecciona una especialidad' disabled />
            </div>
            <div className='tatencion field'>
              <label htmlFor='cod_tipo_atencion'>Tipo Atencion</label>
              <Dropdown optionLabel='label' optionValue='value' value={doctor.cod_tipo_atencion} options={especilidades} onChange={(e) => onInputChange(e, 'cod_tipo_atencion')} placeholder='Selecciona una atencion' disabled />
            </div>
          </div>
          <Divider align="left">
            <div className="inline-flex align-items-center">
              <b>Disponibilidad</b>
            </div>
          </Divider>
          <div className='group-form-availability-doctor-single'>
            <div className='fecdispo field'>
              <label htmlFor='cod_vent_horaria'>Fecha</label>
              <Calendar dateFormat='dd/mm/yy' id='fecha_programacion' value={date} onChange={(e) => onDateChange(e, 'fecha_reserva')} showIcon />
            </div>
            <div className='venhor field'>
              <label htmlFor='cod_vent_horaria'>Horario</label>
              <MultiSelect optionLabel='label' optionValue='value' value={selectedHorarios} options={ventanaHoraria} placeholder='Selecciona un horario' disabled />
            </div>
          </div>
      </div>
    </Dialog>
  )
}

export default SingleDoctor;
