import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateTicket.css";

import { getCustomers, createCustomer } from "../../services/customerService";
import { getCategories, getSubCategories } from "../../services/categoryService";
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
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  const [priority, setPriority] = useState("MEDIUM");
  const [assignToMe, setAssignToMe] = useState(false);

  const [provinceId, setProvinceId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);

  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [newCustomerDistricts, setNewCustomerDistricts] = useState([]);

  const [newCustomer, setNewCustomer] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    provinceId: "",
    districtId: "",
  });

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

    setDistricts(await getDistrictsByProvince(value));
  };

  const handleNewCustomerProvinceChange = async (value) => {
    setNewCustomer((prev) => ({
      ...prev,
      provinceId: value,
      districtId: "",
    }));

    if (!value) {
      setNewCustomerDistricts([]);
      return;
    }

    setNewCustomerDistricts(await getDistrictsByProvince(value));
  };

  const handleCreateCustomer = async () => {
    try {
      setError("");

      const created = await createCustomer({
        firstName: newCustomer.firstName,
        lastName: newCustomer.lastName,
        phoneNumber: newCustomer.phoneNumber,
        email: newCustomer.email,
        provinceId: Number(newCustomer.provinceId),
        districtId: Number(newCustomer.districtId),
        status: "POTENTIAL"
      });

      setCustomers((prev) => [created, ...prev]);
      setSelectedCustomer(created);

      setCustomerSearch(
        `#${created.id} - ${created.firstName} ${created.lastName} - ${created.phoneNumber}`
      );

      setNewCustomer({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        provinceId: "",
        districtId: "",
      });

      setNewCustomerDistricts([]);
      setShowCustomerModal(false);
    } catch (err) {
      setError(err.message || "Customer could not be created.");
    }
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
    setPriority("MEDIUM");
    setProvinceId("");
    setDistrictId("");
    setDistricts([]);

    if (!value) {
      setSubCategories([]);
      return;
    }

    setSubCategories(await getSubCategories(value));
  };

  const handleSubCategoryChange = (value) => {
    setSubCategoryId(value);

    const sub = subCategories.find((item) => item.id === Number(value));

    setSelectedSubCategory(sub || null);
    setPriority(sub?.defaultPriority || "MEDIUM");

    setProvinceId("");
    setDistrictId("");
    setDistricts([]);
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
        priority,
        assignToMe,
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

          <div className="customer-search-wrapper">
            <input
              value={customerSearch}
              onChange={(e) => {
                setCustomerSearch(e.target.value);
                setSelectedCustomer(null);
              }}
              placeholder="Search by name, surname, phone or ID..."
              required
            />

            <button
              type="button"
              className="add-customer-btn"
              onClick={() => setShowCustomerModal(true)}
            >
              +
            </button>
          </div>

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

          {selectedSubCategory && (
            <div className="ticket-preview">
              <span>
                Default Priority:{" "}
                <strong>{selectedSubCategory.defaultPriority}</strong>
              </span>
              <span>
                Location Required:{" "}
                <strong>
                  {selectedSubCategory.locationRequired ? "Yes" : "No"}
                </strong>
              </span>
            </div>
          )}

          <label>Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            required
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>

          <div className="assign-toggle-row">
            <div>
              <strong>Assign to me</strong>
              <span>
                If enabled, this ticket will be assigned to you immediately.
              </span>
            </div>

            <button
              type="button"
              className={`assign-toggle ${assignToMe ? "on" : ""}`}
              onClick={() => setAssignToMe((prev) => !prev)}
            >
              <span />
            </button>
          </div>

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

      {showCustomerModal && (
        <div className="customer-modal-overlay">
          <div className="customer-modal">
            <h2>New Customer</h2>

            <input
              placeholder="First Name"
              value={newCustomer.firstName}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, firstName: e.target.value })
              }
            />

            <input
              placeholder="Last Name"
              value={newCustomer.lastName}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, lastName: e.target.value })
              }
            />

            <input
              placeholder="Phone"
              value={newCustomer.phoneNumber}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, phoneNumber: e.target.value })
              }
            />

            <input
              placeholder="Email"
              value={newCustomer.email}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, email: e.target.value })
              }
            />

            <select
              value={newCustomer.provinceId}
              onChange={(e) => handleNewCustomerProvinceChange(e.target.value)}
            >
              <option value="">Select Province</option>
              {provinces.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <select
              value={newCustomer.districtId}
              onChange={(e) =>
                setNewCustomer({
                  ...newCustomer,
                  districtId: e.target.value,
                })
              }
              disabled={!newCustomer.provinceId}
            >
              <option value="">Select District</option>
              {newCustomerDistricts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>

            <div className="modal-buttons">
              <button
                type="button"
                onClick={() => setShowCustomerModal(false)}
              >
                Cancel
              </button>

              <button type="button" onClick={handleCreateCustomer}>
                Save Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateTicket;