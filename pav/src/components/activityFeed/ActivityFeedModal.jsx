import React, { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

const ActivityFeedModal = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (!isOpen) return;

    const q = query(collection(db, "activity-log"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#1a1a1a", // dark background
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "#1a1a1a",
          color: "#000000",
          padding: 20,
          borderRadius: 10,
          width: "90%",
          maxWidth: 450,
          maxHeight: "65vh",
          overflowY: "auto",
          position: "relative",
          boxShadow: "0 0 12px rgba(0, 0, 0, 0.5)",
        }}
      >
        <h2 style={{ marginTop: 0 }}>🗒️ Activity Feed</h2>
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
          }}
        >
          ×
        </button>
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h2>Activity Feed</h2>
                <button style={styles.closeBtn} onClick={onClose}>Close</button>
                <div style={styles.feed}>
                {logs.length === 0 && <p>No activity yet.</p>}
                {logs.map(log => (
                    <p key={log.id} style={{ marginBottom: 6 }}>
                    {log.message}{" "}
                    <small style={{ color: "#666" }}>
                        {log.timestamp?.toDate?.().toLocaleString() || ""}
                    </small>
                    </p>
                ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    background: "white",
    padding: 20,
    borderRadius: 8,
    width: "90%",
    maxWidth: 400,
    maxHeight: "80vh",
    overflowY: "auto",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
    position: "relative",
  },
  closeBtn: {
    position: "absolute",
    right: 10,
    top: 10,
    background: "transparent",
    border: "none",
    fontSize: 18,
    cursor: "pointer",
    color: "#000000"
  },
  feed: {
    marginTop: 40,
    textAlign: "left",
  },
};

export default ActivityFeedModal;
