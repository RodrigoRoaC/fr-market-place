
import React, { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

import './PaymentTable.css';
import { Dialog } from 'primereact/dialog';
import emptyPayment from '../../data/payment';
import { PaymentService } from '../../services/Payment/PaymentService';
import { parsePayments } from '../../utils/parser';

const PaymentTable = ({
  toast,
  setPaymentDialog,
  payment,
  setPayment,
  payments,
  setPayments,
  userPerfil,
}) => {
  const [selectedAppointments, setSelectedAppointments] = useState(null);
  const [deletePaymentDialog, setDeletePaymentDialog] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  const dt = useRef(null);

  const editPayment = (appointment) => {
    setPayment({...appointment});
    setPaymentDialog(true);
  }

  const confirmDeletePayment = (appointment) => {
    setPayment(appointment);
    setDeletePaymentDialog(true);
  }

  const hideDeletePaymentDialog = () => {
    setDeletePaymentDialog(false);
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
                  <Button icon='pi pi-pencil' className='p-button-rounded p-button-success mr-2' onClick={() => editPayment(rowData)} />
                  <Button icon='pi pi-trash' className='p-button-rounded p-button-warning' onClick={() => confirmDeletePayment(rowData)} />
                </>
              )
            :
              (
                <>
                  <Button icon='pi pi-eye' className='p-button-rounded p-button-info mr-2' onClick={() => editPayment(rowData)} />
                </>
              )
        }
      </React.Fragment>
    );
  }

  const deletePayment = async () => {
    let _payments = payments.filter(val => val.cod_pago !== payment.cod_pago);
    const paymentService = new PaymentService();
    const { error, data } = await paymentService.nullifyPayment(payment.cod_pago);
    if (error) {
      toast.current.show({ severity: 'error', summary: 'Error deleting payment', detail: 'Deleted failed', life: 3000 });
      return;
    }

    setPayments([...(parsePayments([data])), ..._payments]);
    setDeletePaymentDialog(false);
    setPayment(emptyPayment);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Payment Deleted', life: 3000 });
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

  const deletePaymentDialogFooter = (
    <React.Fragment>
      <Button label='No' icon='pi pi-times' className='p-button-text' onClick={hideDeletePaymentDialog} />
      <Button label='Si' icon='pi pi-check' className='p-button-text' onClick={deletePayment} />
    </React.Fragment>
  );

  return (
    <div className='appointment-datatable'>
      <Toast ref={toast} />

      <div className='card'>
        <DataTable ref={dt} value={payments} selection={selectedAppointments} onSelectionChange={(e) => setSelectedAppointments(e.value)}
          dataKey='cod_solicitud' paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
          currentPageReportTemplate='Showing {first} to {last} of {totalRecords} appointments'
          globalFilter={globalFilter} header={header} responsiveLayout='scroll'>

          <Column field='cod_pago' header='Código' sortable style={{ minWidth: '4rem' }} />
          <Column field='cod_solicitud' header='N° Solicitud' sortable style={{ minWidth: '4rem' }} />
          <Column field='nombres' header='Nombre' sortable style={{ minWidth: '8rem' }} />
          <Column field='ape_paterno' header='Apellido' sortable style={{ minWidth: '4rem' }} />
          <Column field='email' header='Correo' sortable style={{ minWidth: '8rem' }} />
          <Column field='num_documento' header='N° Documento' sortable style={{ minWidth: '8rem' }} />
          <Column field='telefono1' header='N° Telefono' body={statusBodyTemplate} sortable style={{ minWidth: '8rem' }} />
          <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }} />
        </DataTable>
      </div>

      <Dialog visible={deletePaymentDialog} style={{ width: '450px' }} header='Confirm' modal footer={deletePaymentDialogFooter} onHide={hideDeletePaymentDialog}>
        <div className='confirmation-content'>
          <i className='pi pi-exclamation-triangle mr-3' style={{ fontSize: '2rem'}} />
          {payment && <span>¿Estas seguro de eliminar el pago: <b>{payment.cod_pago}</b>?</span>}
        </div>
      </Dialog>
    </div>
  );
}

export default PaymentTable;
