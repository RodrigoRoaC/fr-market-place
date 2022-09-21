
import React, { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

import './IndicatorTable.css';

const IndicatorGenericTable = ({
  toast,
  setIndicatorDialog,
  setIndicator,
  indicators,
  setSubmitted,
  emptyIndicator,
}) => {
  const [selectedIndicator, setSelectedIndicators] = useState(null);
  const [globalFilter, setGlobalFilter] = useState('');

  const dt = useRef(null);

  const openNew = () => {
    setIndicator(emptyIndicator);
    setSubmitted(false);
    setIndicatorDialog(true);
  }

  const editIndicator = (appointment) => {
    setIndicator({...appointment});
    setIndicatorDialog(true);
  }

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button icon='pi pi-pencil' className='p-button-rounded p-button-success mr-2' onClick={() => editIndicator(rowData)} />
      </React.Fragment>
    );
  }

  const header = (
    <div className='table-header'>
      <h2 className='mx-0 my-1'>Indicador Genérico</h2>
      <div className='table-header-content'>
        <span className='p-input-icon-left'>
          <i className='pi pi-search' />
          <InputText type='search' onInput={(e) => setGlobalFilter(e.target.value || ' ')} placeholder='Search...' />
          <Button label='New' icon='pi pi-plus' className='white new-button' onClick={openNew} />
        </span>
      </div>
    </div>
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

          <Column field='cod_mae_indicator' header='Código' sortable style={{ minWidth: '4rem' }} />
          <Column field='descripcion' header='Nombre' sortable style={{ minWidth: '8rem' }} />
          <Column field='rango_minimo' header='Rango mínimo' sortable style={{ minWidth: '8rem' }} />
          <Column field='rango_maximo' header='Rango máximo' sortable style={{ minWidth: '8rem' }} />
          <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '4rem' }} />
        </DataTable>
      </div>
    </div>
  );
}

export default IndicatorGenericTable;
