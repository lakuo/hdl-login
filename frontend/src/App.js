import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";

function App() {
  const [login, setLogin] = useState(null);
  const [name, setName] = useState("");
  const [nameEntered, setNameEntered] = useState(false);
  const [confirmUsed, setConfirmUsed] = useState(false);

  useEffect(() => {
    if (nameEntered) {
      fetchLogin();
    }
  }, [nameEntered]);

  const fetchLogin = async () => {
    setLogin(null);
    try {
      const response = await axios.get("/api/random-login");
      setLogin(response.data);
    } catch (error) {
      console.error("Error fetching login:", error);
      alert("Failed to fetch login");
    }
  };

  const promptMarkAsUsed = () => {
    setConfirmUsed(true);
  };

  const confirmMarkAsUsed = async () => {
    try {
      await axios.post("/api/mark-used", { email: login.email, name });
      alert("Login marked as used");
      setConfirmUsed(false);
      fetchLogin();
    } catch (error) {
      console.error("Error marking login as used:", error);
      alert("Failed to mark login as used");
    }
  };

  const cancelMarkAsUsed = () => {
    setConfirmUsed(false);
  };

  const renderConfirmationButtons = () => {
    return (
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <p style={{ fontWeight: "bold" }}>Confirm?</p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "80%",
            margin: "auto",
          }}
        >
          <button
            onClick={confirmMarkAsUsed}
            className="button-style"
            style={{ backgroundColor: "green", flex: 1, marginRight: "5px" }}
          >
            Yes
          </button>
          <button
            onClick={cancelMarkAsUsed}
            className="button-style"
            style={{ backgroundColor: "red", flex: 1, marginLeft: "5px" }}
          >
            No
          </button>
        </div>
      </div>
    );
  };

  const renderMarkAsUsedButton = () => {
    return (
      <div style={{ width: "80%", margin: "auto", marginBottom: "20px" }}>
        <button
          onClick={promptMarkAsUsed}
          className="button-style"
          disabled={!login}
          style={{ width: "100%" }}
        >
          Mark as Used
        </button>
      </div>
    );
  };

  const renderGetAnotherAccountButton = () => {
    return (
      <div style={{ width: "80%", margin: "auto", marginBottom: "20px" }}>
        <button
          onClick={fetchLogin}
          className="button-style"
          disabled={!login}
          style={{ width: "100%" }}
        >
          Get Another Account
        </button>
      </div>
    );
  };

  const calculateDaysAgo = (lastUsed) => {
    const [month, day] = lastUsed.split("-").map(Number);
    const lastUsedDate = new Date(new Date().getFullYear(), month - 1, day);
    const today = new Date();
    const differenceInTime = today.getTime() - lastUsedDate.getTime();
    const differenceInDays = Math.round(differenceInTime / (1000 * 3600 * 24));
    return differenceInDays;
  };

  const handleSubmitName = () => {
    if (name.trim()) {
      setNameEntered(true);
    } else {
      alert("Please enter your name");
    }
  };

  const renderLoginInfo = () => {
    if (login) {
      return (
        <>
          <p>
            <b>Email:</b> {login.email}
          </p>
          <p>
            <b>Password:</b> {login.password}
          </p>
          <p>
            <b>Last used:</b> {calculateDaysAgo(login.lastUsed)} days ago
          </p>
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <div style={{ marginBottom: "20px" }}>
              {login && !confirmUsed && renderMarkAsUsedButton()}
              {confirmUsed && renderConfirmationButtons()}
            </div>
          </div>
          {renderGetAnotherAccountButton()}
        </>
      );
    } else {
      return (
        <>
          <p>
            <b>Email:</b> ...
          </p>
          <p>
            <b>Password:</b> ...
          </p>
          <p>
            <b>Last used:</b> ...
          </p>
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <div style={{ marginBottom: "20px" }}>
              {login && !confirmUsed && renderMarkAsUsedButton()}
              {confirmUsed && renderConfirmationButtons()}
            </div>
          </div>
          {renderGetAnotherAccountButton()}
        </>
      );
    }
  };

  if (!nameEntered) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            marginBottom: "20px",
            padding: "10px",
            borderRadius: "15px",
            border: "1px solid #ccc",
            outline: "none",
          }}
        />
        <button onClick={handleSubmitName} className="button-style">
          Submit
        </button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <div style={{ marginBottom: "20px" }}>{renderLoginInfo()}</div>
    </div>
  );
}

export default App;
