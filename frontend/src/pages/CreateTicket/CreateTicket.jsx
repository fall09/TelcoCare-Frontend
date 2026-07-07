import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateTicket.css";

import { getCustomers } from "../../services/customerService";
import {
  getCategories,
  getSubCategories,
} from "../../services/categoryService";
import { createTicket } from "../../services/ticketService";
import {
  getProvinces,
  getDistrictsByProvince,
} from "../../services/locationService";

function CreateTicket() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [provinceId, setProvinceId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [description, setDescription] = useState("");

  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [error, setError] = useState("");

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    const customerData = await getCustomers(0, 1000);

    setCustomers(customerData.content || []);
    setCategories(await getCategories());
    setProvinces(await getProvinces());
  };

  const handleProvinceChange = async (value) => {
    setProvinceId(value);
    setDistrictId("");

    if (!value) {
      setDistricts([]);
      return;
    }

    const data = await getDistrictsByProvince(value);
    setDistricts(data);
  };

  const filteredCustomers = customers
    .filter((customer) => {
      const keyword = customerSearch.toLowerCase();

      return (
        customer.firstName?.toLowerCase().includes(keyword) ||
        customer.lastName?.toLowerCase().includes(keyword) ||
        customer.phoneNumber?.includes(customerSearch) ||
        String(customer.id).includes(customerSearch)
      );
    })
    .slice(0, 8);

  const handleCategoryChange = async (value) => {
    setCategoryId(value);
    setSubCategoryId("");
    setSelectedSubCategory(null);
    setProvinceId("");
    setDistrictId("");

    if (!value) {
      setSubCategories([]);
      return;
    }

    const data = await getSubCategories(value);
    setSubCategories(data);
  };

  const handleSubCategoryChange = (value) => {
    setSubCategoryId(value);

    const sub = subCategories.find((item) => item.id === Number(value));
    setSelectedSubCategory(sub || null);

    setProvinceId("");
    setDistrictId("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      await createTicket({
        customerId: selectedCustomer.id,
        categoryId: Number(categoryId),
        subCategoryId: Number(subCategoryId),
        provinceId: selectedSubCategory?.locationRequired
          ? Number(provinceId)
          : null,
        districtId: selectedSubCategory?.locationRequired
          ? Number(districtId)
          : null,
        description,
      });

      navigate("/tickets");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="create-ticket-page">
      <div className="create-ticket-card">
        <div className="create-ticket-header">
          <div>
            <h1>Create Ticket</h1>
            <p>Create a new customer support ticket.</p>
          </div>

          <button onClick={() => navigate("/tickets")}>Back</button>
        </div>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label>Customer</label>
          <input
            value={customerSearch}
            onChange={(e) => {
              setCustomerSearch(e.target.value);
              setSelectedCustomer(null);
            }}
            placeholder="Search by name, surname, phone or ID..."
            required
          />

          {customerSearch && !selectedCustomer && (
            <div className="customer-search-results">
              {filteredCustomers.map((customer) => (
                <button
                  type="button"
                  key={customer.id}
                  onClick={() => {
                    setSelectedCustomer(customer);
                    setCustomerSearch(
                      `#${customer.id} - ${customer.firstName} ${customer.lastName} - ${customer.phoneNumber}`
                    );
                  }}
                >
                  <strong>
                    #{customer.id} - {customer.firstName} {customer.lastName}
                  </strong>
                  <span>{customer.phoneNumber}</span>
                </button>
              ))}
            </div>
          )}

          {selectedCustomer && (
            <div className="ticket-preview">
              <span>
                Customer Location:{" "}
                <strong>
                  {selectedCustomer.province} / {selectedCustomer.district}
                </strong>
              </span>
            </div>
          )}

          <label>Category</label>
          <select
            value={categoryId}
            onChange={(e) => handleCategoryChange(e.target.value)}
            required
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <label>Sub Category</label>
          <select
            value={subCategoryId}
            onChange={(e) => handleSubCategoryChange(e.target.value)}
            disabled={!categoryId}
            required
          >
            <option value="">Select sub category</option>
            {subCategories.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>

          {selectedSubCategory?.locationRequired && (
            <div className="location-grid">
              <div>
                <label>Issue Province</label>
                <select
                  value={provinceId}
                  onChange={(e) => handleProvinceChange(e.target.value)}
                  required
                >
                  <option value="">Select province</option>
                  {provinces.map((province) => (
                    <option key={province.id} value={province.id}>
                      {province.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>Issue District</label>
                <select
                  value={districtId}
                  onChange={(e) => setDistrictId(e.target.value)}
                  disabled={!provinceId}
                  required
                >
                  <option value="">Select district</option>
                  {districts.map((district) => (
                    <option key={district.id} value={district.id}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {!selectedSubCategory?.locationRequired && selectedCustomer && (
            <div className="ticket-preview">
              <span>
                Issue location will use customer's address automatically.
              </span>
            </div>
          )}

          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the customer issue..."
            required
          />

          <div className="create-ticket-actions">
            <button type="button" onClick={() => navigate("/tickets")}>
              Cancel
            </button>
            <button
              type="submit"
              className="primary-btn"
              disabled={!selectedCustomer}
            >
              Create Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTicket;