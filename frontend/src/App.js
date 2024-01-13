import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [login, setLogin] = useState(null);

  useEffect(() => {
    fetchLogin();
  }, []);

  const fetchLogin = async () => {
    try {
      const response = await axios.get("/api/random-login");
      setLogin(response.data);
    } catch (error) {
      console.error("Error fetching login:", error);
      alert("Failed to fetch login");
    }
  };

  const markAsUsed = async () => {
    try {
      await axios.post("/api/mark-used", { email: login.email });
      alert("Login marked as used");
      fetchLogin(); // Fetch next login
    } catch (error) {
      console.error("Error marking login as used:", error);
      alert("Failed to mark login as used");
    }
  };

  const calculateDaysAgo = (lastUsed) => {
    const [month, day] = lastUsed.split("-").map(Number);
    const lastUsedDate = new Date(new Date().getFullYear(), month - 1, day);
    const today = new Date();
    const differenceInTime = today.getTime() - lastUsedDate.getTime();
    const differenceInDays = Math.round(differenceInTime / (1000 * 3600 * 24));
    return differenceInDays;
  };

  const buttonStyle = {
    cursor: "pointer",
    padding: "10px 15px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    marginLeft: "10px",
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {login ? (
        <div style={{ marginBottom: "20px" }}>
          <p>
            <b>Email:</b> {login.email}
          </p>
          <p>
            <b>Password:</b> {login.password}
          </p>
          <p>
            <b>Last used:</b> {calculateDaysAgo(login.lastUsed)} days ago
          </p>
          <button onClick={fetchLogin} style={buttonStyle}>
            Get Another Account
          </button>
          <button onClick={markAsUsed} style={buttonStyle}>
            Mark as Used
          </button>
        </div>
      ) : (
        <p>Loading login information...</p>
      )}
    </div>
  );
}

export default App;
