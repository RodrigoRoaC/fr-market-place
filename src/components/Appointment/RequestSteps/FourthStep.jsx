import React from 'react';
import { Button } from 'primereact/button';

const FourthStep = ({
  currentStep,
  setActiveIndex,
  form,
}) => {
  const closeButton = () => {
    if (form.hasMedicalRecord && form.atentionType === 1 && form.cod_tipo_atencion === 2) {
      setActiveIndex(currentStep - 2);
      return;
    }
    setActiveIndex(currentStep - 1);
  }

  return (
    <>
      { 
        currentStep === 3
        && 
        (
          <div>
            { !form.hasMedicalRecord && <h2>Nuestros ejecutivos se comunicarán con Uds. en breve momentos</h2> }
            { (form.hasMedicalRecord && form.atentionType === 2) && <h2>Nuestros ejecutivos se comunicarán con Uds. en breve momentos</h2> }
            { 
              (form.hasMedicalRecord && form.atentionType === 1) 
              && 
              (
                <>
                  <h2>Su tratamiento son por estos diagnósticos y su fecha será para el xx/xx/xxxx</h2>
                </>
              ) 
            }
            <Button label='Finalizar' onClick={closeButton} />
          </div>
        )
      }
    </>
  )
}

export default FourthStep;
