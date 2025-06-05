import React, { useState, useEffect } from "react";
import "./App.css";
import { FaParking, FaCarSide } from "react-icons/fa";
import { GoArrowUp } from "react-icons/go";
import { database, ref, onValue } from "./firebase";

function ParkingSlot({ id, isAvailable }) {
  return (
    <div className="parking-slot">
      <div className={`slot ${isAvailable ? "available" : "unavailable"}`}>
        {!isAvailable && (
          <span className="car-icon">
            <FaCarSide size={28} />
          </span>
        )}
        <div className="slot-id">{id}</div>
      </div>
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState("slots");
  const [parkingData, setParkingData] = useState({
    spot1: false,
    spot2: false,
  });

  useEffect(() => {
    const parkingRef = ref(database, "smart_parking");

    // for realtime updates
    const unsubscribe = onValue(parkingRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setParkingData({
          spot1: data.spot1,
          spot2: data.spot2,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="app-container">
      <div className="header">
        <h1>
          Parking Slots
          <FaParking style={{ marginLeft: "10px" }} />
        </h1>
      </div>

      <div className="tab-buttons">
        <button
          className={activeTab === "slots" ? "active-tab" : ""}
          onClick={() => setActiveTab("slots")}
        >
          Slots
        </button>
        <button
          className={activeTab === "feedback" ? "active-tab" : ""}
          onClick={() => setActiveTab("feedback")}
        >
          Feedback
        </button>
      </div>

      {activeTab === "slots" && (
        <>
          <div className="parking-lot">
            {/* Mapping dari bawah ke atas karena entrance di bawah */}
            {/* 2 slot realtime dari Firebase */}
            <ParkingSlot id="A2" isAvailable={true} />
            <ParkingSlot id="B2" isAvailable={true} />

            {/* 2 slot dummy hardcoded */}
            <ParkingSlot id="A1" isAvailable={!parkingData.spot1} />
            <ParkingSlot id="B1" isAvailable={!parkingData.spot2} />
          </div>

          <div className="entrance">
            <div className="entrance-icon">
              <GoArrowUp size={40} />
            </div>
            <p>Entrance</p>
          </div>
        </>
      )}

      {activeTab === "feedback" && (
        <div className="feedback-content">
          <h2>Feedback Form</h2>
          <textarea
            placeholder="Write your feedback here..."
            rows={6}
            style={{ width: "100%", padding: "10px", fontSize: "16px" }}
          />
          <button
            className="submit-feedback"
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              backgroundColor: "#87ceeb",
              border: "none",
              borderRadius: "5px",
              color: "white",
              cursor: "pointer",
            }}
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
