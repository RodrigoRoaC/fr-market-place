import React, { useContext } from 'react';
import { classNames } from 'primereact/utils';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { ConfirmDialog , confirmDialog } from 'primereact/confirmdialog';

import './PaymentForm.css';
import { AppointmentService } from '../../services/AppointmentService';
import { UserContext } from '../../context/UserContext';
import { parseAppointments } from '../../utils/parser';
import { InputTextarea } from 'primereact/inputtextarea';
import { Divider } from 'primereact/divider';

function PaymentForm({ 
  paymentDialog, 
  setPaymentDialog, 
  submitted,
  setSubmitted,
  payment = {}, 
  setPayment, 
  appointments = [],
  setAppointments, 
  emptyAppointment, 
  toast, 
}) {
  const { user } = useContext(UserContext);

  const accept = () => {
    toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
  }

  const reject = () => {
    toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
  }

  const hideDialog = () => {
    setSubmitted(false);
    setPaymentDialog(false);
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
    let _appointment = {...payment};
    _appointment[`${name}`] = val;

    setPayment(_appointment);
  }

  const saveAppointment = async () => {
    const appointmentService = new AppointmentService();
    setSubmitted(true);
    let _appointments = [...appointments];

    if (payment.cod_solicitud) {
      const index = findIndexById(payment.cod_solicitud);
      const updateRes = await appointmentService.update({ ...payment, cod_usuario: user.cod_usuario });
      if (updateRes.error) {
        toast.current.show({ severity: 'error', summary: 'Appoinment Edit error', detail: 'Edit failed', life: 3000 });
        return;
      }
      _appointments[index] = { ...(parseAppointments([updateRes.data])[0]) };
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Appointment Updated', life: 3000 });

      setAppointments(_appointments);
      setPaymentDialog(false);
      setPayment(emptyAppointment);
      return;
    }
    const registerRes = await appointmentService.register({ ...payment, cod_usuario: user.cod_usuario });
    if (registerRes.error) {
      toast.current.show({ severity: 'error', summary: 'Appoinment Register error', detail: 'Register failed', life: 3000 });
      return;
    }
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Appointment Created', life: 3000 });
    setAppointments([...(parseAppointments(registerRes.data)[0]), ...appointments]);
    setPaymentDialog(false);
    setPayment(emptyAppointment);
  }

  const generatePayment = () => {
    confirmDialog({
      message: 'Are you sure you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      position: 'top',
      accept,
      reject
    });
  }

  const appointmentDialogFooter = (
    <React.Fragment>
      { payment.descripcion === 'REGISTRADA' && <Button label='Validar Pago' icon='pi pi-wallet' className='p-button-text' onClick={generatePayment} /> }
      <Button label='Cancelar' icon='pi pi-times' className='p-button-text' onClick={hideDialog} />
      <Button label='Completar Datos' icon='pi pi-check' className='p-button-text' onClick={saveAppointment} />
    </React.Fragment>
  );

  return (
    <Dialog visible={paymentDialog} style={{ width: '650px'}} header='Registrar pago' modal className='p-fluid' footer={appointmentDialogFooter} onHide={hideDialog}>
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
              <InputText id='nombres' value={payment.nombres || ''} onChange={(e) => onInputChange(e, 'nombres')} required autoFocus className={classNames({ 'p-invalid': submitted && !payment.nombres })} disabled/>
              {submitted && !payment.nombres && <small className='p-error'>Nombre es requerido.</small>}
            </div>
            <div className='apepat field'>
              <label htmlFor='apePat'>Apellido Paterno</label>
              <InputText id='apePat' value={payment.ape_paterno || ''} onChange={(e) => onInputChange(e, 'ape_paterno')} required autoFocus className={classNames({ 'p-invalid': submitted && !payment.ape_paterno })} disabled/>
              {submitted && !payment.ape_paterno && <small className='p-error'>Apellido Paterno es requerido.</small>}
            </div>
            <div className='apemat field'>
              <label htmlFor='apePat'>Apellido Materno</label>
              <InputText id='apePat' value={payment.ape_materno || ''} onChange={(e) => onInputChange(e, 'ape_materno')} required autoFocus className={classNames({ 'p-invalid': submitted && !payment.ape_materno })} disabled/>
              {submitted && !payment.ape_materno && <small className='p-error'>Apellido Materno es requerido.</small>}
            </div>
            <div className='ndoc field'>
              <label htmlFor='num_documento'>{ payment.cod_tipo_doc || 'DNI' }</label>
              <InputText id='num_documento' value={payment.num_documento || ''} onChange={(e) => onInputChange(e, 'num_documento')} required autoFocus className={classNames({ 'p-invalid': submitted && !payment.num_documento })} disabled/>
              {submitted && !payment.num_documento && <small className='p-error'>Documento es requerido.</small>}
            </div>
            <div className='email field'>
              <label htmlFor='email'>Email</label>
              <InputText id='email' value={payment.email || ''} onChange={(e) => onInputChange(e, 'email')} required autoFocus className={classNames({ 'p-invalid': submitted && !payment.email })} />
              {submitted && !payment.email && <small className='p-error'>Email es requerido.</small>}
            </div>
          </div>
          <Divider align="left">
            <div className="inline-flex align-items-center">
                <b>Pago</b>
            </div>
          </Divider>
          <div className='group-form-cita'>
            <div className='nauto field'>
              <label htmlFor='numero_autorizacion'>N° Autorizacion</label>
              <InputText id='numero_autorizacion' value={payment.numero_autorizacion || ''} onChange={(e) => onInputChange(e, 'numero_autorizacion')} required autoFocus className={classNames({ 'p-invalid': submitted && !payment.numero_autorizacion })} />
              {submitted && !payment.numero_autorizacion && <small className='p-error'>Numero autorizacion es requerido.</small>}
            </div>
            <div className='fecauto field'>
              <label htmlFor='fecha_autorizacion'>Fecha Autorizacion</label>
              <Calendar dateFormat='dd/mm/yy' id='fecha_autorizacion' value={payment.fecha_autorizacion} onChange={(e) => onInputChange(e, 'fecha_autorizacion')} showIcon />
            </div>
            <div className='fecprog field'>
              <label htmlFor='fecha_programacion'>Deducible</label>
              <InputText id='numero_autorizacion' value={payment.numero_autorizacion || ''} onChange={(e) => onInputChange(e, 'numero_autorizacion')} required autoFocus className={classNames({ 'p-invalid': submitted && !payment.numero_autorizacion })} />
            </div>
            <div className='horaprog field'>
              <label htmlFor='hora_programacion'>Copago</label>
              <InputText id='numero_autorizacion' value={payment.numero_autorizacion || ''} onChange={(e) => onInputChange(e, 'numero_autorizacion')} required autoFocus className={classNames({ 'p-invalid': submitted && !payment.numero_autorizacion })} />
            </div>
            <div className='link field'>
              <label htmlFor='link_pago'>Link de pago</label>
              <InputText id='link_pago' value={payment.numero_autorizacion || ''} onChange={(e) => onInputChange(e, 'numero_autorizacion')} required autoFocus className={classNames({ 'p-invalid': submitted && !payment.numero_autorizacion })} />
            </div>
            <div className='btnsend field'>
              <label htmlFor='link_pago' className='send-link'>Link de pago</label>
              <Button label='Enviar link' icon='pi pi-envelope' onClick={saveAppointment} />
            </div>
            <div className='diagnostico field'>
              <label htmlFor='diagnostico'>Observaciones</label>
              <InputTextarea id='diagnostico' value={payment.diagnostico || ''} onChange={(e) => onInputChange(e, 'diagnostico')} required rows={3} cols={20} />
            </div>
          </div>
      </div>
    </Dialog>
  )
}

export default PaymentForm;
