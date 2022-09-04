
import React, { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

import './DoctorTable.css';
import { Dialog } from 'primereact/dialog';

import { parseDoctors } from '../../../utils/parser';
import { DoctorService } from '../../../services/Doctor/DoctorService';

const DoctorTable = ({
  toast,
  emptyDoctor,
  setDoctorDialog,
  setDoctor,
  doctor,
  doctors,
  setDoctors,
  setMode,
  setSubmitted,
}) => {
  const [selectedDoctors, setSelectedDoctors] = useState(null);
  const [deleteDoctorDialog, setDeleteDoctorDialog] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  const dt = useRef(null);

  const editDoctor = (doctor) => {
    setDoctor({...doctor});
    setMode('UPDATE');
    setDoctorDialog(true);
  }

  const confirmDeleteDoctor = (appointment) => {
    setDoctor(appointment);
    setDeleteDoctorDialog(true);
  }

  const hideDeleteDoctorDialog = () => {
    setDeleteDoctorDialog(false);
  }

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button icon='pi pi-pencil' className='p-button-rounded p-button-success mr-2' onClick={() => editDoctor(rowData)} />
        <Button icon='pi pi-trash' className='p-button-rounded p-button-warning' onClick={() => confirmDeleteDoctor(rowData)} />
      </React.Fragment>
    );
  }

  const deleteDoctor = async () => {
    let _doctors = doctors.filter(val => val.cod_doctor !== doctor.cod_doctor);
    const doctorService = new DoctorService();
    const { error, data } = await doctorService.delete(doctor.cod_doctor);
    if (error) {
      toast.current.show({ severity: 'error', summary: 'Error deleting doctor', detail: 'Deleted failed', life: 3000 });
      return;
    }

    setDoctors([...(parseDoctors([data])), ..._doctors]);
    setDeleteDoctorDialog(false);
    setDoctor(emptyDoctor);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Doctor Deleted', life: 3000 });
  }

  const openNew = () => {
    setDoctor(emptyDoctor);
    setSubmitted(false);
    setMode('CREATE');
    setDoctorDialog(true);
  }

  const header = (
    <div className='table-header'>
      <h2 className='mx-0 my-1'>Lista de médicos</h2>
      <span className='p-input-icon-left'>
        <i className='pi pi-search' />
        <InputText type='search' onInput={(e) => setGlobalFilter(e.target.value || ' ')} placeholder='Search...' />
        <Button label='New' icon='pi pi-plus' className='white new-button' onClick={openNew} />
      </span>
    </div>
  );

  const deleteDoctorDialogFooter = (
    <React.Fragment>
      <Button label='No' icon='pi pi-times' className='p-button-text' onClick={hideDeleteDoctorDialog} />
      <Button label='Si' icon='pi pi-check' className='p-button-text' onClick={deleteDoctor} />
    </React.Fragment>
  );

  return (
    <div className='doctor-datatable'>
      <Toast ref={toast} />

      <div className='card'>
        <DataTable ref={dt} value={doctors} selection={selectedDoctors} onSelectionChange={(e) => setSelectedDoctors(e.value)}
          dataKey='cod_solicitud' paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
          currentPageReportTemplate='Showing {first} to {last} of {totalRecords} appointments'
          globalFilter={globalFilter} header={header} responsiveLayout='scroll'>

          <Column field='cod_doctor' header='Código' sortable style={{ minWidth: '4rem' }} />
          <Column field='username' header='Username' sortable style={{ minWidth: '8rem' }} />
          <Column field='nombres' header='Nombre' sortable style={{ minWidth: '8rem' }} />
          <Column field='ape_paterno' header='Apellido' sortable style={{ minWidth: '4rem' }} />
          <Column field='num_documento' header='N° Documento' sortable style={{ minWidth: '8rem' }} />
          <Column field='especialidad' header='Especialidad' sortable style={{ minWidth: '4rem' }} />
          <Column field='atencion' header='Atencion' sortable style={{ minWidth: '8rem' }} />
          <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }} />
        </DataTable>
      </div>

      <Dialog visible={deleteDoctorDialog} style={{ width: '450px' }} header='Confirm' modal footer={deleteDoctorDialogFooter} onHide={hideDeleteDoctorDialog}>
        <div className='confirmation-content'>
          <i className='pi pi-exclamation-triangle mr-3' style={{ fontSize: '2rem'}} />
          {doctor && <span>¿Estas seguro de eliminar el doctor: <b>{doctor.nombres} {doctor.ape_paterno}</b>?</span>}
        </div>
      </Dialog>
    </div>
  );
}

export default DoctorTable;
