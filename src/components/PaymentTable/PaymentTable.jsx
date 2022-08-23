
import React, { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

import './PaymentTable.css';

const PaymentTable = ({
  toast,
  setPaymentDialog,
  setAppointment,
  setDeleteAppointmentDialog,
  appointments,
  userPerfil,
}) => {
  const [selectedAppointments, setSelectedAppointments] = useState(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const dt = useRef(null);

  const editAppointment = (appointment) => {
    setAppointment({...appointment});
    setPaymentDialog(true);
  }

  const confirmDeleteappointment = (appointment) => {
    setAppointment(appointment);
    setDeleteAppointmentDialog(true);
  }

  const statusBodyTemplate = (rowData) => {
    return <span className={`appointment-badge status-${rowData.descripcion.toLowerCase()}`}>{rowData.descripcion}</span>;
  }

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        { 
          [1, 2, 3].includes(userPerfil) 
            ? (
                <>
                  <Button icon='pi pi-pencil' className='p-button-rounded p-button-success mr-2' onClick={() => editAppointment(rowData)} />
                  <Button icon='pi pi-trash' className='p-button-rounded p-button-warning' onClick={() => confirmDeleteappointment(rowData)} />
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

  const header = (
    <div className='table-header'>
      <h2 className='mx-0 my-1'>Ordenes de pago</h2>
      <span className='p-input-icon-left'>
        <i className='pi pi-search' />
        <InputText type='search' onInput={(e) => setGlobalFilter(e.target.value || ' ')} placeholder='Search...' />
      </span>
    </div>
  );

  return (
    <div className='appointment-datatable'>
      <Toast ref={toast} />

      <div className='card'>
        <DataTable ref={dt} value={appointments} selection={selectedAppointments} onSelectionChange={(e) => setSelectedAppointments(e.value)}
          dataKey='cod_solicitud' paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
          currentPageReportTemplate='Showing {first} to {last} of {totalRecords} appointments'
          globalFilter={globalFilter} header={header} responsiveLayout='scroll'>

          <Column field='cod_solicitud' header='Code' sortable style={{ minWidth: '4rem' }} />
          <Column field='num_documento' header='Documento' sortable style={{ minWidth: '4rem' }} />
          <Column field='nombres' header='Nombre' sortable style={{ minWidth: '8rem' }} />
          <Column field='ape_paterno' header='Apellido' sortable style={{ minWidth: '4rem' }} />
          <Column field='email' header='Correo' sortable style={{ minWidth: '8rem' }} />
          <Column field='telefono1' header='N° Telefono' sortable style={{ minWidth: '8rem' }} />
          <Column field='descripcion' header='Estado' body={statusBodyTemplate} sortable style={{ minWidth: '8rem' }} />
          <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }} />
        </DataTable>
      </div>
    </div>
  );
}

export default PaymentTable;
