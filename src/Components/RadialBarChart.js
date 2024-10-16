import React, { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import dayjs from 'dayjs'; // For date formatting and handling

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const RadialBarChart = ({ data }) => {
  const [filterType, setFilterType] = useState('yearly'); // State for monthly/yearly filter
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY')); // Default to the current year

  if (!data || data.length === 0) {
    return <p>No data available</p>; // Display message if no data
  }

  // Filter data by the selected date range (monthly or yearly)
  const filterDataByDate = (data, filterType, selectedDate) => {
    if (filterType === 'monthly') {
      // Filter data by the selected month (YYYY-MM format)
      return data.filter(item => dayjs(item.date).format('YYYY-MM') === selectedDate);
    } else {
      // Filter data by the selected year (YYYY format)
      return data.filter(item => dayjs(item.date).format('YYYY') === selectedDate);
    }
  };

  const filteredData = filterDataByDate(data, filterType, selectedDate);

  // Calculate total cases and deaths for the filtered data
  const totalCases = filteredData.reduce((acc, item) => acc + (item.cases || 0), 0);
  const totalDeaths = filteredData.reduce((acc, item) => acc + (item.deaths || 0), 0);

  const chartData = {
    labels: ['Cases', 'Deaths'],
    datasets: [
      {
        label: 'Dengue Data',
        data: [totalCases, totalDeaths],
        backgroundColor: ['rgba(0, 123, 255, 0.2)', 'rgba(0, 51, 102, 1)'], // Darker second blue
      borderColor: ['rgba(0, 123, 255, 1)', 'rgba(0, 51, 102, 1)'], // Darker second blue border
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ width: '50%', margin: '0 auto' }}>
      {/* Render the title of the chart */}
      <h3 style={{ textAlign: 'center' }}>
        Dengue Cases vs. Deaths ({filterType === 'monthly' ? dayjs(selectedDate).format('MMMM YYYY') : selectedDate})
      </h3>

      {/* Dropdown for filtering by Yearly or Monthly - Position it below the title and above the chart */}
      <div style={{ marginBottom: '20px', textAlign: 'center', marginTop: '10px' }}>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{ padding: '8px', marginRight: '10px' }}
        >
          <option value="yearly">Yearly</option>
          <option value="monthly">Monthly</option>
        </select>

        {/* Conditional input field: year input for yearly filter, month picker for monthly filter */}
        {filterType === 'monthly' ? (
          <input
            type="month"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ padding: '8px' }}
          />
        ) : (
          <input
            type="number"
            min="2000"
            max={dayjs().format('YYYY')}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ padding: '8px', width: '100px' }}
          />
        )}
      </div>

      {/* Render the Doughnut chart */}
      <Doughnut
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            title: {
              display: false, // Disable default title since we moved it
            },
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  return `${tooltipItem.label}: ${tooltipItem.raw}`;
                },
              },
            },
          },
        }}
      />
    </div>
  );
};

export default RadialBarChart;
