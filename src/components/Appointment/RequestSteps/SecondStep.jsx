import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { classNames } from 'primereact/utils';

const SecondStep = ({
  currentStep,
  setActiveIndex,
  form,
  setForm,
}) => {
  const [submitted, setSubmitted] = useState(false);

  const tipoCita = [
    {
      label: 'Programa',
      value: 1
    },
    {
      label: 'Particular',
      value: 2
    },
  ];

  const tipoAtencion = [
    {
      label: 'Agudo',
      value: 3
    },
    {
      label: 'Crónico',
      value: 2
    },
  ];

  const tipoModalidad = [
    {
      label: 'Presencial',
      value: 1
    },
    {
      label: 'Virtual',
      value: 2
    },
  ];

  const previousButton = () => {
    setActiveIndex(currentStep - 1);
  }

  const nextButton = () => {
    setSubmitted(true);
    if (form.hasMedicalRecord && form.atentionType === 1 && form.cod_tipo_atencion === 2) {
      setActiveIndex(currentStep + 2);
      return;
    }
    setActiveIndex(currentStep + 1);
  }

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _form = {...form};
    _form[`${name}`] = val;

    setForm(_form);
  }

  const onAttentionTypeChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _form = {...form};
    _form[`${name}`] = val;
    _form[`cod_tipo_atencion`] = '';
    _form[`cod_modalidad`] = '';
    if (val === 2) {
      _form[`cod_tipo_atencion`] = 3;
    }

    setForm(_form);
  }

  return (
    <>
      { 
        currentStep === 1
        && 
        (
          <div>
            <div>
              <div className='tdoc field'>
                <label htmlFor='cod_tipo_doc'>Tipo Cita</label>
                <Dropdown optionLabel='label' optionValue='value' value={form.atentionType || ''} options={tipoCita} onChange={(e) => onAttentionTypeChange(e, 'atentionType')} placeholder='Seleccionar'/>
              </div>
              {
                form.atentionType === 1 
                && 
                <div className='taten field'>
                  <label htmlFor='cod_tipo_atencion'>Tipo Atención</label>
                  <Dropdown optionLabel='label' optionValue='value' value={form.cod_tipo_atencion || ''} options={tipoAtencion} onChange={(e) => onInputChange(e, 'cod_tipo_atencion')} placeholder='Seleccionar'/>
                </div>
              }
              {
                form.atentionType === 2 && form.cod_tipo_atencion === 3
                && 
                <div className='modalidad field'>
                  <label htmlFor='cod_modalidad'>Modalidad Servicio</label>
                  <Dropdown optionLabel='label' optionValue='value' value={form.cod_modalidad} options={tipoModalidad} onChange={(e) => onInputChange(e, 'cod_modalidad')} placeholder='Selecciona una modalidad'/>
                </div>
              }
              {
                form.cod_tipo_atencion === 3
                &&
                <div className='sintomas field'>
                  <label htmlFor='sintomas'>Sintomas</label>
                  <InputTextarea id='sintomas' value={form.sintomas || ''} onChange={(e) => onInputChange(e, 'sintomas')} required rows={3} cols={20} className={classNames({ 'p-invalid': submitted && !form.sintomas })} />
                  {submitted && !form.sintomas && <small className='p-error'>Este campo es requerido.</small>}
                </div>
              }
              {
                !form.hasMedicalRecord && form.cod_tipo_atencion === 2
                &&
                <div className='diagnostico field'>
                  <label htmlFor='diagnostico'>Diagnostico</label>
                  <InputTextarea id='diagnostico' value={form.diagnostico || ''} onChange={(e) => onInputChange(e, 'diagnostico')} required rows={3} cols={20} className={classNames({ 'p-invalid': submitted && !form.diagnostico })} />
                  {submitted && !form.diagnostico && <small className='p-error'>Este campo es requerido.</small>}
                </div>
              }
            </div>
            <Button label='Anterior' onClick={previousButton} />
            <Button label='Siguiente' onClick={nextButton} />
          </div>
        )
      }
    </>
  )
}

export default SecondStep;
