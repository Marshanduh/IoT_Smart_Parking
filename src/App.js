import React from "react";
import './App.css';

function ParkingSlot({ id, isAvailable }) {
  return (
    <div className="parking-slot">
      <div className={`slot ${isAvailable ? 'available' : 'unavailable'}`}>
        <span className="car-icon">🚗</span>
        <div className="slot-id">{id}</div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="app-container">
      <div className="header">
        <h1>Parking Slots</h1>
      </div>
      <div className="parking-lot">
        <ParkingSlot id="A2" isAvailable={false} />
        <ParkingSlot id="B3" isAvailable={true} />
        <ParkingSlot id="A1" isAvailable={false} />
        <ParkingSlot id="B4" isAvailable={true} />
      </div>
      <div className="entrance">
        <div className="entrance-icon">⮝</div>
        <p>Entrance</p>
      </div>
      <div className="footer">
        <button className="slot-button">Slot</button>
        <button className="feedback-button">Feedback</button>
      </div>
    </div>
  );
}

export default App;
