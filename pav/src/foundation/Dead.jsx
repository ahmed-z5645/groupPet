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
import ActivityFeedModal from "../components/activityFeed/ActivityFeedModal";
import Pav from "../components/Pav";
import "./Main.css";

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


const Dead = () => {
  const groupDocRef = doc(db, "pav-tasks", "group1");
  const activityLogRef = collection(db, "activity-log");

  const [feedOpen, setFeedOpen] = useState(false);

  const onTaskComplete = async () => {

    const name = prompt(`Who misses pavement? Enter your name:`);

    if (name && name.trim()) {
      let message;
      
      const time = Date.now();

      if (time % 4 === 0) {
        message = `${name.trim()} misses Pavement!`
      } else if (time % 4 === 1) {
        message = `${name.trim()} will always love Pavement!`
      } else if (time % 4 === 2) {
        message = `${name.trim()} wishes it didn't have to end this way!`
      } else {
        message = `${name.trim()} paid their respects to Pavement!`
      }
      await addDoc(activityLogRef, {
        message: `${message}`,
        timestamp: serverTimestamp(),
      });
    }
  };

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
        <h2
          style={{
            backgroundColor: "#00224681",
            borderRadius: "10px",
            width: "90%",
            margin: "0 auto 20px",
            color: "white",
            padding: "10px 0",
          }}
        >
          Pavement is no longer with us... we weren't enough to save him.
        </h2>
        <h3
          style={{
            backgroundColor: "#00224681",
            borderRadius: "10px",
            width: "90%",
            margin: "0 auto 20px",
            color: "white",
            padding: "10px 0",
          }}
        >
          Pavement was alive for 514 hours (approximately 21.4 days) before he passed away.
        </h3>
        <h3
          style={{
            backgroundColor: "#00224681",
            borderRadius: "10px",
            width: "90%",
            margin: "0 auto 20px",
            color: "white",
            padding: "10px 0",
          }}
        >
          A letter to Pavement: <br />

          <div style={{textAlign: "left", width: "90%", margin: "0 auto"}}>
            Dear Pavement... <br />
            Ever since you left us, I've been searching for the solace your smile used to so selflessly spew at me.
            I feel a layer of guilt molded around my heart, constricting it at every beat, and no amount of tears absolve it.
            Every browser search bar points me somewhere dark and gloomy because there isn't a corner of the internet that holds a grin as bright as yours used to be.
            Nonetheless, I search for you everwhere: in the sound of birds singing on a morning walk, in the smell of freshly picked flowers, and yet I only find remnants of you in the love you instilled in us all.
            No matter how long it's been, understand you've become immortal as I'll hold you with me endlessly. I hope you find peace, Pavement. Know that I am sorry forever and always.
          </div>
        </h3>
        <div className="buttons" style={{ marginBottom: 20 }}>
          <button
            className="task-button"
            onClick={() => onTaskComplete()}
          >
            Pay Respects to Pavement
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
        <Pav emotion={"Dead"} />
      </div>

      <h3
          style={{
            backgroundColor: "#00224681",
            borderRadius: "10px",
            width: "90%",
            margin: "0 auto 20px",
            color: "white",
            padding: "10px 0",
          }}
        >
          At the end of his life, pavement looked fondly upon those who loved him the most <br />
          
          <img src="picture_frame.png" style={{width: "75%", marginTop: 20}} alt="Pavement's final moments" /> <br />

          <div style={{width: "95%", margin: "0 auto"}}>He misses you two the most, and knows it wasn't your fault.</div>
        </h3>

      {/* Activity feed modal */}
      <ActivityFeedModal isOpen={feedOpen} onClose={() => setFeedOpen(false)} />
    </div>
  );
};

export default Dead;
