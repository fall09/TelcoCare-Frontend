import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Headset, Lock, Mail } from "lucide-react";
import { loginEmployee } from "../../services/authService";
import "./Auth.css";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const employee = await loginEmployee({
      email: form.email,
      password: form.password,
    });

    localStorage.setItem("employee", JSON.stringify(employee));
    navigate("/tickets");
  } catch (err) {
    alert(err.message);
  }
};

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo">
            <Headset size={28} />
          </div>
          <h1>TelcoCare</h1>
          <p>Call Center Ticket Management</p>
        </div>

        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <div className="auth-input">
            <Mail size={18} />
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="employee@telcocare.com"
              required
            />
          </div>

          <label>Password</label>
          <div className="auth-input">
            <Lock size={18} />
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <button className="auth-submit">Login</button>
        </form>

        <p className="auth-footer">
          New employee?{" "}
          <button onClick={() => navigate("/register")}>Create account</button>
        </p>
      </div>
    </div>
  );
}

export default Login;