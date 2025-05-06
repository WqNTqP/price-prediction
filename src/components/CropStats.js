import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getPrediction } from '../services/api';
import PriceComparisonGraph from './PriceComparisonGraph';
import '../CropStats.css';

const CropStats = () => {
  const [lastPrices, setLastPrices] = useState([]);
  const [predictedPrices, setPredictedPrices] = useState([]);
  const [error, setError] = useState(null);
  const queryParams = new URLSearchParams(window.location.search);
  const crop = queryParams.get('crop');

  useEffect(() => {
    const fetchCropStats = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/crop-stats?crop=${crop}`);
        setLastPrices(response.data);

        const today = new Date();
        const weekNumber = Math.ceil((today - new Date(today.getFullYear(), 0, 1)) / 604800000);
        const prediction = await getPrediction(crop, weekNumber);
        setPredictedPrices(prediction);
      } catch (err) {
        setError(err.message);
      }
    };

    if (crop) {
      fetchCropStats();
    }
  }, [crop]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Calculate start of the current week (Sunday)
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (Sun) to 6 (Sat)
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - dayOfWeek);
  startOfWeek.setHours(0, 0, 0, 0);

  // Filter lastPrices to only include dates from startOfWeek to today
  const filteredPrices = lastPrices.filter(stat => {
    const statDate = new Date(stat.Date);
    return statDate >= startOfWeek && statDate <= today;
  });

  // Format dates for label
  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }).format(date);
  };

  const labelStartDate = formatDate(startOfWeek);
  const labelEndDate = formatDate(today);

  return (
    <div className="crop-stats-page">
      <main className="crop-stats-container">
        <div className="crop-stats-heading">
          <h2>Crop Statistics for {crop}</h2>
        </div>

        <div className="stats-layout">
          <div className="last-prices">
            <h3>Prices for Week of {labelStartDate} to {labelEndDate}</h3>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Retail Price</th>
                </tr>
              </thead>
              <tbody>
                {filteredPrices.map((stat, index) => (
                  <tr key={index}>
                    <td>{new Date(stat.Date).toLocaleDateString()}</td>
                    <td>₱{stat.Retail}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3>Predicted Prices for Next 4 Weeks</h3>
            <table>
              <thead>
                <tr>
                  <th>Week</th>
                  <th>Predicted Retail Price</th>
                </tr>
              </thead>
              <tbody>
                {predictedPrices.map((prediction, index) => (
                  <tr key={index}>
                    <td>Week {prediction.week}</td>
                    <td>₱{parseFloat(prediction.retail_prediction).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="price-graph">
            <PriceComparisonGraph lastPrices={filteredPrices} predictedPrices={predictedPrices} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CropStats;
