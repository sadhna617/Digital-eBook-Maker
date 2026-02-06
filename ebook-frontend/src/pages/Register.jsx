import { useState } from "react";
import authApi from "../services/authApi";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");
  const [photo, setPhoto] = useState(null);


  const navigate = useNavigate();
  const isValidPassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;
    return regex.test(password);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!isValidPassword(password)) {
      alert("Weak password");
      return;
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("gender", gender);
    formData.append("city", city);

    if (photo) {
      formData.append("photo", photo);
    }

    try {
      await authApi.post("/register", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("Registered successfully");
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      const errorMsg = err.response?.data ? (typeof err.response.data === 'string' ? err.response.data : JSON.stringify(err.response.data)) : "Registration failed";
      alert(errorMsg);
    }
  };


  return (
    <div className="container mt-5" style={{ maxWidth: "450px" }}>
      <div className="card shadow p-4">
        <h3 className="text-center mb-3">Register</h3>

        <form onSubmit={handleRegister}>
          <input
            className="form-control mb-3"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            className="form-control mb-3"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="form-control mb-3"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <select
            className="form-select mb-3"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          <input
            className="form-control mb-3"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />

          <input
            type="file"
            accept="image/png, image/jpeg"
            className="form-control mb-3"
            onChange={(e) => setPhoto(e.target.files[0])}
          />


          <button className="btn btn-success w-100">Register</button>
        </form>

        <p className="text-center mb-0">
          Already have an account?{" "}
          <Link to="/login" style={{ textDecoration: "none", fontWeight: "500" }}>
            Login here
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;