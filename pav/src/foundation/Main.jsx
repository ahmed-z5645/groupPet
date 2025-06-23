// Main.jsx
import React, { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  setDoc,
  collection,
  addDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { WalkGame, FeedGame, WaterGame } from "../components/minigames/Minigames";
import ActivityFeedModal from "../components/activityFeed/ActivityFeedModal";
import Pav from "../components/pav";
import "./Main.css";

function isTaskNearingNeglect(date) {
  if (!date) return true; // never done = neglected
  const lastTime = date.getTime ? date.getTime() : date;
  const elapsedHours = (Date.now() - lastTime) / (1000 * 60 * 60);
  return elapsedHours >= 18; // 24h - 6h = 18h
}

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#1a1a1a", // Dark mode background
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "#1a1a1a", // Modal content background
          borderRadius: 10,
          width: "90%",
          maxWidth: 450,
          maxHeight: "65vh", // Reduced height
          overflowY: "auto",
          padding: 20,
          position: "relative",
          color: "#f0f0f0", // Light text for contrast
          boxShadow: "0 0 12px rgba(0, 0, 0, 0.5)",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 15,
            right: 15,
            border: "none",
            background: "transparent",
            fontSize: 24,
            color: "#f0f0f0",
            cursor: "pointer",
            lineHeight: 1,
          }}
          aria-label="Close modal"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};


function timeLeft(date) {
  if (!date) return "24 hours left";
  const lastTime = date.getTime ? date.getTime() : date;
  const elapsedMs = Date.now() - lastTime;
  const remainingMs = 24 * 60 * 60 * 1000 - elapsedMs;

  if (remainingMs <= 0) return "Needs to be done!";

  const hours = Math.ceil(remainingMs / (60 * 60 * 1000));
  return `${hours} hour${hours !== 1 ? "s" : ""} left`;
}

const taskNames = {
  feedLastDone: "fed Pavement",
  waterLastDone: "changed Pavement's Water",
  walkLastDone: "taken Pavement for a walk",
};

const Main = () => {
  const groupDocRef = doc(db, "pav-tasks", "group1");
  const activityLogRef = collection(db, "activity-log");

  const [lastDone, setLastDone] = useState({
    feedLastDone: null,
    walkLastDone: null,
    waterLastDone: null,
  });
  const [loading, setLoading] = useState(true);
  const [currentTask, setCurrentTask] = useState(null);
  const [feedOpen, setFeedOpen] = useState(false);
  const [currEmote, setCurrEmote] = useState("Happy");

  useEffect(() => {
    async function fetchLastDone() {
      const snap = await getDoc(groupDocRef);
      if (snap.exists()) {
        setLastDone(snap.data());
      } else {
        await setDoc(groupDocRef, {
          feedLastDone: null,
          walkLastDone: null,
          waterLastDone: null,
        });
      }
      setLoading(false);
    }
    fetchLastDone();

  }, []);

  useEffect(() => {
    const isNeglected = Object.values(lastDone).some(
      (ts) => isTaskNearingNeglect(ts?.toDate?.() || ts)
    );

    setCurrEmote(isNeglected ? "Sad" : "Happy");
  }, [lastDone]);

  const onTaskComplete = async (task) => {
    // prevent multiple calls
    if (!task) return;

    setCurrentTask(null); // close modal first

    const name = prompt(`Who just ${taskNames[task]}? Enter your name:`);

    if (name && name.trim()) {
      await updateDoc(groupDocRef, {
        [task]: serverTimestamp(),
      });

      await addDoc(activityLogRef, {
        message: `${name.trim()} ${taskNames[task]}!`,
        timestamp: serverTimestamp(),
      });

      setLastDone((prev) => ({
        ...prev,
        [task]: new Date(),
      }));

      setCurrEmote("Happy");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div
      className="back"
    >
      <div style={{ paddingTop: 20, textAlign: "center" }}>
        <h1
          style={{
            backgroundColor: "#00224681",
            borderRadius: "10px",
            width: "90%",
            margin: "0 auto 20px",
            color: "white",
            padding: "10px 0",
          }}
        >
          Welcome Back to Pavement's House!
        </h1>
        <div className="buttons" style={{ marginBottom: 20 }}>
          <button
            className="task-button"
            onClick={() => setCurrentTask("feedLastDone")}
          >
            Feed Pavement <br />{" "}
            {lastDone.feedLastDone
              ? timeLeft(lastDone.feedLastDone?.toDate?.() || lastDone.feedLastDone)
              : "Never"}
          </button>
          <button
            className="task-button"
            onClick={() => setCurrentTask("waterLastDone")}
          >
            Change Pavement's Water <br />{" "}
            {lastDone.waterLastDone
              ? timeLeft(lastDone.waterLastDone?.toDate?.() || lastDone.waterLastDone)
              : "Never"}
          </button>
          <button
            className="task-button"
            onClick={() => setCurrentTask("walkLastDone")}
          >
            Take Pavevement for a Walk <br />{" "}
            {lastDone.walkLastDone
              ? timeLeft(lastDone.walkLastDone?.toDate?.() || lastDone.walkLastDone)
              : "Never"}
          </button>
        </div>
        <button
          style={{
            marginBottom: 15,
            background: "#007bff",
            color: "white",
            padding: "8px 12px",
            borderRadius: 5,
            border: "none",
            cursor: "pointer",
          }}
          onClick={() => setFeedOpen(true)}
        >
          Show Activity Feed
        </button>
      </div>

      <div style={{ width: "75vw", margin: "0 auto", marginTop: 20 }}>
        <Pav emotion={currEmote} />
      </div>

      {/* Mini-game modal */}
      <Modal
        isOpen={!!currentTask}
        onClose={() => setCurrentTask(null)}
        title={
          currentTask === "feedLastDone"
            ? "🐟 Feed Pav"
            : currentTask === "waterLastDone"
            ? "💧 Change Pav's Water"
            : "🚶 Take Pav for a Walk"
        }
      >
        {currentTask === "feedLastDone" && (
          <FeedGame onComplete={() => onTaskComplete("feedLastDone")} />
        )}
        {currentTask === "waterLastDone" && (
          <WaterGame onComplete={() => onTaskComplete("waterLastDone")} />
        )}
        {currentTask === "walkLastDone" && (
          <WalkGame onComplete={() => onTaskComplete("walkLastDone")} />
        )}
      </Modal>

      {/* Activity feed modal */}
      <ActivityFeedModal isOpen={feedOpen} onClose={() => setFeedOpen(false)} />
    </div>
  );
};

export default Main;
