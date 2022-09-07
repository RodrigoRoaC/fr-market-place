import React, { useState, useEffect, useRef, useContext } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { RequestAppointmentService } from '../../../services/RequestAppointmentService';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';

import './RequestCrud.css';
import { UserContext } from '../../../context/UserContext';
import { parseAppointments } from '../../../utils/parser';
import { UbigeoService } from '../../../services/Ubigeo/UbigeoService';
import emptyAppointment from '../../../data/appointment';
import RequestForm from '../RequestForm/RequestForm';

const RequestCrud = () => {
  const [appointments, setAppointments] = useState(null);
  const [appointmentDialog, setAppointmentDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [deleteAppointmentDialog, setDeleteAppointmentDialog] = useState(false);
  const [appointment, setAppointment] = useState({...emptyAppointment});
  const [selectedAppointments, setSelectedAppointments] = useState(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const toast = useRef(null);
  const dt = useRef(null);
  
  const [tipoDocumento, setTipoDocumento] = useState(null);
  
  const [departamento, setDepartamento] = useState(null);
  const [provincia, setProvincia] = useState(null);
  const [distrito, setDistrito] = useState(null);
  
  const [tipoPlan, setTipoPlan] = useState(null);
  const [tipoPrograma, setTipoPrograma] = useState(null);
  const [tipoAtencion, setTipoAtencion] = useState(null);
  const [tipoModalidad, setTipoModalidad] = useState(null);
  const [tipoServicio, setTServicio] = useState(null);

  const reqAppointmentService = new RequestAppointmentService();
  const { user } = useContext(UserContext);

  useEffect(() => {
    reqAppointmentService.getAppointmentsBy(user.cod_usuario)
      .then(res => setAppointments(parseAppointments(res.data)))
      .catch(err => {
        console.error(err);
        setAppointments([]);
      });

    reqAppointmentService.getComboData()
      .then(({ data }) => {
        setTipoDocumento(data.tipoDocumento);
        setDepartamento(data.departamento);
        setTipoPlan(data.planesData);
        setTipoPrograma(data.iafaData);
        setTipoAtencion(data.atencionData);
        setTipoModalidad(data.modalidadData);
        setTServicio(data.servicioData);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const openNew = () => {
    setAppointment(emptyAppointment);
    setSubmitted(false);
    setAppointmentDialog(true);
  }

  const hideDeleteAppointmentDialog = () => {
    setDeleteAppointmentDialog(false);
  }

  const editAppointment = async (appointment) => {
    const ubigeoService = new UbigeoService();
    setAppointment({...appointment});
    if (appointment.departamento) {
      const { error, data: prov } = await ubigeoService.getProvincias(appointment.departamento);
      if (!error) {
        setProvincia(prov);
      }
    }
    if (appointment.departamento && appointment.provincia) {
      const { error, data: dis } = await ubigeoService.getDistritos(appointment.departamento, appointment.provincia);
      if (!error) {
        setDistrito(dis);
      }
    }
    setAppointmentDialog(true);
  }

  const confirmDeleteappointment = (appointment) => {
    setAppointment(appointment);
    setDeleteAppointmentDialog(true);
  }

  const deleteappointment = async () => {
    let _appointments = appointments.filter(val => val.cod_solicitud !== appointment.cod_solicitud);
    const { error } = await reqAppointmentService.delete({ cod_solicitud: appointment.cod_solicitud });
    if (error) {
      toast.current.show({ severity: 'error', summary: 'Error deleting appoinment', detail: 'Deleted failed', life: 3000 });
      return;
    }
    setAppointments(_appointments);
    setDeleteAppointmentDialog(false);
    setAppointment(emptyAppointment);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'appointment Deleted', life: 3000 });
  }

  const statusBodyTemplate = (rowData) => {
    return <span className={`appointment-badge status-${rowData.descripcion?.toLowerCase()}`}>{rowData.descripcion}</span>;
  }

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button icon='pi pi-pencil' className='p-button-rounded p-button-success mr-2' onClick={() => editAppointment(rowData)} />
        <Button icon='pi pi-trash' className='p-button-rounded p-button-warning' onClick={() => confirmDeleteappointment(rowData)} />
      </React.Fragment>
    );
  }

  const header = (
    <div className='table-header'>
      <h2 className='mx-0 my-1'>Ordenes de atencion</h2>
      <span className='p-input-icon-left'>
        <i className='pi pi-search' />
        <InputText type='search' onInput={(e) => setGlobalFilter(e.target.value || ' ')} placeholder='Search...' />
        <Button label='New' icon='pi pi-plus' className='white new-button' onClick={openNew} />
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
    <div className='datatable-appointment'>
      <Toast ref={toast} />

      <div className='card'>
        <DataTable ref={dt} value={appointments} selection={selectedAppointments} onSelectionChange={(e) => setSelectedAppointments(e.value)}
          dataKey='cod_solicitud' paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
          currentPageReportTemplate='Showing {first} to {last} of {totalRecords} appointments'
          globalFilter={globalFilter} header={header} responsiveLayout='scroll'>

          <Column field='cod_solicitud' header='Código' sortable style={{ minWidth: '4rem' }} />
          <Column field='num_documento' header='Documento' sortable style={{ minWidth: '4rem' }} />
          <Column field='nombres' header='Nombre' sortable style={{ minWidth: '8rem' }} />
          <Column field='ape_paterno' header='Apellido' sortable style={{ minWidth: '4rem' }} />
          <Column field='email' header='Correo' sortable style={{ minWidth: '8rem' }} />
          <Column field='telefono1' header='N° Telefono' sortable style={{ minWidth: '8rem' }} />
          <Column field='descripcion' header='Estado' body={statusBodyTemplate} sortable style={{ minWidth: '8rem' }} />
          <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }} />
        </DataTable>
      </div>

      <RequestForm 
        appointmentDialog = {appointmentDialog}
        setAppointmentDialog = {setAppointmentDialog}
        submitted = {submitted}
        setSubmitted = {setSubmitted}
        appointment = {appointment}
        setAppointment = {setAppointment}
        appointments = {appointments}
        setAppointments = {setAppointments}
        emptyAppointment = {emptyAppointment}
        toast = {toast}
        tipoDocumento = {tipoDocumento}
        departamento = {departamento}
        provincia = {provincia}
        setProvincia = {setProvincia}
        distrito = {distrito}
        setDistrito = {setDistrito}
        tipoPlan = {tipoPlan}
        tipoPrograma = {tipoPrograma}
        tipoAtencion = {tipoAtencion}
        tipoModalidad = {tipoModalidad}
        tipoServicio = {tipoServicio}
      />

      <Dialog visible={deleteAppointmentDialog} style={{ width: '450px' }} header='Confirm' modal footer={deleteAppointmentDialogFooter} onHide={hideDeleteAppointmentDialog}>
        <div className='confirmation-content'>
          <i className='pi pi-exclamation-triangle mr-3' style={{ fontSize: '2rem'}} />
          {appointment && <span>Are you sure you want to delete <b>{appointment.name}</b>?</span>}
        </div>
      </Dialog>
    </div>
  );
}

export default RequestCrud;
