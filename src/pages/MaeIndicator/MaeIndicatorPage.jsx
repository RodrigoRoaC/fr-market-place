import React, { useEffect, useRef, useState } from 'react'
import GenericForm from '../../components/IndicatorForm/GenericForm';
import IndicatorGenericTable from '../../components/IndicatorTable/GenericTable';

import emptyGenericIndicator from '../../data/indicator-generic';
import { IndicatorService } from '../../services/Indicator/IndicatorService';

const MaeIndicatorPage = () => {
  const toast = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const [indicator, setIndicator] = useState({});
  const [indicators, setIndicators] = useState(null);
  const [indicatorDialog, setIndicatorDialog] = useState(null);
  
  const indicatorService = new IndicatorService();

  useEffect(() => {
    indicatorService.listMae()
      .then(res => setIndicators(res.data))
      .catch(err => {
        console.error(err);
        setIndicators([]);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className='wrapper'>
      <IndicatorGenericTable
        toast = {toast}
        setIndicatorDialog = {setIndicatorDialog}
        setIndicator = {setIndicator}
        indicators = {indicators}
        setSubmitted = {setSubmitted}
        emptyIndicator = {emptyGenericIndicator}
      />
      <GenericForm
        toast = {toast}
        indicatorDialog = {indicatorDialog}
        indicator = {indicator}
        setIndicatorDialog = {setIndicatorDialog}
        submitted = {submitted}
        setSubmitted = {setSubmitted}
        setIndicator = {setIndicator}
        indicators = {indicators}
        setIndicators = {setIndicators}
        emptyIndicator = {emptyGenericIndicator}
      />
    </div>
  )
}

export default MaeIndicatorPage;
