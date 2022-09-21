import React from 'react';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

import './IndicatorForm.css';
import { parseIndicators } from '../../utils/parser';
import { Divider } from 'primereact/divider';
import { IndicatorService } from '../../services/Indicator/IndicatorService';

function GenericForm({ 
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

  const findIndexById = (cod_mae_indicator) => {
    let index = -1;
    for (let i = 0; i < indicators.length; i++) {
      if (indicators[i].cod_mae_indicator === cod_mae_indicator) {
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

    if (indicator.cod_mae_indicator) {
      const index = findIndexById(indicator.cod_mae_indicator);
      const updateRes = await indicatorService.updateMae({ ...indicator });
      if (updateRes.error) {
        toast.current.show({ severity: 'error', summary: 'Indicator Edit error', detail: 'Edit failed', life: 3000 });
        return;
      }
      _indicators[index] = { ...(parseIndicators([updateRes.data])[0]) };
      setIndicators(_indicators);
      setIndicator({ ...(parseIndicators([updateRes.data])[0]) });

      setIndicatorDialog(false);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Indicator Updated', life: 3000 });
      return;
    }
    const registerRes = await indicatorService.registerMae({ ...indicator });
    if (registerRes.error) {
      toast.current.show({ severity: 'error', summary: 'Indicator Register error', detail: 'Register failed', life: 3000 });
      return;
    }
    setIndicators([...(parseIndicators([registerRes.data])), ...indicators]);
    setIndicator({ ...(parseIndicators([registerRes.data])[0]) });
    setIndicatorDialog(false);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Indicator Created', life: 3000 });
  }

  const genericDialogFooter = (
    <React.Fragment>
      <Button label='Cancelar' icon='pi pi-times' className='p-button-text' onClick={hideDialog} />
      <Button label='Completar Datos' icon='pi pi-check' className='p-button-text' onClick={saveIndicator} />
    </React.Fragment>
  );

  return (
    <Dialog visible={indicatorDialog} style={{ width: '650px'}} header='Registrar indicador genérico' modal className='p-fluid' footer={genericDialogFooter} onHide={hideDialog}>
      <div className='div-form-table'>
          <Divider align="left">
            <div className="inline-flex align-items-center">
                <b>Indicador</b>
            </div>
          </Divider>
          <div className='group-form-generic-indicator'>
            <div className='nombre field'>
              <label htmlFor='nombres'>Nombre</label>
              <InputText id='nombres' value={indicator.descripcion || ''} onChange={(e) => onInputChange(e, 'descripcion')} required autoFocus className={classNames({ 'p-invalid': submitted && !indicator.descripcion })} />
              {submitted && !indicator.descripcion && <small className='p-error'>Este campo es requerido.</small>}
            </div>
            <div className='ranmin field'>
              <label htmlFor='ranmin'>Rango mínimo</label>
              <InputText id='ranmin' value={indicator.rango_minimo || ''} onChange={(e) => onInputChange(e, 'rango_minimo')} required className={classNames({ 'p-invalid': submitted && !indicator.rango_minimo })} />
              {submitted && !indicator.rango_minimo && <small className='p-error'>Este campo es requerido.</small>}
            </div>
            <div className='ranmax field'>
              <label htmlFor='ranmax'>Rango máximo</label>
              <InputText id='ranmax' value={indicator.rango_maximo || ''} onChange={(e) => onInputChange(e, 'rango_maximo')} required className={classNames({ 'p-invalid': submitted && !indicator.rango_maximo })} />
              {submitted && !indicator.rango_maximo && <small className='p-error'>Este campo es requerido.</small>}
            </div>
          </div>
      </div>
    </Dialog>
  )
}

export default GenericForm;
