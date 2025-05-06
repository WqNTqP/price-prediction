import React from "react";
import '../Prediction.css';

const PredictionResults = ({ results, crop, date }) => {
  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  return (
    <div className="prediction-results-page">

      <main className="prediction-results">
        <h2>Prediction Results for {crop}</h2>
        <table>
          <thead>
            <tr>
              <th>Week</th>
              <th>Starting Date</th>
              <th>Retail Price Prediction</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td>Week {result.week}</td>
                  <td>{formatDate(result.date)}</td>
                  <td>₱{parseFloat(result.retail_prediction).toFixed(2)}</td>
                </tr>
                <tr className="separator-row">
                  <td colSpan="3"></td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </main>

    </div>
  );
};

export default PredictionResults;
