import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import React, { useState } from 'react';
import { AppointmentService } from '../../services/AppointmentService';

const AssignForm = ({
  appointments,
  setAppointments,
  operator,
  assignDialog,
  setAssignDialog,
  toast,
  codSolicitud,
}) => {
  const [selectedOperator, setSelectedOperator] = useState(null);

  const assignAppointment = async () => {
    const appointmentService = new AppointmentService();
    const registerRes = await appointmentService.asignToOperator(
      selectedOperator,
      codSolicitud
    );
    if (registerRes.error) {
      toast.current.show({
        severity: 'error',
        summary: 'Appoinment assign error',
        detail: 'Assignment failed',
        life: 3000,
      });
      return;
    }
    const _appointments = appointments.filter(
      (a) => a.cod_solicitud !== codSolicitud
    );
    toast.current.show({
      severity: 'success',
      summary: 'Successful',
      detail: 'Appointment assigned',
      life: 3000,
    });
    setAppointments({ ..._appointments });
    setAssignDialog(false);
  };

  const hideDialog = () => {
    setAssignDialog(false);
  };

  const assignDialogFooter = (
    <React.Fragment>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDialog}
      />
      <Button
        label="Asignar"
        icon="pi pi-check"
        className="p-button-text"
        onClick={assignAppointment}
      />
    </React.Fragment>
  );

  return (
    <Dialog
      visible={assignDialog}
      style={{ width: '950px' }}
      header="Asignar solicitud"
      modal
      className="p-fluid"
      footer={assignDialogFooter}
      onHide={hideDialog}
    >
      <div className="div-form-table">
        <div className="field">
          <label htmlFor="cod_modalidad">Operadora</label>
          <Dropdown
            optionLabel="label"
            optionValue="value"
            value={selectedOperator}
            options={operator}
            onChange={(e) => setSelectedOperator(e.value)}
            placeholder="Selecciona un operador"
          />
        </div>
      </div>
    </Dialog>
  );
};

export default AssignForm;
