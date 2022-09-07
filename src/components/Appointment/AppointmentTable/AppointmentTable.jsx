
import React, { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

import './AppointmentTable.css';
import { Dialog } from 'primereact/dialog';


import emptyAppointment from '../../../data/appointment';
import { AppointmentService } from '../../../services/Appointment/AppointmentService';
import { parseAppointments } from '../../../utils/parser';

const AppointmentTable = ({
  toast,
  setAppointmentDialog,
  appointment,
  setAppointment,
  appointments,
  setAppointments,
  userPerfil,
}) => {
  const [selectedAppointments, setSelectedAppointments] = useState(null);
  const [deleteAppointmentDialog, setDeleteAppointmentDialog] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  const dt = useRef(null);

  const editAppointment = (appointment) => {
    setAppointment({...appointment});
    setAppointmentDialog(true);
  }

  const confirmDeleteAppointment = (appointment) => {
    setAppointment(appointment);
    setDeleteAppointmentDialog(true);
  }

  const hideDeleteAppointmentDialog = () => {
    setDeleteAppointmentDialog(false);
  }

  const statusBodyTemplate = (rowData) => {
    return <span className={`appointment-badge status-${rowData.descripcion?.toLowerCase()}`}>{rowData.descripcion}</span>;
  }

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        { 
          [4].includes(userPerfil) 
            ? (
                <>
                  <Button icon='pi pi-pencil' className='p-button-rounded p-button-success mr-2' onClick={() => editAppointment(rowData)} />
                  <Button icon='pi pi-trash' className='p-button-rounded p-button-warning' onClick={() => confirmDeleteAppointment(rowData)} />
                </>
              )
            :
              (
                <>
                  <Button icon='pi pi-eye' className='p-button-rounded p-button-info mr-2' onClick={() => editAppointment(rowData)} />
                </>
              )
        }
      </React.Fragment>
    );
  }

  const deleteAppointment = async () => {
    let _appointments = appointments.filter(val => val.cod_pago !== appointment.cod_pago);
    const paymentService = new AppointmentService();
    const { error, data } = await paymentService.nullifyPayment(appointment.cod_pago);
    if (error) {
      toast.current.show({ severity: 'error', summary: 'Error deleting payment', detail: 'Deleted failed', life: 3000 });
      return;
    }

    setAppointments([...(parseAppointments([data])), ..._appointments]);
    setDeleteAppointmentDialog(false);
    setAppointment(emptyAppointment);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Payment Deleted', life: 3000 });
  }

  const header = (
    <div className='table-header'>
      <h2 className='mx-0 my-1'>Citas</h2>
      <span className='p-input-icon-left'>
        <i className='pi pi-search' />
        <InputText type='search' onInput={(e) => setGlobalFilter(e.target.value || ' ')} placeholder='Search...' />
      </span>
    </div>
  );

  const deleteAppointmentDialogFooter = (
    <React.Fragment>
      <Button label='No' icon='pi pi-times' className='p-button-text' onClick={hideDeleteAppointmentDialog} />
      <Button label='Si' icon='pi pi-check' className='p-button-text' onClick={deleteAppointment} />
    </React.Fragment>
  );

  return (
    <div className='appointment-datatable'>
      <Toast ref={toast} />

      <div className='card'>
        <DataTable ref={dt} value={appointments} selection={selectedAppointments} onSelectionChange={(e) => setSelectedAppointments(e.value)}
          dataKey='cod_cita' paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
          currentPageReportTemplate='Showing {first} to {last} of {totalRecords} appointments'
          globalFilter={globalFilter} header={header} responsiveLayout='scroll'>

          <Column field='cod_cita' header='Código' sortable style={{ minWidth: '4rem' }} />
          <Column field='nombres_paciente' header='Paciente' sortable style={{ minWidth: '4rem' }} />
          <Column field='telefono1' header='Telefono' sortable style={{ minWidth: '8rem' }} />
          <Column field='email' header='Correo' sortable style={{ minWidth: '4rem' }} />
          <Column field='nombres_doctor' header='Doctor' sortable style={{ minWidth: '8rem' }} />
          <Column field='f_programacion' header='Fecha Programacion' sortable style={{ minWidth: '8rem' }} />
          <Column field='cod_estado' header='Estado' body={statusBodyTemplate} sortable style={{ minWidth: '8rem' }} />
          <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }} />
        </DataTable>
      </div>

      <Dialog visible={deleteAppointmentDialog} style={{ width: '450px' }} header='Confirm' modal footer={deleteAppointmentDialogFooter} onHide={hideDeleteAppointmentDialog}>
        <div className='confirmation-content'>
          <i className='pi pi-exclamation-triangle mr-3' style={{ fontSize: '2rem'}} />
          {appointment && <span>¿Estas seguro de cancelar la cita: <b>{appointment.cod_pago}</b>?</span>}
        </div>
      </Dialog>
    </div>
  );
}

export default AppointmentTable;
