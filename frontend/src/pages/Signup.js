import React, { useState, useEffect } from "react"; 
import "../styles/AuthPage.css";
import banner from "../assets/banner.jpg";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.token) {
      navigate("/user-management", { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", formData);
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/user-management");
    } catch (err) {
      alert(err.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="main">
      <div className="form-container">
        <div className="bottom-section">
          <div className="banner">
            <img src={banner} alt="Banner" />
          </div>
          <div className="header">SIGN UP</div>

          <form onSubmit={handleSubmit} className="signup-form">
            <div className="input-group">
              <i className="fa fa-user icon"></i>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <i className="fa fa-calendar icon"></i>
              <input
                type="date"
                name="dob"
                placeholder="Date of Birth"
                value={formData.dob}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <i className="fa fa-envelope icon"></i>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <i className="fa fa-lock icon"></i>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="bottom-text">
              <p>
                Already have an Account?{" "}
                <Link to="/login">
                  <span>Login</span>
                </Link>
              </p>
            </div>

            <button type="submit">Sign Up</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;