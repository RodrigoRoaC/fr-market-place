import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Calendar } from 'primereact/calendar';
import { UserService } from '../../../services/User/UserService';

const FirstStep = ({
  toast,
  currentStep,
  setActiveIndex,
  form,
  setForm,
}) => {
  const [submitted, setSubmitted] = useState(false);

  const isValidateFirstStep = (form) => {
    if (!form.num_documento || !form.fec_nacimiento) {
      return false;
    }

    return true;
  }

  const nextButton = async () => {
    setSubmitted(true);
    if (!isValidateFirstStep(form)) {
      return;
    }
    const userService = new UserService();
    const { error, data } = await userService.getPatientByDoc(form.num_documento);
    if (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error retrieving user information', life: 3000 });
      return;
    }
    if (!data) {
      setForm({ ...form, hasMedicalRecord: false });
      setActiveIndex(currentStep + 1);
      return;
    }

    setForm({ ...form, hasMedicalRecord: true });
    setActiveIndex(currentStep + 1);
    setSubmitted(false);
  }

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _form = {...form};
    _form[`${name}`] = val;

    setForm(_form);
  }

  return (
    <>
      { 
        currentStep === 0 
        && 
        (
          <div className="first_step">
            <div className="first_step-form">
              <div className='num_documento field'>
                <label htmlFor='num_documento'>Numero de documento</label>
                <InputText id='num_documento' value={form.num_documento || ''} onChange={(e) => onInputChange(e, 'num_documento')} required autoFocus className={classNames({ 'p-invalid': submitted && !form.num_documento })} />
                {submitted && !form.num_documento && <small className='p-error'>Este campo es requerido.</small>}
              </div>
              <div className='fnac field'>
                <label htmlFor='fecNac'>Fecha Nacimiento</label>
                <Calendar mask="99/99/9999" dateFormat='dd/mm/yy' id='fecNac' value={form.fec_nacimiento || ''} onChange={(e) => onInputChange(e, 'fec_nacimiento')} required className={classNames({ 'p-invalid': submitted && !form.fec_nacimiento })} showIcon />
                {submitted && !form.fec_nacimiento && <small className='p-error'>Este campo es requerido.</small>}
              </div>
            </div>
            <div className='first_step-button'>
              <Button label='Siguiente' onClick={nextButton} />
            </div>
          </div>
        )
      }
    </>
  )
}

export default FirstStep;
