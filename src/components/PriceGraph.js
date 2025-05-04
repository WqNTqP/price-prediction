import React, { useEffect, useRef } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import '../Prediction.css'; // Import the CSS file

// Register the components you are using
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PriceGraph = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    return () => {
      if (chartRef.current && chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }
    };
  }, [data]);

  const weeks = data.map(item => `Week ${item.week}`);
  const prices = data.map(item => parseFloat(item.retail_prediction));

  const chartData = {
    labels: weeks,
    datasets: [
      {
        label: "Retail Price",
        data: prices,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        pointBackgroundColor: "rgba(75,192,192,1)",
        pointBorderColor: "#fff",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `₱${tooltipItem.raw.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Weeks',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Price (₱)',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="price-graph-container">
      <h3>Price Trend</h3>
      {/* Comment out or remove the Line component to hide the graph */}
      {/* <Line ref={chartRef} data={chartData} options={chartOptions} /> */}
    </div>
  );
};

export default PriceGraph;