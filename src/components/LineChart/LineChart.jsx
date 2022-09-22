import React from 'react';
import { Chart } from 'primereact/chart';

const LineChart = ({
  chartDisplay,
  chartData,
  title,
}) => {
  const getLightTheme = () => {
    let basicOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: '#495057',
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: '#495057',
          },
          grid: {
            color: '#ebedef',
          },
        },
        y: {
          ticks: {
            color: '#495057',
          },
          grid: {
            color: '#ebedef',
          },
        },
      },
    };

    return {
      basicOptions,
    };
  };

  const { basicOptions } = getLightTheme();

  return (
    chartDisplay && (
      <div>
        <div className="card">
          <h5>{ title || 'No encontrado' }</h5>
          <Chart type="line" data={chartData} options={basicOptions} />
        </div>
      </div>
    )
  );
};

export default LineChart;
