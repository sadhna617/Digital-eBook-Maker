import { useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaBook, FaPlus, FaCompass } from "react-icons/fa";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: "/", label: "Home", icon: <FaHome /> },
    { path: "/dashboard", label: "Dashboard", icon: <FaHome /> },
    { path: "/my-books", label: "My Books", icon: <FaBook /> },
    { path: "/create-ebook", label: "Create Ebook", icon: <FaPlus /> },
    { path: "/explore", label: "Explore", icon: <FaCompass /> },
  ];

  return (
    <div className="sidebar">
      <h2 className="brand">eLibrary</h2>

      <ul className="menu">
        {menuItems.map((item) => (
          <li
            key={item.path}
            className={location.pathname === item.path ? "active" : ""}
          >
            <button
              type="button"
              className="menu-link"
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
