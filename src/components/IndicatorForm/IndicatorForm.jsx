import React from 'react';
import { classNames } from 'primereact/utils';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

import './IndicatorForm.css';
import { parseIndicators, parsePatientIndicator } from '../../utils/parser';
import { InputTextarea } from 'primereact/inputtextarea';
import { Divider } from 'primereact/divider';
import { IndicatorService } from '../../services/Indicator/IndicatorService';
import { UserService } from '../../services/User/UserService';

function IndicatorForm({ 
  toast, 
  indicatorDialog, 
  indicator = {}, 
  setIndicatorDialog, 
  submitted,
  setSubmitted,
  setIndicator, 
  indicators = [],
  setIndicators, 
  emptyIndicator, 
}) {
  const hideDialog = () => {
    setSubmitted(false);
    setIndicator(emptyIndicator);
    setIndicatorDialog(false);
  }

  const findIndexById = (cod_indicator) => {
    let index = -1;
    for (let i = 0; i < indicators.length; i++) {
      if (indicators[i].cod_indicator === cod_indicator) {
        index = i;
        break;
      }
    }

    return index;
  }

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _indicator = {...indicator};
    _indicator[`${name}`] = val;

    setIndicator(_indicator);
  }

  const saveIndicator = async () => {
    const indicatorService = new IndicatorService();
    setSubmitted(true);
    let _indicators = [...indicators];

    if (indicator.cod_indicator) {
      const index = findIndexById(indicator.cod_indicator);
      const updateRes = await indicatorService.update({ ...indicator });
      if (updateRes.error) {
        toast.current.show({ severity: 'error', summary: 'Indicator Edit error', detail: 'Edit failed', life: 3000 });
        return;
      }
      _indicators[index] = { ...(parseIndicators([updateRes.data])[0]) };
      setIndicators(_indicators);
      setIndicator({ ...(parseIndicators([updateRes.data])[0]) });

      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Appointment Updated', life: 3000 });
      return;
    }
  }

  const findPatientByDoc = async () => {
    const userService = new UserService();
    const patientRes = await userService.getPatientByDoc(indicator.num_documento);
    if (patientRes.error || !patientRes.data) {
      toast.current.show({ severity: 'error', summary: 'Patient data error', detail: 'Patient failed', life: 3000 });
      return;
    }

    setIndicator({ ...indicator, ...parsePatientIndicator(patientRes.data) });
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Indicator Updated', life: 3000 });
    return;
  }

  const indicatorDialogFooter = (
    <React.Fragment>
      <Button label='Cancelar' icon='pi pi-times' className='p-button-text' onClick={hideDialog} />
      <Button label='Completar Datos' icon='pi pi-check' className='p-button-text' onClick={saveIndicator} />
    </React.Fragment>
  );

  return (
    <Dialog visible={indicatorDialog} style={{ width: '650px'}} header='Editar indicador' modal className='p-fluid' footer={indicatorDialogFooter} onHide={hideDialog}>
      <div className='div-form-table'>
        <Divider align="left">
          <div className="inline-flex align-items-center">
            <b>Indicador</b>
          </div>
        </Divider>
          <div className='group-form-indicator-mae'>
            <div className='codmae field'>
              <label htmlFor='codmae'>Código</label>
              <InputText id='codmae' value={indicator.cod_indicator || ''} required autoFocus className={classNames({ 'p-invalid': false })} disabled />
            </div>
            <div className='desmae field'>
              <label htmlFor='desmae'>Nombre</label>
              <InputText id='desmae' value={indicator.nombre_mae_indicator || ''} required autoFocus className={classNames({ 'p-invalid': false })} disabled />
            </div>
            <div className='ranmin field'>
              <label htmlFor='ranmin'>Rango mínimo</label>
              <InputText id='ranmin' value={indicator.rango_minimo || ''} required autoFocus className={classNames({ 'p-invalid': false })} disabled />
            </div>
            <div className='ranmax field'>
              <label htmlFor='ranmax'>Rango máximo</label>
              <InputText id='ranmax' value={indicator.rango_maximo || ''} required autoFocus className={classNames({ 'p-invalid': false })} disabled />
            </div>
          </div>
        <Divider align="left">
          <div className="inline-flex align-items-center">
            <b>Paciente</b>
          </div>
        </Divider>
          <div className='group-form-indicator-paciente'>
            <div className='numdoc field'>
              <label htmlFor='numdoc'>Numero documento</label>
              <InputText id='numdoc' value={indicator.num_documento || ''} required autoFocus onChange={(e) => onInputChange(e, 'num_documento')} className={classNames({ 'p-invalid': submitted && !indicator.num_documento })} />
            </div>
            <div className='btnsearch field'>
              <label htmlFor='' className='send-link'>A</label>
              <Button label='Buscar' icon='pi pi-search' onClick={findPatientByDoc} />
            </div>
            <div className='codpac field'>
              <label htmlFor='codpac'>Código</label>
              <InputText id='codpac' value={indicator.cod_paciente || ''} required autoFocus onChange={(e) => onInputChange(e, 'cod_paciente')} className={classNames({ 'p-invalid': submitted && !indicator.cod_paciente })} disabled />
            </div>
            <div className='nombrepac field'>
              <label htmlFor='nombrepac'>Nombre</label>
              <InputText id='codpac' value={indicator.nombres_paciente || ''} required autoFocus onChange={(e) => onInputChange(e, 'nombres_paciente')} className={classNames({ 'p-invalid': submitted && !indicator.nombres_paciente })} disabled />
            </div>
          </div>
        <Divider align="left">
          <div className="inline-flex align-items-center">
            <b>Registro</b>
          </div>
        </Divider>
          <div className='group-form-indicator-registro'>
            <div className='valor field'>
              <label htmlFor='valor'>Valor</label>
              <InputText id='valor' value={indicator.valor || ''} required autoFocus onChange={(e) => onInputChange(e, 'valor')} className={classNames({ 'p-invalid': submitted && !indicator.valor })} />
            </div>
            <div className='fecate field'>
              <label htmlFor='fecha_atencion'>Fecha Atención</label>
              <Calendar dateFormat='dd/mm/yy' id='fecha_atencion' value={indicator.fec_atencion} onChange={(e) => onInputChange(e, 'fec_atencion')} className={classNames({ 'p-invalid': submitted && !indicator.fec_atencion })} showIcon />
            </div>
            <div className='descripcion field'>
              <label htmlFor='descripcion'>Observaciones</label>
              <InputTextarea id='descripcion' value={indicator.descripcion || ''} onChange={(e) => onInputChange(e, 'descripcion')} required rows={3} cols={20} className={classNames({ 'p-invalid': false })} />
            </div>
          </div>
      </div>
    </Dialog>
  )
}

export default IndicatorForm;
