import { NavLink, useNavigate } from "react-router-dom";
import { logoutEmployee } from "../../services/authService";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

  const employee = JSON.parse(localStorage.getItem("employee") || "{}");

  const initials = `${employee.firstName?.[0] || ""}${employee.lastName?.[0] || ""}`;

  const handleLogout = async () => {
    try {
      await logoutEmployee();
    } catch (e) {
      console.log("Logout request failed.");
    }

    localStorage.clear();
    navigate("/");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">TC</div>
        <h2>TelcoCare</h2>
      </div>

      <nav className="sidebar-menu">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/tickets"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          Tickets
        </NavLink>
        <NavLink
          to="/my-tickets"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          My Tickets
        </NavLink>

        <NavLink
          to="/customers"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          Customers
        </NavLink>

        <NavLink
          to="/reports"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          Reports
        </NavLink>

        <NavLink
          to="/categories"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          Categories
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          Settings
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="avatar">{initials}</div>

        <div>
          <h4>
            {employee.firstName} {employee.lastName}
          </h4>
          <p>Customer Representative</p>
        </div>
      </div>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
