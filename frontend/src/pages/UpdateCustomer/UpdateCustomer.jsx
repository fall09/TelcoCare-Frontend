import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./UpdateCustomer.css";

import {
  getCustomerById,
  updateCustomer,
} from "../../services/customerService";

import {
  getProvinces,
  getDistrictsByProvince,
} from "../../services/locationService";

function UpdateCustomer() {
  const { id } = useParams();
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
    loadPage();
  }, []);

  const loadPage = async () => {
    try {
      const provinceData = await getProvinces();
      setProvinces(provinceData);

      const customer = await getCustomerById(id);

      const selectedProvince = provinceData.find(
        (province) => province.name === customer.province
      );

      let districtData = [];
      let selectedDistrict = null;

      if (selectedProvince) {
        districtData = await getDistrictsByProvince(selectedProvince.id);
        setDistricts(districtData);

        selectedDistrict = districtData.find(
          (district) => district.name === customer.district
        );
      }

      setForm({
        firstName: customer.firstName || "",
        lastName: customer.lastName || "",
        phoneNumber: customer.phoneNumber || "",
        email: customer.email || "",
        provinceId: selectedProvince ? String(selectedProvince.id) : "",
        districtId: selectedDistrict ? String(selectedDistrict.id) : "",
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleProvinceChange = async (provinceId) => {
    setForm((prev) => ({
      ...prev,
      provinceId,
      districtId: "",
    }));

    if (!provinceId) {
      setDistricts([]);
      return;
    }

    const districtData = await getDistrictsByProvince(provinceId);
    setDistricts(districtData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      await updateCustomer(id, {
        firstName: form.firstName,
        lastName: form.lastName,
        phoneNumber: form.phoneNumber,
        email: form.email,
        provinceId: Number(form.provinceId),
        districtId: Number(form.districtId),
      });

      navigate("/customers");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="update-customer-page">
      <div className="update-customer-card">
        <div className="update-customer-header">
          <div>
            <h1>Update Customer</h1>
            <p>Edit customer information.</p>
          </div>

          <button type="button" onClick={() => navigate("/customers")}>
            Back
          </button>
        </div>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="update-form-grid">
            <div>
              <label>First Name</label>
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Last Name</label>
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <label>Phone Number</label>
          <input
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <div className="update-form-grid">
            <div>
              <label>Province</label>
              <select
                name="provinceId"
                value={form.provinceId}
                onChange={(e) => handleProvinceChange(e.target.value)}
                required
              >
                <option value="">Select province</option>
                {provinces.map((province) => (
                  <option key={province.id} value={String(province.id)}>
                    {province.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>District</label>
              <select
                name="districtId"
                value={form.districtId}
                onChange={handleChange}
                disabled={!form.provinceId}
                required
              >
                <option value="">Select district</option>
                {districts.map((district) => (
                  <option key={district.id} value={String(district.id)}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="update-customer-actions">
            <button type="button" onClick={() => navigate("/customers")}>
              Cancel
            </button>
            <button type="submit" className="primary-btn">
              Update Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateCustomer;