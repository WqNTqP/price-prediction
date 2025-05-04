// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import PredictionForm from "./components/PredictionForm";
import PredictionResults from "./components/PredictionResults";
import Dashboard from "./components/Dashboard";
import CropStats from "./components/CropStats"; // Import the new CropStats component
import { getPrediction } from "./services/api";
import background from './assets/background.jpg';
import './components/Navbar.css';

function App() {
  const [results, setResults] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const handlePrediction = async (commodity, weekNumber, startOfWeek) => {
    try {
      const prediction = await getPrediction(commodity, weekNumber);
      console.log("API Response:", prediction);
      const weeksWithDates = prediction.map((result, index) => {
        const weekStartDate = new Date(startOfWeek);
        weekStartDate.setDate(weekStartDate.getDate() + index * 7);
        return {
          ...result,
          date: weekStartDate,
        };
      });
      setResults(weeksWithDates);
      setSelectedCrop(commodity);
      setSelectedDate(startOfWeek);
    } catch (error) {
      alert("Failed to fetch prediction. Check console for details.");
      console.error(error);
    }
  };

  return (
    <Router>
      <div
        className="container App"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          color: "#333",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <nav className="navbar">
          <div className="navbar-brand">Price Prediction Web</div>
          <ul className="navbar-links">
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/prediction">Prediction</Link></li>
            <li><a href="#about">About</a></li>
          </ul>
        </nav>
        <main className="flex-container">
          <Routes>
            <Route
              path="/"
              element={
                <div className="column">
                  <Dashboard /> {/* Set Dashboard as the default component */}
                </div>
              }
            />
            <Route
              path="/prediction"
              element={
                <div className="column">
                  <PredictionForm onSubmit={handlePrediction} />
                  {results && (
                    <PredictionResults
                      results={results}
                      crop={selectedCrop}
                      date={selectedDate}
                    />
                  )}
                </div>
              }
            />
            <Route path="/crop-stats" element={<CropStats />} />{" "}
            {/* Add route for CropStats */}
          </Routes>
        </main>
        <footer className="app-footer">
          <p>© 2025 Price Prediction Web. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
