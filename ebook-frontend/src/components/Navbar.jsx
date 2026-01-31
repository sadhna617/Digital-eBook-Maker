import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  useEffect(() => {
    const checkLogin = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    // Custom event (works in same tab)
    window.addEventListener("auth-change", checkLogin);

    return () => window.removeEventListener("auth-change", checkLogin);
  }, []);

  return (
    <nav className="main-navbar">
      <div className="nav-left">
        <h2 className="logo">📘 Digital E-Book</h2>
      </div>

      <div className="nav-center">
        <input
          type="text"
          placeholder="Search your books..."
          className="nav-search"
        />
      </div>

      <div className="nav-right" style={{ display: "flex", gap: "12px" }}>
        {!isLoggedIn ? (
          <>
            <button
              className="nav-btn login-btn"
              onClick={() => navigate("/login")}
            >
              Login
            </button>

            <button
              className="nav-btn register-btn"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          </>
        ) : (
          <>
            <button
              className="nav-btn login-btn"
              onClick={() => navigate("/dashboard")}
            >
              Go to Dashboard
            </button>

            <FaUserCircle
              className="nav-profile-icon"
              onClick={() => navigate("/profile")}
            />
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
