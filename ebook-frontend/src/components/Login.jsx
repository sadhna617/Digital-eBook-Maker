import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));

      // Notify navbar
      window.dispatchEvent(new Event("auth-change"));

      alert("Login successful!");
      navigate("/");
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="container vh-100 d-flex align-items-center justify-content-center">
      <div className="card shadow-lg p-4 rounded-4" style={{ maxWidth: "420px", width: "100%" }}>
        <h3 className="text-center mb-4 fw-bold">Welcome Back !</h3>

        <form onSubmit={handleLogin}>
          <input
            className="form-control mb-3"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="form-control mb-3"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="btn btn-primary w-100">Login</button>
        </form>

        <div className="d-flex justify-content-center my-3">
          <GoogleLogin
            onSuccess={async (res) => {
              const response = await api.post("/google-login", {
                token: res.credential,
              });

              localStorage.setItem("token", response.data.token);
              localStorage.setItem("user", JSON.stringify(response.data));

              window.dispatchEvent(new Event("auth-change"));

              navigate("/");
            }}
            onError={() => alert("Google login failed")}
          />
        </div>

        <p className="text-center">
          Don’t have an account?{" "}
          <span
            className="text-primary"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/register")}
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
