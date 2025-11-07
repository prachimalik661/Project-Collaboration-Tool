import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../utils/axiosConfig";
import "./register.css";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "TeamMember",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await api.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      navigate("/");
    } catch (err) {
      setError("Registration failed. Try again.");
    }
  };

  return (
    <div className="register-container">
      <h2>Create Account</h2>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleRegister} className="register-form">
        <input
          name="name"
          className="register-input"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          className="register-input"
          placeholder="Email Address"
          onChange={handleChange}
          required
        />

        <input
          name="phone"
          type="text"
          className="register-input"
          placeholder="Phone Number"
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          className="register-input"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <input
          name="confirmPassword"
          type="password"
          className="register-input"
          placeholder="Confirm Password"
          onChange={handleChange}
          required
        />

        <select
          name="role"
          className="register-input"
          onChange={handleChange}
        >
          <option value="TeamMember">Team Member</option>
          <option value="ProjectManager">Project Manager</option>
          <option value="Admin">Admin</option>
        </select>

        <button type="submit" className="register-btn">
          Register
        </button>
      </form>

      <p className="login-text">
        Already have an account? <Link to="/">Login</Link>
      </p>
    </div>
  );
};

export default Register;
