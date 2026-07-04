import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">TC</div>
        <h2>TelcoCare</h2>
      </div>

      <nav className="sidebar-menu">
        <NavLink to="/" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
          Dashboard
        </NavLink>

        <NavLink to="/tickets" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
          Tickets
        </NavLink>

        <NavLink to="/customers" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
          Customers
        </NavLink>

        <NavLink to="/reports" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
          Reports
        </NavLink>

        <NavLink to="/categories" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
          Categories
        </NavLink>

        <NavLink to="/settings" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
          Settings
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="avatar">TC</div>
        <div>
          <h4>Administrator</h4>
          <p>Tickets Management System</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;