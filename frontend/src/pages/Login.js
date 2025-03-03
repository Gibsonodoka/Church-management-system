import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow-lg border-0 rounded-lg">
        <div className="card-header">
          <h3 className="text-center my-3">Login</h3>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleLogin}>
            <div className="form-floating mb-3">
              <input 
                type="email" 
                className="form-control" 
                id="email" 
                placeholder="name@example.com"
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
              <label htmlFor="email">Email</label>
            </div>
            <div className="form-floating mb-3">
              <input 
                type="password" 
                className="form-control" 
                id="password" 
                placeholder="Password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
              <label htmlFor="password">Password</label>
            </div>
            <button className="btn btn-primary w-100" type="submit">Login</button>
          </form>
        </div>
        <div className="card-footer text-center">
          <small className="text-muted">Powered by Church Management System</small>
        </div>
      </div>
    </div>
  );
};

export default Login;
