import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !username || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/users/register",
        {
          name,
          email,
          username,
          password,
          confirmPassword
        }
      );

      if (response.data.status === 200) {
        navigate("/login");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError(error.response.data.message);
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="registration-bg-container">
      <div className="registration-page">
        <h2 style={{ textAlign: 'center' }}>Register Page</h2>
        <form onSubmit={handleSubmit}>
          <div className="label-input-div">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              value={name}
              placeholder="Enter your Name"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="label-input-div">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              value={email}
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="label-input-div">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              value={username}
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="label-input-div">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="label-input-div">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="button-div">
            <button type="submit" className="register-button">
              Register
            </button>
          </div>
          {error && <p className="error-message">{error}</p>}
        </form>
        <p style={{ textAlign: 'center' }}>
          Already have an account? <Link to="/login" className="register">Login Here</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
