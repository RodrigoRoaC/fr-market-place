import React, { useContext } from 'react';
import { classNames } from 'primereact/utils';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

import './DoctorForm.css';
import { UserContext } from '../../context/UserContext';
import { parsePayments } from '../../utils/parser';
import { InputTextarea } from 'primereact/inputtextarea';
import { Divider } from 'primereact/divider';
import { PaymentService } from '../../services/Payment/PaymentService';

function DoctorForm({ 
  toast, 
  paymentDialog, 
  payment = {}, 
  setPaymentDialog, 
  submitted,
  setSubmitted,
  setPayment, 
  payments = [],
  setPayments, 
  emptyPayment, 
  disablePatient,
  disablePayment,
}) {
  const { user } = useContext(UserContext);

  const hideDialog = () => {
    setSubmitted(false);
    setPayment(emptyPayment);
    setPaymentDialog(false);
  }

  const findIndexById = (cod_pago) => {
    let index = -1;
    for (let i = 0; i < payments.length; i++) {
      if (payments[i].cod_pago === cod_pago) {
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

  const savePayment = async () => {
    const paymentService = new PaymentService();
    setSubmitted(true);
    let _payments = [...payments];

    if (payment.cod_pago) {
      const index = findIndexById(payment.cod_pago);
      const getEstado = payment.cod_estado === 1 ? 2 : payment.cod_estado;
      const updateRes = await paymentService.update({ ...payment, cod_usuario: user.cod_usuario, cod_estado: getEstado });
      if (updateRes.error) {
        toast.current.show({ severity: 'error', summary: 'Appoinment Edit error', detail: 'Edit failed', life: 3000 });
        return;
      }
      _payments[index] = { ...(parsePayments([updateRes.data])[0]) };
      setPayments(_payments);
      setPayment({ ...(parsePayments([updateRes.data])[0]) });

      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Appointment Updated', life: 3000 });
      return;
    }
    const registerRes = await paymentService.register({ ...payment, cod_usuario: user.cod_usuario, cod_estado: 2 });
    if (registerRes.error) {
      toast.current.show({ severity: 'error', summary: 'Appoinment Register error', detail: 'Register failed', life: 3000 });
      return;
    }
    setPayments([...(parsePayments([registerRes.data])[0]), ...payments]);
    setPayment({ ...(parsePayments([registerRes.data])[0]) });
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Appointment Created', life: 3000 });
  }

  const sendPaymentLink = async () => {
    const paymentService = new PaymentService();
    const emailRes = await paymentService.sendEmail({ ...payment, subject: 'Link de pago', template: 'paymentLink' });
    if (emailRes.error) {
      toast.current.show({ severity: 'error', summary: 'Send Payment link Error', detail: 'Send link failed', life: 3000 });
      return;
    }

    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Link sended successfully', life: 3000 });
  }

  const paymentDialogFooter = (
    <React.Fragment>
      <Button label='Cancelar' icon='pi pi-times' className='p-button-text' onClick={hideDialog} />
      <Button label='Completar Datos' icon='pi pi-check' className='p-button-text' onClick={savePayment} />
    </React.Fragment>
  );

  return (
    <Dialog visible={paymentDialog} style={{ width: '650px'}} header='Registrar pago' modal className='p-fluid' footer={paymentDialogFooter} onHide={hideDialog}>
      <div className='div-form-table'>
          <Divider align="left">
            <div className="inline-flex align-items-center">
                <b>Doctor</b>
            </div>
          </Divider>
          <div className='group-form-register-doctor'>
            <div className='nombre field'>
              <label htmlFor='nombres'>Nombre</label>
              <InputText id='nombres' value={payment.nombres || ''} onChange={(e) => onInputChange(e, 'nombres')} required autoFocus className={classNames({ 'p-invalid': submitted && !payment.nombres })} disabled={disablePayment}/>
              {submitted && !payment.nombres && <small className='p-error'>Nombre es requerido.</small>}
            </div>
            <div className='apepat field'>
              <label htmlFor='apePat'>Apellido Paterno</label>
              <InputText id='apePat' value={payment.ape_paterno || ''} onChange={(e) => onInputChange(e, 'ape_paterno')} required autoFocus className={classNames({ 'p-invalid': submitted && !payment.ape_paterno })} disabled={disablePayment}/>
              {submitted && !payment.ape_paterno && <small className='p-error'>Apellido Paterno es requerido.</small>}
            </div>
            <div className='apemat field'>
              <label htmlFor='apePat'>Apellido Materno</label>
              <InputText id='apePat' value={payment.ape_materno || ''} onChange={(e) => onInputChange(e, 'ape_materno')} required autoFocus className={classNames({ 'p-invalid': submitted && !payment.ape_materno })} disabled={disablePayment}/>
              {submitted && !payment.ape_materno && <small className='p-error'>Apellido Materno es requerido.</small>}
            </div>
            <div className='ndoc field'>
              <label htmlFor='num_documento'>{ payment.desc_corta || 'DNI' }</label>
              <InputText id='num_documento' value={payment.num_documento || ''} onChange={(e) => onInputChange(e, 'num_documento')} required autoFocus className={classNames({ 'p-invalid': submitted && !payment.num_documento })} disabled={disablePayment}/>
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
                <b>Disponibilidad</b>
            </div>
          </Divider>
          <div className='group-form-availability-doctor'>
            <div className='nauto field'>
              <label htmlFor='numero_autorizacion'>N° Autorizacion</label>
              <InputText id='numero_autorizacion' value={payment.numero_autorizacion || ''} onChange={(e) => onInputChange(e, 'numero_autorizacion')} required autoFocus className={classNames({ 'p-invalid': false })} disabled={disablePatient}/>
            </div>
            <div className='fecauto field'>
              <label htmlFor='fecha_autorizacion'>Fecha Autorizacion</label>
              <Calendar dateFormat='dd/mm/yy' id='fecha_autorizacion' value={payment.fecha_autorizacion} onChange={(e) => onInputChange(e, 'fecha_autorizacion')} showIcon />
            </div>
            <div className='fecprog field'>
              <label htmlFor='deducible'>Deducible</label>
              <InputText id='deducible' value={payment.deducible || ''} onChange={(e) => onInputChange(e, 'deducible')} required autoFocus className={classNames({ 'p-invalid': submitted && !payment.deducible })} disabled={disablePatient} />
            </div>
            <div className='horaprog field'>
              <label htmlFor='copago'>Copago</label>
              <InputText id='copago' value={payment.copago || ''} onChange={(e) => onInputChange(e, 'copago')} required autoFocus className={classNames({ 'p-invalid': false })} disabled={disablePatient} />
            </div>
            <div className='link field'>
              <label htmlFor='link_pago'>Link de pago</label>
              <InputText id='link_pago' value={payment.link_pago || ''} onChange={(e) => onInputChange(e, 'link_pago')} required autoFocus className={classNames({ 'p-invalid': submitted && !payment.link_pago })} disabled={disablePatient} />
            </div>
            <div className='btnsend field'>
              <label htmlFor='link_pago' className='send-link'>Link de pago</label>
              <Button label='Enviar link' icon='pi pi-envelope' onClick={sendPaymentLink} disabled={disablePatient} />
            </div>
            <div className='diagnostico field'>
              <label htmlFor='observaciones'>Observaciones</label>
              <InputTextarea id='observaciones' value={payment.observaciones || ''} onChange={(e) => onInputChange(e, 'observaciones')} required rows={3} cols={20}  disabled={disablePatient} />
            </div>
          </div>
      </div>
    </Dialog>
  )
}

export default DoctorForm;
