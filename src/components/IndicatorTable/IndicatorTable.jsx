
import React, { useState, useRef, useContext } from 'react';
import * as XLSX from 'xlsx';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { FileUpload } from 'primereact/fileupload';

import './IndicatorTable.css';
import { Dialog } from 'primereact/dialog';
import emptyIndicator from '../../data/indicator';
import { IndicatorService } from '../../services/Indicator/IndicatorService';
import { fileToBuffer } from '../../utils/converter';
import { UserContext } from '../../context/UserContext';

const IndicatorTable = ({
  toast,
  setIndicatorDialog,
  indicator,
  setIndicator,
  indicators,
  setIndicators,
  reload,
  setReload,
  setChartDialog,
}) => {
  const { user } = useContext(UserContext);
  const [selectedIndicator, setSelectedIndicators] = useState(null);
  const [deletePaymentDialog, setDeleteIndicatorDialog] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');

  const dt = useRef(null);

  const editIndicator = (appointment) => {
    setIndicator({...appointment});
    setIndicatorDialog(true);
  }

  const confirmDeleteIndicator = (appointment) => {
    setIndicator(appointment);
    setDeleteIndicatorDialog(true);
  }

  const hideDeleteIndicatorDialog = () => {
    setDeleteIndicatorDialog(false);
  }

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button icon='pi pi-pencil' className='p-button-rounded p-button-success mr-2' onClick={() => editIndicator(rowData)} />
        <Button icon='pi pi-trash' className='p-button-rounded p-button-warning' onClick={() => confirmDeleteIndicator(rowData)} />
      </React.Fragment>
    );
  }

  const deleteIndicator = async () => {
    let _indicators = indicators.filter(val => val.cod_indicator !== indicator.cod_indicator);
    const indicatorService = new IndicatorService();
    const { error } = await indicatorService.delete({ cod_indicator: indicator.cod_indicator });
    if (error) {
      toast.current.show({ severity: 'error', summary: 'Error deleting indicator', detail: 'Deleted failed', life: 3000 });
      return;
    }

    setIndicators(_indicators);
    setDeleteIndicatorDialog(false);
    setIndicator(emptyIndicator);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Payment Deleted', life: 3000 });
  }

  const onUpload = async (event) => {
    const file = event.files[0];
    const result = await fileToBuffer(file);
    const workBook = XLSX.read(result, { type: 'array' });
    const wsname = workBook.SheetNames[0];
    const ws = workBook.Sheets[wsname];
    const workBookToJSON = XLSX.utils.sheet_to_json(ws, { header: 1 });
    const indicatorService = new IndicatorService();
    const { error } = await indicatorService.upload({ file: workBookToJSON, cod_usuario: user.cod_usuario });
    if (error) {
      toast.current.show({ severity: 'error', summary: 'Upload error', detail: 'Error uploading file', life: 3000 });
      event.options.clear();
      return;
    }
    setReload(reload + 1);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Upload successfully', life: 3000 });
    event.options.clear();
  };

  const openChart = () => {
    setChartDialog(true);
  }

  const header = (
    <div className='table-header'>
      <h2 className='mx-0 my-1'>Indicadores</h2>
      <div className='table-header-content'>
        <span className='p-input-icon-left'>
          <i className='pi pi-search' />
          <InputText type='search' onInput={(e) => setGlobalFilter(e.target.value || ' ')} placeholder='Search...' />
        </span>
        <FileUpload 
          name = 'indicator' 
          chooseOptions = {{ label: 'Excel', icon: 'pi pi-file-excel', className: 'p-button-success' }} 
          auto = {true}
          mode = 'basic'
          customUpload 
          accept = '.xlsx'
          className = 'mr-2' 
          uploadHandler = {onUpload}
        />
        <Button label='Paciente' icon='pi pi-search' className='white new-button' onClick={openChart} />
      </div>
    </div>
  );

  const deleteIndicatorDialogFooter = (
    <React.Fragment>
      <Button label='No' icon='pi pi-times' className='p-button-text' onClick={hideDeleteIndicatorDialog} />
      <Button label='Si' icon='pi pi-check' className='p-button-text' onClick={deleteIndicator} />
    </React.Fragment>
  );

  return (
    <div className='appointment-datatable'>
      <Toast ref={toast} />

      <div className='card'>
        <DataTable ref={dt} value={indicators} selection={selectedIndicator} onSelectionChange={(e) => setSelectedIndicators(e.value)}
          dataKey='cod_solicitud' paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
          currentPageReportTemplate='Showing {first} to {last} of {totalRecords} appointments'
          globalFilter={globalFilter} header={header} responsiveLayout='scroll'>

          <Column field='cod_indicator' header='Código' sortable style={{ minWidth: '4rem' }} />
          <Column field='nombres_paciente' header='Paciente' sortable style={{ minWidth: '4rem' }} />
          <Column field='valor' header='Valor' sortable style={{ minWidth: '8rem' }} />
          <Column field='rango_minimo' header='Rango mínimo' sortable style={{ minWidth: '4rem' }} />
          <Column field='rango_maximo' header='Rango máximo' sortable style={{ minWidth: '8rem' }} />
          <Column field='fecha_atencion' header='Fecha Atencion' sortable style={{ minWidth: '8rem' }} />
          <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }} />
        </DataTable>
      </div>

      <Dialog visible={deletePaymentDialog} style={{ width: '450px' }} header='Confirm' modal footer={deleteIndicatorDialogFooter} onHide={hideDeleteIndicatorDialog}>
        <div className='confirmation-content'>
          <i className='pi pi-exclamation-triangle mr-3' style={{ fontSize: '2rem'}} />
          {indicator && <span>¿Estas seguro de eliminar el registro: <b>{indicator.cod_indicator}</b>?</span>}
        </div>
      </Dialog>
    </div>
  );
}

export default IndicatorTable;
