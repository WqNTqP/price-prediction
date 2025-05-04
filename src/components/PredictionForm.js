import React, { useState, useEffect } from "react";
import '../Prediction.css'; 

const PredictionForm = ({ onSubmit }) => {
  const [commodity, setCommodity] = useState("Gabi"); // Default commodity
  const [date, setDate] = useState(""); // State for date
  const [error, setError] = useState("");
  const [showGraph, setShowGraph] = useState(false); // State to manage graph visibility
  const [results, setResults] = useState(null); // Store prediction results

  // Effect to set the default date to the current date in Manila timezone
  useEffect(() => {
    const manilaTime = new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" });
    const currentDate = new Date(manilaTime).toISOString().split("T")[0]; // Format to YYYY-MM-DD
    setDate(currentDate); // Set the default date
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date) {
      setError("Please select a valid date.");
      return;
    }
    setError("");
  
    const selectedDate = new Date(date);
    const { weekNumber, startOfWeek } = getWeekInfo(selectedDate);
  
    onSubmit(commodity, weekNumber, startOfWeek).then((prediction) => {
      setResults(prediction);
      setShowGraph(true);
      console.log("Setting results:", prediction);
    });
  };

  const getWeekInfo = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const daysSinceYearStart = Math.floor((date - firstDayOfYear) / 86400000);
    const weekNumber = Math.ceil((daysSinceYearStart + firstDayOfYear.getDay() + 1) / 7);
    const startOfWeek = new Date(date);
    const dayOfWeek = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek + 1);
    return { weekNumber, startOfWeek };
  };

  return (
    <div className="prediction-form">
      <form onSubmit={handleSubmit}>
        <label>
          Select Crop:
          <select value={commodity} onChange={(e) => setCommodity(e.target.value)}>
            <option value="Gabi">Gabi</option>
            <option value="Kamote">Kamote</option>
            <option value="Karlang">Karlang</option>
            <option value="Cassava">Cassava</option>
          </select>
        </label>
        <label>
          Select Date:
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <button type="submit">Predict Prices</button>
      </form>
      
      {error && <p className="error-message">{error}</p>}
      
      {showGraph && results && (
        <div className="crop-card"> {/* Card container */}
          <h3>Prediction Results for {commodity}</h3>
          <table>
            <thead>
              <tr>
                <th>Week</th>
                <th>Starting Date</th>
                <th>Retail Price Prediction</th>
              </tr>
            </thead>
            <tbody>
              {results.map((prediction) => (
                <tr key={prediction.week}>
                  <td>Week {prediction.week}</td>
                  <td>{new Date(prediction.startOfWeek).toLocaleDateString()}</td>
                  <td>{prediction.retail_prediction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PredictionForm;