import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateCustomer.css";
import { createCustomer } from "../../services/customerService";
import { getDistrictsByProvince, getProvinces } from "../../services/locationService";

function CreateCustomer() {
  const navigate = useNavigate();

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    provinceId: "",
    districtId: "",
  });

  useEffect(() => {
    getProvinces().then(setProvinces);
  }, []);

  const handleChange = async (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "provinceId" ? { districtId: "" } : {}),
    }));

    if (name === "provinceId" && value) {
      const data = await getDistrictsByProvince(value);
      setDistricts(data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await createCustomer({
        ...form,
        provinceId: Number(form.provinceId),
        districtId: Number(form.districtId),
      });

      navigate("/customers");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="create-customer-page">
      <div className="page-header">
        <div>
          <h1>Create Customer</h1>
          <p>Add a new customer to TelcoCare.</p>
        </div>

        <button className="cancel-btn" onClick={() => navigate("/customers")}>
          Cancel
        </button>
      </div>

      <form className="customer-form-card" onSubmit={handleSubmit}>
        {error && <div className="form-error">{error}</div>}

        <div className="form-grid">
          <div className="form-group">
            <label>First Name</label>
            <input name="firstName" value={form.firstName} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input name="lastName" value={form.lastName} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Province</label>
            <select name="provinceId" value={form.provinceId} onChange={handleChange} required>
              <option value="">Select province</option>
              {provinces.map((province) => (
                <option key={province.id} value={province.id}>
                  {province.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>District</label>
            <select name="districtId" value={form.districtId} onChange={handleChange} required disabled={!form.provinceId}>
              <option value="">Select district</option>
              {districts.map((district) => (
                <option key={district.id} value={district.id}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="secondary-btn" onClick={() => navigate("/customers")}>
            Back
          </button>
          <button type="submit" className="primary-btn">
            Create Customer
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateCustomer;