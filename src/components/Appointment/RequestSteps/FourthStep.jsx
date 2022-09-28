import React from 'react';
import { Button } from 'primereact/button';
import { fields } from '../../../data/appointment-flow';

const FourthStep = ({
  currentStep,
  setActiveIndex,
  form,
  setForm,
}) => {
  const closeButton = () => {
    setForm({ ...fields });
    setActiveIndex(0);
  }

  return (
    <>
      { 
        currentStep === 3
        && 
        (
          <div className="fourth_step">
            { !form.hasMedicalRecord && <h2 className="fourth_step-label">Nuestros ejecutivos se comunicarán con Uds. en breve momentos</h2> }
            { (form.hasMedicalRecord && form.atentionType === 2) && <h2 className="fourth_step-label">Nuestros ejecutivos se comunicarán con Uds. en breve momentos</h2> }
            { 
              (form.hasMedicalRecord && form.atentionType === 1) 
              && 
              (
                <>
                  <h2 className="fourth_step-label">Su tratamiento son por estos diagnósticos y su fecha será para el xx/xx/xxxx</h2>
                </>
              ) 
            }
            <div className="fourth_step-button">
              <Button label='Finalizar' onClick={closeButton} />
            </div>
          </div>
        )
      }
    </>
  )
}

export default FourthStep;
