
import React, { useState, useEffect, useRef, useContext } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { AppointmentService } from '../../services/AppointmentService';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';

import './AppointmentTable.css';
import { UserContext } from '../../context/UserContext';

const AppointmentTable = () => {
  let emptyAppointment = {
    cod_solicitud: '',
    cod_usuario: '',
    cod_estado: '',

    descripcion: '',

    cod_tipo_atencion: '',
    cod_tipo_servicio: '',
    cod_modalidad: '',
    cod_plan: '',
    cod_iafa: '',

    fecha_programacion: '',
    fecha_autorizacion: '',
    hora_programacion: '',
    numero_autorizacion: '',
    sintomas: '',
    diagnostico: '',

    cod_paciente: '',
    nombres: '',
    apellido: '',

    edad: '',

    cod_tipo_doc: '',
    num_documento: '',
    departamento: '',
    provincia: '',
    distrito: '',
    direccion: '',
    email: '',
    telefono1: '',
  };

  const [appointments, setAppointments] = useState(null);
  const [appointmentDialog, setAppointmentDialog] = useState(false);
  const [deleteAppointmentDialog, setDeleteAppointmentDialog] = useState(false);
  const [appointment, setAppointment] = useState(emptyAppointment);
  const [selectedAppointments, setSelectedAppointments] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  const appointmentService = new AppointmentService();
  const { user } = useContext(UserContext);

  useEffect(() => {
    appointmentService.getAppointmentsBy(user.cod_usuario)
      .then(res => setAppointments(res.data))
      .catch(err => {
        console.error(err);
        setAppointments([]);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const hideDeleteAppointmentDialog = () => {
    setDeleteAppointmentDialog(false);
  }

  const editAppointment = (appointment) => {
    setAppointment({...appointment});
    setAppointmentDialog(true);
  }

  const deleteappointment = () => {
    let _appointments = appointments.filter(val => val.id !== appointment.id);
    setAppointments(_appointments);
    setDeleteAppointmentDialog(false);
    setAppointment(emptyAppointment);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'appointment Deleted', life: 3000 });
  }

  const statusBodyTemplate = (rowData) => {
    return <span className={`appointment-badge status-${rowData.descripcion.toLowerCase()}`}>{rowData.descripcion}</span>;
  }

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button icon='pi pi-pencil' className='p-button-rounded p-button-success mr-2' onClick={() => editAppointment(rowData)} />
      </React.Fragment>
    );
  }

  const header = (
    <div className='table-header'>
      <h2 className='mx-0 my-1'>Ordenes de atencion</h2>
      <span className='p-input-icon-left'>
        <i className='pi pi-search' />
        <InputText type='search' onInput={(e) => setGlobalFilter(e.target.value)} placeholder='Search...' />
      </span>
    </div>
  );

  const deleteAppointmentDialogFooter = (
    <React.Fragment>
      <Button label='No' icon='pi pi-times' className='p-button-text' onClick={hideDeleteAppointmentDialog} />
      <Button label='Yes' icon='pi pi-check' className='p-button-text' onClick={deleteappointment} />
    </React.Fragment>
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

      

      <Dialog visible={deleteAppointmentDialog} style={{ width: '450px' }} header='Confirm' modal footer={deleteAppointmentDialogFooter} onHide={hideDeleteAppointmentDialog}>
        <div className='confirmation-content'>
          <i className='pi pi-exclamation-triangle mr-3' style={{ fontSize: '2rem'}} />
          {appointment && <span>Are you sure you want to delete <b>{appointment.name}</b>?</span>}
        </div>
      </Dialog>
    </div>
  );
}

export default AppointmentTable;
