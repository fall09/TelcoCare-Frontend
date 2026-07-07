import { useNavigate } from "react-router-dom";
import { Headset, ShieldCheck, Ticket, Users } from "lucide-react";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="home-bg-circle one"></div>
      <div className="home-bg-circle two"></div>

      <div className="home-card">
        <div className="home-logo">
          <Headset size={34} />
        </div>

        <div className="home-badge">Ticket Management System</div>

        <h1>Welcome to TelcoCare</h1>

        <p>
          Manage customer requests, support tickets and service operations from
          one secure dashboard.
        </p>

        <div className="home-features">
          <div>
            <Ticket size={22} />
            <span>Ticket Tracking</span>
          </div>
          <div>
            <Users size={22} />
            <span>Customer Management</span>
          </div>
          <div>
            <ShieldCheck size={22} />
            <span>Secure Access</span>
          </div>
        </div>

        <button onClick={() => navigate("/login")} className="home-primary">
          Login to System
        </button>
      </div>
    </div>
  );
}

export default Home;