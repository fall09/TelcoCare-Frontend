import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Headset, Lock, Mail, User } from "lucide-react";
import { registerEmployee } from "../../services/authService";
import "./Auth.css";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
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
      const employee = await registerEmployee({
        firstName: form.firstName,
        lastName: form.lastName,
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
      <div className="auth-card wide">
        <div className="auth-brand">
          <div className="auth-logo">
            <Headset size={28} />
          </div>
          <h1>Create Employee Account</h1>
          <p>Register a call center employee.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="auth-grid">
            <div>
              <label>First Name</label>
              <div className="auth-input">
                <User size={18} />
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  required
                />
              </div>
            </div>

            <div>
              <label>Last Name</label>
              <div className="auth-input">
                <User size={18} />
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>
          </div>

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

          <button className="auth-submit">Register</button>
        </form>

        <p className="auth-footer">
          Already registered?{" "}
          <button onClick={() => navigate("/login")}>Login</button>
        </p>
      </div>
    </div>
  );
}

export default Register;
