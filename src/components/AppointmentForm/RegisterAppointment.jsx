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
import { ConfirmDialog , confirmDialog } from 'primereact/confirmdialog';

import './RegisterAppointment.css';
import { AppointmentService } from '../../services/AppointmentService';
import { UserContext } from '../../context/UserContext';
import { parseAppointments } from '../../utils/parser';
import { UbigeoService } from '../../services/Ubigeo/UbigeoService';
import { validateAppointmentValues } from '../../utils/validations';

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
  provincia = [],
  setProvincia,
  distrito = [],
  setDistrito,
  tipoPlan = [],
  tipoPrograma = [],
  tipoAtencion = [],
  tipoModalidad = [],
  tipoServicio = [],
}) {
  const { user } = useContext(UserContext);

  const [filteredDep, setFilteredDep] = useState(null);
  const [selectedDep, setSelectedDep] = useState(null);

  const [filteredProv, setFilteredProv] = useState(null);
  const [selectedProv, setSelectedProv] = useState(null);

  const [filteredDis, setFilteredDis] = useState(null);
  const [selectedDis, setSelectedDis] = useState(null);

  const accept = () => {
    toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
  }

  const reject = () => {
      toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
  }

  const hideDialog = () => {
    setSelectedDep(null);
    setSelectedProv(null);
    setSelectedDis(null);
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

  const getSelectedDep = () => {
    const sd = departamento?.find(d => d.value === appointment.departamento);

    return sd || { label: '', value: '' };
  }

  const getSelectedProv = () => {
    const sd = provincia?.find(d => d.value === appointment.provincia);

    return sd || { label: '', value: '' };
  }

  const getSelectedDis = () => {
    const sd = distrito?.find(d => d.value === appointment.distrito);

    return sd || { label: '', value: '' };
  }

  const searchDep = (event) => {
    setTimeout(() => {
      let _filteredDep;
      if (!event.query.trim().length) {
        _filteredDep = [...departamento];
      }
      else {
        _filteredDep = filteredDep.filter((dep) => dep.label.toLowerCase().startsWith(event.query.toLowerCase()));
      }

      setFilteredDep(_filteredDep);
    }, 250);
  }

  const searchProv = (event) => {
    setTimeout(() => {
      let _filteredDep;
      if (!event.query.trim().length) {
        _filteredDep = [...provincia];
      }
      else {
        _filteredDep = filteredProv.filter((dep) => dep.label.toLowerCase().startsWith(event.query.toLowerCase()));
      }

      setFilteredProv(_filteredDep);
    }, 250);
  }

  const searchDis = (event) => {
    setTimeout(() => {
      let _filteredDep;
      if (!event.query.trim().length) {
        _filteredDep = [...distrito];
      }
      else {
        _filteredDep = filteredDis.filter((dep) => dep.label.toLowerCase().startsWith(event.query.toLowerCase()));
      }

      setFilteredDis(_filteredDep);
    }, 250);
  }

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _appointment = {...appointment};
    _appointment[`${name}`] = val;

    setAppointment(_appointment);
  }

  const setProvinciaData = async (ubigeoDep) => {
    const ubigeoService = new UbigeoService();
    const { error, data } = await ubigeoService.getProvincias(ubigeoDep);
    if (error) {
      toast.current.show({ severity: 'error', summary: 'Provincias list Error', detail: 'Get provincias failed', life: 3000 });
      return;
    }

    setProvincia(data);
  }

  const setDistritoData = async (ubigeoDep, ubigeoProv) => {
    const ubigeoService = new UbigeoService();
    const { error, data } = await ubigeoService.getDistritos(ubigeoDep, ubigeoProv);
    if (error) {
      toast.current.show({ severity: 'error', summary: 'Distritos list Error', detail: 'Get distritos failed', life: 3000 });
      return;
    }

    setDistrito(data);
  }

  const onDropDownChange = (e, name) => {
    if (e.value?.value) {
      let _appointment = {...appointment};
      _appointment[`${name}`] = e.value?.value;
      _appointment[`provincia`] = '';
      _appointment[`distrito`] = '';
      setAppointment(_appointment);
      setSelectedDep(e.value);
      setSelectedProv(null);
      setSelectedDis(null);
      setProvincia([]);
      setDistrito([]);
      setProvinciaData(e.value?.value);
    }
  }

  const onProvDownChange = (e, name) => {
    if (e.value?.value) {
      let _appointment = {...appointment};
      _appointment[`${name}`] = e.value?.value;
      _appointment[`distrito`] = '';
      setAppointment(_appointment);
      setSelectedProv(e.value);
      setSelectedDis(null);
      setDistrito([]);
      setDistritoData(appointment.departamento, e.value?.value);
    }
  }

  const onDisDownChange = (e, name) => {
    if (e.value?.value) {
      let _appointment = {...appointment};
      _appointment[`${name}`] = e.value?.value;
      setAppointment(_appointment);
      setSelectedDis(e.value);
    }
  }

  const saveAppointment = async () => {
    const appointmentService = new AppointmentService();
    setSubmitted(true);
    let _appointments = [...appointments];
    if (validateAppointmentValues(appointment)) {
      toast.current.show({ severity: 'error', summary: 'Appoinment Error', detail: 'Complete fields', life: 3000 });
      return;
    }

    if (appointment.cod_solicitud) {
      const index = findIndexById(appointment.cod_solicitud);
      const updateRes = await appointmentService.update({ ...appointment, cod_usuario: user.cod_usuario });
      if (updateRes.error) {
        toast.current.show({ severity: 'error', summary: 'Appoinment Edit error', detail: 'Edit failed', life: 3000 });
        return;
      }
      _appointments[index] = { ...(parseAppointments([updateRes.data])[0]) };
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Appointment Updated', life: 3000 });

      setAppointments(_appointments);
      setAppointment({ ...(parseAppointments([updateRes.data])[0]) });
      generatePayment();
      return;
    }
    const registerRes = await appointmentService.register({ ...appointment, cod_usuario: user.cod_usuario });
    if (registerRes.error) {
      toast.current.show({ severity: 'error', summary: 'Appoinment Register error', detail: 'Register failed', life: 3000 });
      return;
    }
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Appointment Created', life: 3000 });
    setAppointments([...(parseAppointments(registerRes.data)[0]), ...appointments]);
    setAppointment({ ...parseAppointments(registerRes.data)[0] });
    generatePayment();
  }

  const generatePayment = () => {
    confirmDialog({
      message: '¿Desea generar orden de pago?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      position: 'center',
      accept,
      reject
    });
  }

  const appointmentDialogFooter = (
    <React.Fragment>
      { appointment.descripcion === 'REGISTRADA' && <Button label='Generar Pago' icon='pi pi-wallet' className='p-button-text' onClick={generatePayment} /> }
      <Button label='Cancelar' icon='pi pi-times' className='p-button-text' onClick={hideDialog} />
      <Button label='Completar Datos' icon='pi pi-check' className='p-button-text' onClick={saveAppointment} />
    </React.Fragment>
  );

  return (
    <Dialog visible={appointmentDialog} style={{ width: '950px'}} header='Registrar solicitud' modal className='p-fluid' footer={appointmentDialogFooter} onHide={hideDialog}>
      <ConfirmDialog />
      <div className='div-form-table'>
        <Divider align="left">
            <div className="inline-flex align-items-center">
                <b>Paciente</b>
            </div>
        </Divider>
          <div className='group-form-contac'>
            <div className='nombre field'>
              <label htmlFor='nombres'>Nombre</label>
              <InputText id='nombres' value={appointment.nombres || ''} onChange={(e) => onInputChange(e, 'nombres')} required autoFocus className={classNames({ 'p-invalid': submitted && !appointment.nombres })} />
              {submitted && !appointment.nombres && <small className='p-error'>Nombre es requerido.</small>}
            </div>
            <div className='apepat field'>
              <label htmlFor='apePat'>Apellido Paterno</label>
              <InputText id='apePat' value={appointment.ape_paterno || ''} onChange={(e) => onInputChange(e, 'ape_paterno')} required autoFocus className={classNames({ 'p-invalid': submitted && !appointment.ape_paterno })} />
              {submitted && !appointment.ape_paterno && <small className='p-error'>Apellido Paterno es requerido.</small>}
            </div>
            <div className='apemat field'>
              <label htmlFor='apeMat'>Apellido Materno</label>
              <InputText id='apeMat' value={appointment.ape_materno || ''} onChange={(e) => onInputChange(e, 'ape_materno')} required autoFocus className={classNames({ 'p-invalid': submitted && !appointment.ape_materno })} />
              {submitted && !appointment.ape_materno && <small className='p-error'>Apellido Materno es requerido.</small>}
            </div>
            <div className='fnac field'>
              <label htmlFor='fecNac'>Fecha Nacimiento</label>
              <Calendar dateFormat='dd/mm/yy' id='fecNac' value={appointment.fec_nacimiento || ''} onChange={(e) => onInputChange(e, 'fec_nacimiento')} required autoFocus className={classNames({ 'p-invalid': submitted && !appointment.fec_nacimiento })} showIcon />
              {submitted && !appointment.fec_nacimiento && <small className='p-error'>Fecha de Nacimiento es requerido.</small>}
            </div>
            <div className='depa field'>
              <label htmlFor='departamento'>Departamento</label>
              <AutoComplete dropdown forceSelection field='label' value={selectedDep || getSelectedDep()} suggestions={filteredDep} completeMethod={searchDep} onChange={(e) => onDropDownChange(e, 'departamento')} aria-label='Departamentos'/>
            </div>
            <div className='prov field'>
              <label htmlFor='provincia'>Provincia</label>
              <AutoComplete dropdown forceSelection field='label' value={selectedProv || getSelectedProv()} suggestions={filteredProv} completeMethod={searchProv} onChange={(e) => onProvDownChange(e, 'provincia')} aria-label='Provincias'/>
            </div>
            <div className='dist field'>
              <label htmlFor='distrito'>Distrito</label>
              <AutoComplete dropdown forceSelection field='label' value={selectedDis || getSelectedDis()} suggestions={filteredDis} completeMethod={searchDis} onChange={(e) => onDisDownChange(e, 'distrito')} aria-label='Distritos'/>
            </div>
            <div className='tdoc field'>
              <label htmlFor='cod_tipo_doc'>Tipo Documento</label>
              <Dropdown optionLabel='label' optionValue='value' value={appointment.cod_tipo_doc || ''} options={tipoDocumento} onChange={(e) => onInputChange(e, 'cod_tipo_doc')} placeholder='Seleccionar'/>
            </div>
            <div className='ndoc field'>
              <label htmlFor='num_documento'>N° Documento</label>
              <InputText id='num_documento' value={appointment.num_documento || ''} onChange={(e) => onInputChange(e, 'num_documento')} required autoFocus className={classNames({ 'p-invalid': submitted && !appointment.num_documento })} />
              {submitted && !appointment.num_documento && <small className='p-error'>Documento es requerido.</small>}
            </div>
            <div className='email field'>
              <label htmlFor='email'>Email</label>
              <InputText id='email' value={appointment.email || ''} onChange={(e) => onInputChange(e, 'email')} required autoFocus className={classNames({ 'p-invalid': submitted && !appointment.email })} />
              {submitted && !appointment.email && <small className='p-error'>Email es requerido.</small>}
            </div>
            <div className='direc field'>
              <label htmlFor='direccion'>Dirección</label>
              <InputText id='direccion' value={appointment.direccion || ''} onChange={(e) => onInputChange(e, 'direccion')} required autoFocus className={classNames({ 'p-invalid': false })} />
            </div>
            <div className='tel1 field'>
              <label htmlFor='telefono1'>Telefono 1</label>
              <InputText id='telefono1' value={appointment.telefono1 || ''} onChange={(e) => onInputChange(e, 'telefono1')} required autoFocus className={classNames({ 'p-invalid': false })} />
            </div>
            <div className='tel2 field'>
              <label htmlFor='telefono2'>Telefono 2</label>
              <InputText id='telefono2' value={appointment.telefono2 || ''} onChange={(e) => onInputChange(e, 'telefono2')} required autoFocus className={classNames({ 'p-invalid': false })} />
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
              <Calendar timeOnly showTime hourFormat="12" id='hora_programacion' value={appointment.hora_programacion} onChange={(e) => onInputChange(e, 'hora_programacion')} />
            </div>
            <div className='sintomas field'>
              <label htmlFor='sintomas'>Sintomas</label>
              <InputTextarea id='sintomas' value={appointment.sintomas || ''} onChange={(e) => onInputChange(e, 'sintomas')} required rows={3} cols={20} />
            </div>
            <div className='diagnostico field'>
              <label htmlFor='diagnostico'>Diagnostico</label>
              <InputTextarea id='diagnostico' value={appointment.diagnostico || ''} onChange={(e) => onInputChange(e, 'diagnostico')} required rows={3} cols={20} />
            </div>
          </div>
      </div>
    </Dialog>
  )
}

export default RegisterAppointmentForm;
