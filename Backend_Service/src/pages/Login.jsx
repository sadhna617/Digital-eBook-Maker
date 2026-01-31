import { useState } from "react";
import authApi from "../services/authApi";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await authApi.post("/login", { email, password });

      localStorage.setItem("token", res.data.token);
localStorage.setItem("user", JSON.stringify(res.data));

// ADD THIS
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
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              className="form-control"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Password</label>
            <input
              className="form-control"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="text-end mb-3">
            <span
              style={{ cursor: "pointer", fontSize: "0.9rem" }}
              className="text-primary"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot password?
            </span>
          </div>

          <button className="btn btn-primary w-100 py-2 fw-semibold">
            Login
          </button>
        </form>

        {/* Divider */}
        <div className="d-flex align-items-center my-4">
          <hr className="flex-grow-1" />
          <span className="px-2 text-muted small">OR</span>
          <hr className="flex-grow-1" />
        </div>

        {/* Google Login */}
        <div className="d-flex justify-content-center mb-3">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                const res = await authApi.post("/google-login", {
                  token: credentialResponse.credential,
                });

                localStorage.setItem("token", res.data.token);
                localStorage.setItem("user", JSON.stringify(res.data));

                alert("Google login successful!");
                navigate("/");
              } catch {
                alert("Google login failed");
              }
            }}
            onError={() => alert("Google login failed")}
          />
        </div>

        {/* Register */}
        <p className="text-center mb-0">
          Don’t have an account?{" "}
          <span
            style={{ cursor: "pointer", fontWeight: "500" }}
            className="text-primary"
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