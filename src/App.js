import React, { useState, useEffect } from "react";
import "./App.css";
import { FaParking, FaCarSide } from "react-icons/fa";
import {
  MdKeyboardDoubleArrowUp,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import { ref, onValue, push } from "firebase/database";
import { database } from "./firebase";
import { motion, AnimatePresence } from "framer-motion";

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
  const [prevAvailable, setPrevAvailable] = useState(isAvailable);
  const [exitAnimation, setExitAnimation] = useState(false);

  useEffect(() => {
    if (prevAvailable === false && isAvailable === true) {
      // Mobil keluar, mulai animasi keluar
      setExitAnimation(true);
      setTimeout(() => setExitAnimation(false), 800); // Durasi animasi 0.8 detik
    }
    setPrevAvailable(isAvailable);
  }, [isAvailable, prevAvailable]);

  const isLeft = id.startsWith("B"); // B1 & B2 ke kiri, A1 & A2 ke kanan

  return (
    <motion.div
      className="parking-slot"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`slot ${isAvailable ? "available" : "unavailable"}`}>
        {/* Hanya tampilkan mobil statis kalau tidak ada animasi keluar */}
        {!isAvailable && !exitAnimation && (
          <span className="car-icon">
            <FaCarSide size={28} />
          </span>
        )}

        {/* Animasi mobil keluar */}
        {exitAnimation && (
          <motion.span
            className="car-icon"
            initial={{ opacity: 1, x: 0 }}
            animate={{
              opacity: 0,
              x: isLeft ? -60 : 60,
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{
              position: "absolute",
              top: "30%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 10,
            }}
          >
            <FaCarSide size={28} />
          </motion.span>
        )}

        <div className="slot-id">{id}</div>
      </div>
    </motion.div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState("slots");
  const [parkingData, setParkingData] = useState({
    spot1: false,
    spot2: false,
    spot3: false,
    spot4: false,
  });
  const [feedbackText, setFeedbackText] = useState("");
  const [rating, setRating] = useState(0);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const parkingRef = ref(database, "smart_parking");
    const unsubscribe = onValue(parkingRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setParkingData({
          spot1: data.spot1,
          spot2: data.spot2,
          spot3: data.spot3,
          spot4: data.spot4,
        });
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const feedbackRef = ref(database, "feedbacks");
    return onValue(feedbackRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const feedbackList = Object.values(data);
        setFeedbacks(feedbackList.reverse());
      } else {
        setFeedbacks([]);
      }
    });
  }, []);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackText.trim()) {
      alert("Please write some feedback.");
      return;
    }
    const feedbackRef = ref(database, "feedbacks");
    await push(feedbackRef, {
      username: "Anonymous",
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
          Parking Slots <FaParking style={{ marginLeft: "10px" }} />
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
        <div style={{ textAlign: "center", color: "#555" }}>
          <MdKeyboardDoubleArrowRight size={36} />
          <p style={{ marginTop: "4px", fontWeight: "600" }}>Exit</p>
        </div>
      )}

      <AnimatePresence mode="wait">
        {activeTab === "slots" && (
          <motion.div
            key="slots"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div style={{ marginTop: "20px" }}></div>
            <div
              className="parking-lot"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "32px 72px",
                justifyItems: "center",
              }}
            >
              <ParkingSlot id="A2" isAvailable={!parkingData.spot2} />
              <ParkingSlot id="B2" isAvailable={!parkingData.spot4} />
              <ParkingSlot id="A1" isAvailable={!parkingData.spot1} />
              <ParkingSlot id="B1" isAvailable={!parkingData.spot3} />
            </div>

            <div className="entrance">
              <div className="entrance-icon">
                <MdKeyboardDoubleArrowUp size={40} />
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
          </motion.div>
        )}

        {activeTab === "feedback" && (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="feedback-content"
          >
            <h2>Feedback Form</h2>
            <textarea
              className="feedback-textarea"
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

            <button className="submit-feedback" onClick={handleSubmitFeedback}>
              Submit
            </button>

            <div style={{ marginTop: "30px" }}>
              <h3>User Feedback</h3>
              {feedbacks.length === 0 && <p>No feedback yet.</p>}
              {feedbacks.map((fb, index) => (
                <motion.div
                  key={index}
                  className="feedback-card"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <p className="feedback-username">
                    <strong>{fb.username}</strong>: {fb.message}
                  </p>
                  <p className="feedback-message">
                    <StarRating rating={fb.rating || 0} />
                  </p>
                  <p className="feedback-timestamp">
                    {fb.timestamp ? formatTimestamp(fb.timestamp) : ""}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
