import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [login, setLogin] = useState(null);

  const fetchLogin = async () => {
    try {
      const response = await axios.get("/api/random-login");
      setLogin(response.data.login);
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

  useEffect(() => {
    fetchLogin();
  }, []);

  return (
    <div>
      {login ? (
        <>
          <p>Email: {login.email}</p>
          <button onClick={markAsUsed}>Mark as Used</button>
        </>
      ) : (
        <p>Loading login information...</p>
      )}
    </div>
  );
}

export default App;
