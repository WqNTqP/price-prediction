import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import cassavaImage from '../assets/cassava.png';
import gabiImage from '../assets/Gabi.png';
import kamoteImage from '../assets/kamote.png';
import karlangImage from '../assets/karlang.png';
// Removed arrow image imports
// import arrowUp from '../assets/arrowup.png';
// import arrowDown from '../assets/arrowdown.png';
import '../Dashboard.css';

const crops = ['Gabi', 'Kamote', 'Karlang', 'Cassava'];

const Dashboard = () => {
  const navigate = useNavigate();
  const [cropData, setCropData] = useState([]);

  useEffect(() => {
    const fetchCropStats = async () => {
      try {
        const promises = crops.map(async (crop) => {
          const response = await axios.get(`http://localhost:5000/crop-stats?crop=${crop}`);
          const lastPrices = response.data;

          const today = new Date();
          const weekNumber = Math.ceil((today - new Date(today.getFullYear(), 0, 1)) / 604800000);
          const predictionResponse = await axios.post(`http://localhost:5000/predict`, { commodity: crop, week: weekNumber });
          const predictedPrice = predictionResponse.data.predictions[0].retail_prediction;

          const lastPrice = lastPrices.length > 0 ? lastPrices[lastPrices.length - 1].Retail : null;

          return {
            crop,
            lastPrice,
            predictedPrice: parseFloat(predictedPrice),
            priceChange: lastPrice ? (parseFloat(predictedPrice) - lastPrice).toFixed(2) : null,
            trend: lastPrice ? (parseFloat(predictedPrice) > lastPrice ? 'up' : 'down') : null,
          };
        });

        const results = await Promise.all(promises);
        setCropData(results);
      } catch (error) {
        console.error("Error fetching crop stats:", error);
      }
    };

    fetchCropStats();
  }, []);

  const handleCropSelect = (crop) => {
    navigate(`/crop-stats?crop=${crop}`);
  };

  const handlePrediction = (crop) => {
    console.log(`Predicting prices for ${crop}`);
  };

  const UpArrow = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="green"
      viewBox="0 0 24 24"
      style={{ marginLeft: '8px' }}
    >
      <path d="M12 2l-8 8h6v8h4v-8h6z" />
    </svg>
  );

  const DownArrow = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="red"
      viewBox="0 0 24 24"
      style={{ marginLeft: '8px' }}
    >
      <path d="M12 22l8-8h-6v-8h-4v8h-6z" />
    </svg>
  );

  return (
    <div className="dashboard-container">
      <section className="dashboard-content">
        <h2>Dashboard</h2>
        <p>Welcome to the dashboard! Here you can view various statistics and insights.</p>

        <div className="crop-overview">
          {cropData.map(({ crop, lastPrice, predictedPrice, priceChange, trend }, index) => (
            <div key={index} className="crop-card" onClick={() => handleCropSelect(crop)} tabIndex={0} role="button" aria-pressed="false">
              <h3>{crop}</h3>
              <img
                src={
                  crop === 'Gabi'
                    ? gabiImage
                    : crop === 'Kamote'
                    ? kamoteImage
                    : crop === 'Karlang'
                    ? karlangImage
                    : cassavaImage
                }
                alt={crop}
              />
              <p>Last Price: {lastPrice ? `₱${lastPrice.toFixed(2)}` : 'N/A'}</p>
              <p>Predicted Price Next Week: {predictedPrice ? `₱${predictedPrice.toFixed(2)}` : 'N/A'}</p>
              {priceChange !== null && (
                <p className={`price-change ${trend === 'up' ? 'up' : 'down'}`}>
                  Price Change:
                  {trend === 'up' ? (
                    <UpArrow />
                  ) : (
                    <DownArrow />
                  )}
                  ₱{Math.abs(priceChange)}
                </p>
              )}
              <button className="predict-button" onClick={() => handlePrediction(crop)}>
                Predict Prices
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
