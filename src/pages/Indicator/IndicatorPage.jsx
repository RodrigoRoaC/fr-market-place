import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react'
import IndicatorForm from '../../components/IndicatorForm/IndicatorForm';
import IndicatorTable from '../../components/IndicatorTable/IndicatorTable';
import LineChartDialog from '../../components/LineChart/LineChartDialog';
import emptyIndicator from '../../data/indicator';
import { IndicatorService } from '../../services/Indicator/IndicatorService';
import { parseIndicators } from '../../utils/parser';

const IndicatorPage = () => {
  const toast = useRef(null);
  const [reload, setReload] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [indicator, setIndicator] = useState({});
  const [indicators, setIndicators] = useState(null);
  const [indicatorDialog, setIndicatorDialog] = useState(false);
  const [chartDialog, setChartDialog] = useState(false);

  useEffect(() => {
    const indicatorService = new IndicatorService();
    indicatorService.list()
      .then(res => setIndicators(parseIndicators(res.data)))
      .catch(err => {
        console.error(err);
        setIndicators([]);
      });
  }, [reload]);

  return (
    <div className='wrapper'>
      <Toast ref={toast} />
      <IndicatorTable
        toast = {toast}
        setIndicatorDialog = {setIndicatorDialog}
        indicator = {indicator}
        setIndicator = {setIndicator}
        indicators = {indicators}
        setIndicators = {setIndicators}
        reload = {reload}
        setReload = {setReload}
        setChartDialog = {setChartDialog}
      />
      <LineChartDialog
        toast = {toast}
        chartDialog = {chartDialog}
        setChartDialog = {setChartDialog}
      />
      <IndicatorForm
        toast = {toast}
        indicatorDialog = {indicatorDialog}
        indicator = {indicator}
        setIndicatorDialog = {setIndicatorDialog}
        submitted = {submitted}
        setSubmitted = {setSubmitted}
        setIndicator = {setIndicator}
        indicators = {indicators}
        setIndicators = {setIndicators}
        emptyIndicator = {emptyIndicator}
      />
    </div>
  )
}

export default IndicatorPage;
