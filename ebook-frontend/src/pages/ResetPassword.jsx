import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Password validation function
  const isValidPassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;
    return regex.test(password);
  };

  const handleReset = async (e) => {
    e.preventDefault(); // prevent page reload

    if (!isValidPassword(password)) {
      alert("Password must be 8-12 chars, include uppercase, lowercase, number, and special character.");
      return;
    }

    try {
      await api.post("/reset-password", {
        token,
        newPassword: password
      });

      alert("Password reset successful");
      navigate("/login");
    } catch {
      alert("Reset failed");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <div className="card p-4 shadow">
        <h4 className="text-center">Reset Password</h4>

        <form onSubmit={handleReset}>
          <input
            className="form-control mb-3"
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="btn btn-success w-100">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;