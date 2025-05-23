import React, { useState, useEffect } from "react"; 
import "../styles/AuthPage.css"; 
import banner from "../assets/banner.jpg";
import { Link, useNavigate } from "react-router-dom"; 
import axios from "axios"; 

const Login = () => {
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
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
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/user-management");
    } catch (err) {
      alert(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="main">
      <div className="form-container">
        <div className="bottom-section">
          <div className="banner">
            <img src={banner} alt="Banner" />
          </div>
          <div className="header">LOGIN</div>
          <form onSubmit={handleSubmit} className="signup-form">
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
                Don't have an Account?{" "}
                <Link to="/">
                  <span>Signup</span>
                </Link>
              </p>
            </div>
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;