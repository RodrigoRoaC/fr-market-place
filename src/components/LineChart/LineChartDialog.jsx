import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { AutoComplete } from 'primereact/autocomplete';

import { Divider } from 'primereact/divider';
import { Dropdown } from 'primereact/dropdown';
import LineChart from './LineChart';
import { IndicatorService } from '../../services/Indicator/IndicatorService';

import './LineChart.css';
import { UserService } from '../../services/User/UserService';
import emptyIndicatorChart from '../../data/indicator-chart';

function LineChartDialog({ 
  toast,
  chartDialog, 
  setChartDialog, 
}) {
  const [lineForm, setLineForm] = useState({ cod_mae_indicator: '', cod_patient: '', nom_pat: '' });
  const [patients, setPatients] = useState(null);
  const [indicators, setIndicators] = useState(null);
  const [filteredPat, setFilteredPat] = useState(null);
  const [chartDisplay, setChartDisplay] = useState(false);
  
  const [title, setTitle] = useState('');
  const [chartData, setChartData] = useState({ ...emptyIndicatorChart });

  useEffect(() => {
    const userService = new UserService();
    const indicatorService = new IndicatorService();
    userService.getPatientCombo()
      .then(res => setPatients(res.data))
      .catch(err => setPatients([]));
    indicatorService.listComboMae()
      .then(res => setIndicators(res.data))
      .catch(err => setIndicators([]));
  }, []);

  const hideDialog = () => {
    setLineForm({ cod_mae_indicator: '', cod_patient: '', nom_pat: '' });
    setChartDialog(false);
  }

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _indicator = {...lineForm};
    _indicator[`${name}`] = val;

    setLineForm(_indicator);
  }

  const searchPatient = (event) => {
    setTimeout(() => {
      let _filteredPat;
      if (!event.query.trim().length) {
        _filteredPat = [...patients];
      }
      else {
        _filteredPat = filteredPat.filter((pat) => pat.label.toLowerCase().startsWith(event.query.toLowerCase()));
      }

      setFilteredPat(_filteredPat);
    }, 250);
  }

  const onPatDownChange = (e, name) => {
    if (e.value) {
      let _lineForm = {...lineForm};
      _lineForm[`${name}`] = e.value;
      setLineForm(_lineForm);
      setChartDisplay(false);
    }
  }

  const setReport = async () => {
    const indicatorService = new IndicatorService();
    const { error, data } = await indicatorService.patientResults(lineForm);
    if (error) {
      toast.current.show({ severity: 'error', summary: 'Results Error', detail: 'Error al mostrar el gráfico', life: 3000 });
      setChartData({ ...emptyIndicatorChart });
      setChartDisplay(false);
      return;
    }

    setChartData({
      labels: data.labels || [],
      datasets: [
        {
          label: data.dataSetLabel || '',
          data: data.dataSets || [],
          fill: false,
          borderColor: '#42A5F5',
          tension: 0.4,
        },
      ],
    });
    setTitle(data.dataSetLabel);
    setChartDisplay(true);
  }

  const onSelectPatient = (e) => {
    let _lineForm = {...lineForm};
    _lineForm[`cod_patient`] = e.value.value;
    _lineForm[`nom_pat`] = e.value.label;
    setLineForm(_lineForm);
    setChartDisplay(false);
  }

  const genericDialogFooter = (
    <React.Fragment>
      <Button label='Cancelar' icon='pi pi-times' className='p-button-text' onClick={hideDialog} />
    </React.Fragment>
  );

  return (
    <Dialog position='top' visible={chartDialog} style={{ width: '50vw'}} header='Resultados' modal className='p-fluid' footer={genericDialogFooter} onHide={hideDialog}>
      <div className='div-form-table'>
          <Divider align="left">
            <div className="inline-flex align-items-center">
                <b>Filtro</b>
            </div>
          </Divider>
          <div className='group-form-line-chart'>
            <div className='nombre field'>
              <label htmlFor='nombres'>Paciente</label>
              <AutoComplete dropdown field='label' value={lineForm.nom_pat} suggestions={filteredPat} completeMethod={searchPatient} onChange={(e) => onPatDownChange(e, 'nom_pat')} onSelect={onSelectPatient} aria-label='Paciente'/>
            </div>
            <div className='indicator field'>
              <label htmlFor='ranmin'>Indicador</label>
              <Dropdown optionLabel='label' optionValue='value' value={lineForm.cod_mae_indicator} options={indicators} onChange={(e) => onInputChange(e, 'cod_mae_indicator')} placeholder='Seleccionar indicador' />
            </div>
            <div className='btnsearch field'>
              <label htmlFor='' className='send-link'>A</label>
              <Button label='Buscar' icon='pi pi-search' onClick={setReport} />
            </div>
          </div>
          <Divider align="left">
            <div className="inline-flex align-items-center">
                <b>Reporte</b>
            </div>
          </Divider>
          <LineChart 
            chartDisplay = {chartDisplay} 
            chartData = {chartData} 
            title = {title}
          />
      </div>
    </Dialog>
  )
}

export default LineChartDialog;
