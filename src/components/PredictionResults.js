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
      <header className="dashboard-header">
        <h1>Price Prediction Web</h1>
        <nav className="dashboard-nav">
          <a href="/">Dashboard</a>
          <a href="/prediction">Prediction</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          <a href="/privacy">Privacy Policy</a>
        </nav>
      </header>

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

      <footer className="dashboard-footer">
        <p>© 2024 Price Prediction Web. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PredictionResults;
