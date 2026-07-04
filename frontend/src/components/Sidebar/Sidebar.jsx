import "./Sidebar.css";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">TC</div>
        <h2>TelcoCare</h2>
      </div>

      <nav className="sidebar-menu">
        <button className="menu-item active">Dashboard</button>
        <button className="menu-item">Tickets</button>
        <button className="menu-item">Customers</button>
        <button className="menu-item">Reports</button>
        <button className="menu-item">Categories</button>
        <button className="menu-item">Settings</button>
      </nav>

      <div className="sidebar-footer">
        <div className="avatar">EE</div>
        <div>
          <h4>Administrator</h4>
          <p>Call Center System</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;