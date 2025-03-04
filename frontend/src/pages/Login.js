import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/main.css"; // Ensure this is correctly imported

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.access_token);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h3>Welcome Back!</h3>
        </div>
        <div className="login-body">
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <input 
                type="email" 
                className="form-control" 
                placeholder="Enter Email Address..."
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="form-group">
              <input 
                type="password" 
                className="form-control" 
                placeholder="Password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            <button className="btn btn-primary w-100" type="submit">Login</button>
          </form>
        </div>
        <div className="login-footer">
          <small>Powered by Church Management System</small>
        </div>
      </div>
    </div>
  );
};

export default Login;
