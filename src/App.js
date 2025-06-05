import React, { useState, useEffect } from "react";
import "./App.css";
import { FaParking, FaCarSide } from "react-icons/fa";
import { GoArrowUp } from "react-icons/go";
import { ref, onValue, push } from "firebase/database";
import { database } from "./firebase";

// Komponen untuk menampilkan bintang rating sesuai rating yang diberikan
function StarRating({ rating }) {
  return (
    <>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            fontSize: "18px",
            color: star <= rating ? "#ffc107" : "#ccc",
            marginRight: "2px",
          }}
        >
          ★
        </span>
      ))}
    </>
  );
}

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

  const [feedbackText, setFeedbackText] = useState("");
  const [rating, setRating] = useState(0);
  const [feedbacks, setFeedbacks] = useState([]);

  // Realtime parking status
  useEffect(() => {
    const parkingRef = ref(database, "smart_parking");

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

  // Realtime feedback list
  useEffect(() => {
    const feedbackRef = ref(database, "feedbacks");

    return onValue(feedbackRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const feedbackList = Object.values(data);
        setFeedbacks(feedbackList.reverse()); // show newest first
      } else {
        setFeedbacks([]);
      }
    });
  }, []);

  // Format timestamp jadi string tanggal dan jam
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString(); // Contoh: "6/5/2025, 10:42:00 AM"
  };

  // Handle feedback submission
  const handleSubmitFeedback = async () => {
    if (!feedbackText.trim()) {
      alert("Please write some feedback.");
      return;
    }

    const feedbackRef = ref(database, "feedbacks");

    await push(feedbackRef, {
      username: "Anonymous", // bisa diganti jika ingin input username
      message: feedbackText,
      rating: rating,
      timestamp: Date.now(),
    });

    setFeedbackText("");
    setRating(0);
    alert("Feedback submitted!");
  };

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

      {/* SLOT PARKIR */}
      {activeTab === "slots" && (
        <>
          <div className="parking-lot">
            <ParkingSlot id="A2" isAvailable={true} />
            <ParkingSlot id="B2" isAvailable={true} />
            <ParkingSlot id="A1" isAvailable={!parkingData.spot1} />
            <ParkingSlot id="B1" isAvailable={!parkingData.spot2} />
          </div>

          <div className="entrance">
            <div className="entrance-icon">
              <GoArrowUp size={40} />
            </div>
            <p>Entrance</p>
          </div>

          <div className="legend">
            <div className="legend-item">
              <div
                className="legend-color"
                style={{ backgroundColor: "#d3f8d3" }}
              ></div>
              <span>Available</span>
            </div>
            <div className="legend-item">
              <div
                className="legend-color"
                style={{ backgroundColor: "#f8d3d3" }}
              ></div>
              <span>Unavailable</span>
            </div>
          </div>
        </>
      )}

      {/* FEEDBACK FORM */}
      {activeTab === "feedback" && (
        <div className="feedback-content">
          <h2>Feedback Form</h2>

          <textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Write your feedback here..."
            rows={6}
            style={{ width: "100%", padding: "10px", fontSize: "16px" }}
          />

          <div className="rating" style={{ marginTop: "8px" }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setRating(star)}
                style={{
                  cursor: "pointer",
                  fontSize: "24px",
                  color: star <= rating ? "#ffc107" : "#ccc",
                }}
              >
                ★
              </span>
            ))}
          </div>

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
            onClick={handleSubmitFeedback}
          >
            Submit
          </button>

          {/* Feedback List */}
          <div style={{ marginTop: "30px" }}>
            <h3>User Feedback</h3>
            {feedbacks.length === 0 && <p>No feedback yet.</p>}
            {feedbacks.map((fb, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: "white",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  borderRadius: "8px",
                  padding: "15px 20px",
                  marginBottom: "15px",
                }}
              >
                <p style={{ margin: 0, fontWeight: "600" }}>
                  <strong>{fb.username}</strong>: {fb.message}
                </p>
                <p
                  style={{
                    margin: "6px 0 4px",
                    fontSize: "14px",
                    color: "#888",
                  }}
                >
                  <StarRating rating={fb.rating || 0} />
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "12px",
                    color: "#666",
                    fontStyle: "italic",
                  }}
                >
                  {fb.timestamp ? formatTimestamp(fb.timestamp) : ""}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
