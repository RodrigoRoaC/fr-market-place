import React from 'react';
import { Steps } from 'primereact/steps';

const Stepper = ({
  interactive = false,
  items = [],
  activeIndex,
  setActiveIndex,
}) => {
  return (
    <Steps 
      model={items}
      activeIndex={activeIndex} 
      onSelect={(e) => setActiveIndex(e.index)}
      readOnly={!interactive}
    />
  )
}

export default Stepper;
