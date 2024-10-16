import React, { useState } from 'react';
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, PointElement, ScatterController, Tooltip, Legend, Title, LinearScale } from 'chart.js';

// Register the required components
ChartJS.register(PointElement, ScatterController, Tooltip, Legend, Title, LinearScale);

const ScatterPlot = ({ data = [] }) => { // Default to empty array if data is undefined
  const [selectedLocation, setSelectedLocation] = useState('All Location');
  const [timePeriod, setTimePeriod] = useState('Monthly');

  // Function to get formatted date for filtering
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (timePeriod === 'Monthly') {
      return `${date.getFullYear()}-${date.getMonth() + 1}`;
    } else { // Yearly
      return `${date.getFullYear()}`;
    }
  };

  // Check if data is available and is an array before filtering
  if (!Array.isArray(data)) {
    return <div>No data available to plot.</div>;
  }

  // Filter data by location and time period
  const filteredData = data
    .filter(item => selectedLocation === 'All Location' || item.location === selectedLocation)
    .map(item => ({
      ...item,
      formattedDate: formatDate(item.date),
    }));

  // Group data by the selected time period
  const groupedData = filteredData.reduce((acc, item) => {
    const key = item.formattedDate;
    if (!acc[key]) {
      acc[key] = { cases: 0, deaths: 0 };
    }
    acc[key].cases += item.cases;
    acc[key].deaths += item.deaths;
    return acc;
  }, {});

  // Prepare data for scatter plot
  const chartData = {
    datasets: [
      {
        label: `Deaths vs. Cases (${timePeriod})`,
        data: Object.entries(groupedData).map(([key, value]) => ({
          x: value.cases,
          y: value.deaths,
          label: key,
        })),
        backgroundColor: 'rgba(0, 123, 255, 0.5)', // Semi-transparent blue
        borderColor: 'rgba(0, 123, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Options for scatter plot
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: false, // Disable default title
      },
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `Cases: ${tooltipItem.raw.x}, Deaths: ${tooltipItem.raw.y}, Date: ${tooltipItem.raw.label}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Cases',
          font: {
            size: 16,
          },
        },
        ticks: {
          font: {
            size: 14,
          },
        },
      },
      y: {
        title: {
          display: true,
          text: 'Deaths',
          font: {
            size: 16,
          },
        },
        ticks: {
          font: {
            size: 14,
          },
        },
      },
    },
  };

  // Get unique locations for the filter dropdown
  const locations = ['All Location', ...new Set(data.map(item => item.location))];

  return (
    <div style={{ width: '80%', margin: '0 auto', textAlign: 'center' }}>
      {/* Chart title */}
      <h2 style={{ color: '#004080', marginBottom: '10px' }}>Plot of Dengue Deaths vs. Cases</h2>

      {/* Location filter */}
      <div style={{ marginBottom: '20px' }}>
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          style={{ padding: '8px', fontSize: '14px', color: '#000' }} // Blue text color
        >
          {locations.map(location => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>

      {/* Time period filter */}
      <div style={{ marginBottom: '20px' }}>
        <select
          value={timePeriod}
          onChange={(e) => setTimePeriod(e.target.value)}
          style={{ padding: '8px', fontSize: '14px', color: '#000' }} // Blue text color
        >
          <option value="Monthly">Monthly</option>
          <option value="Yearly">Yearly</option>
        </select>
      </div>

      {/* Scatter plot */}
      <Scatter data={chartData} options={options} />
    </div>
  );
};

export default ScatterPlot;
