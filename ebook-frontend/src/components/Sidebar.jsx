import { useNavigate } from "react-router-dom";
import { FaHome, FaBook, FaPlus, FaCompass } from "react-icons/fa";

const Sidebar = ({ activeTab, onTabChange }) => {
  const navigate = useNavigate();

  const handleNavigation = (id, path) => {
    if (onTabChange && (id === "dashboard" || id === "my-books")) {
      onTabChange(id);
    } else {
      navigate(path);
    }
  };

  return (
    <div className="sidebar d-flex flex-column bg-white shadow-sm" style={{ width: "260px", minHeight: "100vh" }}>
      <div className="p-4 border-bottom">
        <h3 className="fw-bold text-primary m-0">eLibrary 📚</h3>
      </div>

      <div className="p-3">
        <small className="text-muted fw-bold text-uppercase px-3 mb-2 d-block">Menu</small>
        <ul className="nav flex-column gap-2">
          <li className="nav-item">
            <button
              className={`nav-link w-100 text-start d-flex align-items-center gap-3 px-3 py-2 rounded-3 border-0 ${activeTab === "dashboard" ? "bg-primary text-white shadow-sm" : "text-dark bg-transparent hover-bg-light"}`}
              onClick={() => handleNavigation("dashboard", "/dashboard")}
            >
              <FaHome /> Dashboard
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link w-100 text-start d-flex align-items-center gap-3 px-3 py-2 rounded-3 border-0 ${activeTab === "my-books" ? "bg-primary text-white shadow-sm" : "text-dark bg-transparent hover-bg-light"}`}
              onClick={() => handleNavigation("my-books", "/dashboard")}
            >
              <FaBook /> My Books
            </button>
          </li>
          <li className="nav-item">
            <button
              className="nav-link w-100 text-start d-flex align-items-center gap-3 px-3 py-2 rounded-3 border-0 text-dark bg-transparent hover-bg-light"
              onClick={() => handleNavigation("create", "/dashboard")}
            >
              {/* For now keeping create as a button that will be handled by parent or navigate */}
              {/* Actually, let's keep it simple and just trigger the modal if we can, or just let Dashboard handle it via 'create' tab if we wanted. 
                     But for now, I'll stick to 'My Books' logic mostly. */}
              <FaPlus /> Create Ebook
            </button>
          </li>
          <li className="nav-item">
            <button
              className="nav-link w-100 text-start d-flex align-items-center gap-3 px-3 py-2 rounded-3 border-0 text-dark bg-transparent hover-bg-light"
              onClick={() => navigate("/explore")}
            >
              <FaCompass /> Explore
            </button>
          </li>
        </ul>
      </div>

      <div className="mt-auto p-4 border-top">
        <div className="card border-0 bg-light p-3 rounded-4">
          <h6 className="fw-bold mb-1">Go Premium 👑</h6>
          <p className="small text-muted mb-2">Unlock all features</p>
          <button className="btn btn-dark btn-sm w-100 rounded-pill">Upgrade</button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
