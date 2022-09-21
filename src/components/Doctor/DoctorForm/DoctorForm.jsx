import React, { useContext, useState } from 'react';
import { classNames } from 'primereact/utils';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

import './DoctorForm.css';
import { Divider } from 'primereact/divider';

import { Dropdown } from 'primereact/dropdown';
import { DoctorService } from '../../../services/Doctor/DoctorService';
import { dateToISOString, parseDoctors } from '../../../utils/parser';
import { UserContext } from '../../../context/UserContext';

function DoctorForm({ 
  toast, 
  emptyDoctor, 
  doctorDialog, 
  setDoctorDialog, 

  doctor = {}, 
  setDoctor, 
  doctors = [],
  setDoctors, 

  submitted,
  setSubmitted,
  mode,
  especilidades = [],
  ventanaHoraria = [],
  tipoDocumentos = [],
  tipoAtencion = [],
  selectedHorarios,
  setSelectedHorarios,
}) {
  const { user } = useContext(UserContext);

  const [selectedDates, setSelectedDates] = useState([]);
  const [date, setDate] = useState(new Date());

  const hideDialog = () => {
    setSubmitted(false);
    setSelectedHorarios([]);
    setSelectedDates([]);
    setDate(new Date());
    setDoctor(emptyDoctor);
    setDoctorDialog(false);
  }

  const findIndexById = (cod_pago) => {
    let index = -1;
    for (let i = 0; i < doctors.length; i++) {
      if (doctors[i].cod_pago === cod_pago) {
        index = i;
        break;
      }
    }

    return index;
  }

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _doctor = {...doctor};
    _doctor[`${name}`] = val;

    setDoctor(_doctor);
  }

  const saveDoctor = async () => {
    const doctorService = new DoctorService();
    setSubmitted(true);
    let _doctors = [...doctors];

    if (mode !== 'CREATE') {
      const index = findIndexById(doctor.cod_doctor);
      const updateRes = await doctorService.update({ ...doctor, cod_resp: user.cod_usuario });
      if (updateRes.error) {
        toast.current.show({ severity: 'error', summary: 'Doctor Edit error', detail: 'Edit failed', life: 3000 });
        return;
      }
      _doctors[index] = { ...(parseDoctors([updateRes.data])[0]) };
      setDoctors(_doctors);
      setDoctor({ ...(parseDoctors([updateRes.data])[0]) });
      setDoctorDialog(false);

      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Doctor Updated', life: 3000 });
      return;
    }
    const registerRes = await doctorService.register({ ...doctor, cod_resp: user.cod_usuario });
    if (registerRes.error) {
      toast.current.show({ severity: 'error', summary: 'Doctor Register error', detail: 'Register failed', life: 3000 });
      return;
    }

    setDoctors([...(parseDoctors([registerRes.data])), ...doctors]);
    setDoctor(emptyDoctor);
    setDoctorDialog(false);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Doctor Created', life: 3000 });
  }

  const onMultiChange = (e, name) => {
    const values = e.value;
    let _doctor = { ...doctor };
    _doctor[`${name}`] = values;

    setDoctor(_doctor);
    setSelectedHorarios(values);
  }

  const onDateChange = async (e, name) => {
    const values = e.value;
    let _doctor = { ...doctor };
    _doctor[`${name}`] = values;

    setDoctor(_doctor);

    const doctorService = new DoctorService();
    const { error, data } = await doctorService.getVentanaHorariaByDate(
      { fecha_reserva: dateToISOString(_doctor.fecha_reserva || null), cod_doctor: doctor.cod_doctor }
    );
    if (error) {
      // toast.current.show({ severity: 'error', summary: 'Error getting availability', detail: 'Availability failed', life: 3000 });
      // return;
    }
    setSelectedHorarios((data || []).map(d => d.value));

    if (mode === 'CREATE') {
      setSelectedDates(values);
      return;
    }

    setDate(values);
  }

  const doctorDialogFooter = (
    <React.Fragment>
      <Button label='Cancelar' icon='pi pi-times' className='p-button-text' onClick={hideDialog} />
      <Button label='Completar Datos' icon='pi pi-check' className='p-button-text' onClick={saveDoctor} />
    </React.Fragment>
  );

  return (
    <Dialog visible={doctorDialog} style={{ width: '650px'}} header={mode === 'CREATE' ? 'Registrar doctor' : 'Editar doctor'} modal className='p-fluid' footer={doctorDialogFooter} onHide={hideDialog}>
      <div className='div-form-table'>
          <Divider align="left">
            <div className="inline-flex align-items-center">
                <b>Doctor</b>
            </div>
          </Divider>
          <div className='group-form-register-doctor'>
            <div className='nombre field'>
              <label htmlFor='nombres'>Nombre</label>
              <InputText id='nombres' value={doctor.nombres || ''} onChange={(e) => onInputChange(e, 'nombres')} required autoFocus className={classNames({ 'p-invalid': submitted && !doctor.nombres })} />
              {submitted && !doctor.nombres && <small className='p-error'>Nombre es requerido.</small>}
            </div>
            <div className='apepat field'>
              <label htmlFor='apePat'>Apellido Paterno</label>
              <InputText id='apePat' value={doctor.ape_paterno || ''} onChange={(e) => onInputChange(e, 'ape_paterno')} required className={classNames({ 'p-invalid': submitted && !doctor.ape_paterno })} />
              {submitted && !doctor.ape_paterno && <small className='p-error'>Apellido Paterno es requerido.</small>}
            </div>
            <div className='apemat field'>
              <label htmlFor='apePat'>Apellido Materno</label>
              <InputText id='apePat' value={doctor.ape_materno || ''} onChange={(e) => onInputChange(e, 'ape_materno')} required className={classNames({ 'p-invalid': submitted && !doctor.ape_materno })} />
              {submitted && !doctor.ape_materno && <small className='p-error'>Apellido Materno es requerido.</small>}
            </div>
            <div className='ndoc field'>
              <label htmlFor='num_documento'>{ doctor.desc_corta || 'DNI' }</label>
              <InputText id='num_documento' value={doctor.num_documento || ''} onChange={(e) => onInputChange(e, 'num_documento')} required className={classNames({ 'p-invalid': submitted && !doctor.num_documento })} />
              {submitted && !doctor.num_documento && <small className='p-error'>Documento es requerido.</small>}
            </div>
            <div className='username field'>
              <label htmlFor='username'>Username</label>
              <InputText id='username' value={doctor.username || ''} onChange={(e) => onInputChange(e, 'username')} required className={classNames({ 'p-invalid': submitted && !doctor.username })} />
              {submitted && !doctor.username && <small className='p-error'>Username es requerido.</small>}
            </div>
            <div className='tipodoc field'>
              <label htmlFor='cod_tipo_doc'>Tipo Documento</label>
              <Dropdown optionLabel='label' optionValue='value' value={doctor.cod_tipo_doc} options={tipoDocumentos} onChange={(e) => onInputChange(e, 'cod_tipo_doc')} placeholder='Selecciona un documento'/>
            </div>
            <div className='especialidad field'>
              <label htmlFor='cod_especialidad'>Especialidad</label>
              <Dropdown optionLabel='label' optionValue='value' value={doctor.cod_especialidad} options={especilidades} onChange={(e) => onInputChange(e, 'cod_especialidad')} placeholder='Selecciona una especialidad'/>
            </div>
            <div className='tatencion field'>
              <label htmlFor='cod_tipo_atencion'>Tipo Atencion</label>
              <Dropdown optionLabel='label' optionValue='value' value={doctor.cod_tipo_atencion} options={tipoAtencion} onChange={(e) => onInputChange(e, 'cod_tipo_atencion')} placeholder='Selecciona una atencion'/>
            </div>
          </div>
          <Divider align="left">
            <div className="inline-flex align-items-center">
              <b>Disponibilidad</b>
            </div>
          </Divider>
          <div className='group-form-availability-doctor'>
            <div className='fecdispo field'>
              <label htmlFor='cod_vent_horaria'>{mode === 'CREATE' ? 'Rango de fechas' : 'Fecha'}</label>
              {
                mode === 'CREATE'
                ? (<Calendar dateFormat='dd/mm/yy' id='fecha_programacion' value={selectedDates} onChange={(e) => onDateChange(e, 'range_dates')} selectionMode="range" readOnlyInput showIcon disabledDays={[0]} />)
                : (<Calendar dateFormat='dd/mm/yy' id='fecha_programacion' value={date} onChange={(e) => onDateChange(e, 'fecha_reserva')} showIcon disabledDays={[0]} />)
              }
            </div>
            <div className='venhor field'>
              <label htmlFor='cod_vent_horaria'>Horario</label>
              <MultiSelect optionLabel='label' optionValue='value' value={selectedHorarios} options={ventanaHoraria} onChange={(e) => onMultiChange(e, 'range_time')} placeholder='Selecciona un horario' maxSelectedLabels={3}/>
            </div>
          </div>
      </div>
    </Dialog>
  )
}

export default DoctorForm;
