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

  // Limit lastPrices to last 4 entries
  const lastFourPrices = lastPrices.slice(-4);

  return (
    <div className="crop-stats-page">
      <main className="crop-stats-container">
        <div className="crop-stats-heading">
          <h2>Crop Statistics for {crop}</h2>
        </div>

        <div className="stats-layout">
          <div className="last-prices">
            <h3>Last 4 Weeks Prices</h3>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Retail Price</th>
                </tr>
              </thead>
              <tbody>
                {lastFourPrices.map((stat, index) => (
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
            <PriceComparisonGraph lastPrices={lastPrices} predictedPrices={predictedPrices} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CropStats;
