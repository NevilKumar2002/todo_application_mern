import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Loginstyle.css";

const LoginPage = () => {
 
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!loginId || !password) {
      setError("All fields are required.");
      return;
    }
  
    try {
      const response = await axios.post(
        "http://localhost:8000/users/login",
        { loginId, password }
      );
  
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.userId);
        window.location.href = "/"; 
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError(error.response.data.message);
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };
  
  return (
    <div className="login-bg-container">
      <div className="login-page">
        <h2 style={{ textAlign: 'center' }}>Login Page</h2>
        <form onSubmit={handleSubmit}>
          <div className="label-input-div">
            <label htmlFor="loginId">Email or Username</label>
            <input
              type="text"
              value={loginId}
              placeholder="Enter your Email or Username"
              onChange={(e) => setLoginId(e.target.value)}
              required
            />
          </div>
          <div className="label-input-div">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              value={password}
              placeholder="Enter your Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="button-div">
            <button type="submit" className="login-button">
              Login
            </button>
          </div>
          {error && <p className="error-message">{error}</p>}
        </form>
        <p style={{ textAlign: 'center' }}>
          Don't have an account? <Link to="/register" className="register">Register Here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
