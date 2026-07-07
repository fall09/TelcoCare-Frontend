import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";
import "./Customers.css";

import {
  getCustomers,
  updateCustomerStatus,
  getCustomerStatusHistory,
} from "../../services/customerService";
import {
  getCustomerStatuses,
  getInactiveReasons,
  getSuspendedReasons,
} from "../../services/customerStatusService";
import {
  getProvinces,
  getDistrictsByProvince,
} from "../../services/locationService";

function Customers() {
  const navigate = useNavigate();
  const rowsPerPage = 15;

  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [provinceFilter, setProvinceFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [hasTicketFilter, setHasTicketFilter] = useState("ALL");

  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showProvinceMenu, setShowProvinceMenu] = useState(false);
  const [showDistrictMenu, setShowDistrictMenu] = useState(false);
  const [showTicketMenu, setShowTicketMenu] = useState(false);

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [inactiveReasons, setInactiveReasons] = useState([]);
  const [suspendedReasons, setSuspendedReasons] = useState([]);

  const [newStatus, setNewStatus] = useState("");
  const [inactiveReason, setInactiveReason] = useState("");
  const [suspendedReason, setSuspendedReason] = useState("");
  const [note, setNote] = useState("");
  const [statusError, setStatusError] = useState("");

  const [statusHistory, setStatusHistory] = useState([]);

  const loadCustomers = async (
    page = 1,
    searchText = search,
    status = statusFilter,
    provinceId = provinceFilter,
    districtId = districtFilter,
    hasTicket = hasTicketFilter,
  ) => {
    try {
      const data = await getCustomers(
        page - 1,
        rowsPerPage,
        searchText,
        status,
        provinceId,
        districtId,
        hasTicket,
      );

      setCustomers(data.content || []);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(page);
    } catch (error) {
      console.error("Failed to load customers:", error);
      setCustomers([]);
      setTotalPages(1);
    }
  };

  const loadStatusOptions = async () => {
    setStatuses(await getCustomerStatuses());
    setInactiveReasons(await getInactiveReasons());
    setSuspendedReasons(await getSuspendedReasons());
  };

  const loadProvinces = async () => {
    setProvinces(await getProvinces());
  };

  useEffect(() => {
    loadCustomers(1);
    loadStatusOptions();
    loadProvinces();
  }, []);

  

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    loadCustomers(
      1,
      value,
      statusFilter,
      provinceFilter,
      districtFilter,
      hasTicketFilter,
    );
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setShowStatusMenu(false);
    loadCustomers(
      1,
      search,
      status,
      provinceFilter,
      districtFilter,
      hasTicketFilter,
    );
  };

  const handleProvinceFilterChange = async (provinceId) => {
    setProvinceFilter(provinceId);
    setDistrictFilter("");
    setShowProvinceMenu(false);
    setShowDistrictMenu(false);

    if (provinceId) {
      setDistricts(await getDistrictsByProvince(provinceId));
    } else {
      setDistricts([]);
    }

    loadCustomers(1, search, statusFilter, provinceId, "", hasTicketFilter);
  };

  const handleDistrictFilterChange = (districtId) => {
    setDistrictFilter(districtId);
    setShowDistrictMenu(false);
    loadCustomers(
      1,
      search,
      statusFilter,
      provinceFilter,
      districtId,
      hasTicketFilter,
    );
  };

  const handleTicketFilterChange = (value) => {
    setHasTicketFilter(value);
    setShowTicketMenu(false);
    loadCustomers(
      1,
      search,
      statusFilter,
      provinceFilter,
      districtFilter,
      value,
    );
  };

  const openStatusModal = async (customer) => {
    setSelectedCustomer(customer);
    setNewStatus(customer.status);
    setInactiveReason("");
    setSuspendedReason("");
    setNote("");
    setStatusError("");

    try {
      const history = await getCustomerStatusHistory(customer.id);
      setStatusHistory(history);
    } catch (error) {
      console.error("Failed to load status history:", error);
      setStatusHistory([]);
    }
  };

  const submitStatusChange = async () => {
    try {
      setStatusError("");

      await updateCustomerStatus(selectedCustomer.id, {
        status: newStatus,
        inactiveReason: newStatus === "INACTIVE" ? inactiveReason : null,
        suspendedReason: newStatus === "SUSPENDED" ? suspendedReason : null,
        note,
      });

      setSelectedCustomer(null);
      loadCustomers(currentPage);
    } catch (error) {
      setStatusError(error.message);
    }
  };

  const selectedProvinceName =
    provinces.find((p) => String(p.id) === String(provinceFilter))?.name ||
    "Province";

  const selectedDistrictName =
    districts.find((d) => String(d.id) === String(districtFilter))?.name ||
    "District";

  const ticketFilterLabel =
    hasTicketFilter === "ALL"
      ? "Tickets"
      : hasTicketFilter === "true"
        ? "Has Tickets"
        : "No Tickets";

  return (
    <div className="customers-page">
      <div className="page-header">
        <div>
          <h1>Customers</h1>
          <p>View and manage customer records.</p>
        </div>

        <button
          className="create-customer-btn"
          onClick={() => navigate("/customers/new")}
        >
          + New Customer
        </button>
      </div>

      <div className="customers-filter">
        <input
          value={search}
          onChange={handleSearch}
          placeholder="Search by name, surname or phone..."
        />
      </div>

      <div className="customers-table-card">
        <div className="customers-table-header">
          <div>ID</div>
          <div>Customer</div>
          <div>Phone</div>
          <div>Email</div>

          <div className="status-filter-wrapper">
            <button
              type="button"
              className="status-filter-button"
              onClick={() => setShowProvinceMenu(!showProvinceMenu)}
            >
              {selectedProvinceName}
            </button>
            

            {showProvinceMenu && (
              <div className="status-filter-menu">
                <button onClick={() => handleProvinceFilterChange("")}>
                  All Provinces
                </button>
                {provinces.map((province) => (
                  <button
                    key={province.id}
                    onClick={() => handleProvinceFilterChange(province.id)}
                  >
                    {province.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="status-filter-wrapper">
            <button
              type="button"
              className="status-filter-button"
              disabled={!provinceFilter}
              onClick={() => setShowDistrictMenu(!showDistrictMenu)}
            >
              {selectedDistrictName}
            </button>

            {showDistrictMenu && (
              <div className="status-filter-menu">
                <button onClick={() => handleDistrictFilterChange("")}>
                  All Districts
                </button>
                {districts.map((district) => (
                  <button
                    key={district.id}
                    onClick={() => handleDistrictFilterChange(district.id)}
                  >
                    {district.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="status-filter-wrapper">
            <button
              type="button"
              className="status-filter-button"
              onClick={() => setShowTicketMenu(!showTicketMenu)}
            >
              {ticketFilterLabel}
            </button>

            {showTicketMenu && (
              <div className="status-filter-menu">
                <button onClick={() => handleTicketFilterChange("ALL")}>
                  All
                </button>
                <button onClick={() => handleTicketFilterChange("true")}>
                  Has Tickets
                </button>
                <button onClick={() => handleTicketFilterChange("false")}>
                  No Tickets
                </button>
              </div>
            )}
          </div>

          <div className="status-filter-wrapper">
            <button
              type="button"
              className="status-filter-button"
              onClick={() => setShowStatusMenu(!showStatusMenu)}
            >
              {statusFilter === "ALL" ? "Status" : statusFilter} ▾
            </button>

            {showStatusMenu && (
              <div className="status-filter-menu">
                <button onClick={() => handleStatusFilterChange("ALL")}>
                  All
                </button>
                <button onClick={() => handleStatusFilterChange("ACTIVE")}>
                  Active
                </button>
                <button onClick={() => handleStatusFilterChange("INACTIVE")}>
                  Inactive
                </button>
                <button onClick={() => handleStatusFilterChange("SUSPENDED")}>
                  Suspended
                </button>
              </div>
            )}
          </div>
        </div>

        {customers.map((customer) => (
          <div className="customers-table-row" key={customer.id}>
            <div>#{customer.id}</div>

            <div>
              <button
                className="customer-link-btn"
                onClick={() => navigate(`/customers/${customer.id}/tickets`)}
              >
                {customer.firstName} {customer.lastName}
              </button>
            </div>

            <div>{customer.phoneNumber}</div>
            <div>{customer.email}</div>
            <div>{customer.province}</div>
            <div>{customer.district}</div>

            <div>
              <button
                className="ticket-count-btn"
                onClick={() => navigate(`/customers/${customer.id}/tickets`)}
              >
                {customer.ticketCount}
              </button>
            </div>

            <div className="status-cell">
              <button
                type="button"
                className={`customer-status ${customer.status.toLowerCase()}`}
                onClick={() => openStatusModal(customer)}
              >
                {customer.status}
              </button>
            </div>

            <div className="actions-cell">
              <button
                className="edit-customer-btn"
                onClick={() => navigate(`/customers/${customer.id}/edit`)}
              >
                <Pencil size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => loadCustomers(currentPage - 1)}
        >
          Previous
        </button>

        <span>
          Page {currentPage} of {totalPages || 1}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => loadCustomers(currentPage + 1)}
        >
          Next
        </button>
      </div>

      {selectedCustomer && (
  <div className="modal-overlay">
    <div className="status-modal">
      <div className="status-modal-header">
        <div>
          <h2>Change Customer Status</h2>
          <p>
            {selectedCustomer.firstName} {selectedCustomer.lastName}
          </p>
        </div>

        <button
          className="modal-close-btn"
          onClick={() => setSelectedCustomer(null)}
        >
          ×
        </button>
      </div>

      {statusError && <div className="form-error">{statusError}</div>}

      <div className="status-form-grid">
        <div>
          <label>Status</label>
          <select
            value={newStatus}
            onChange={(e) => {
              setNewStatus(e.target.value);
              setInactiveReason("");
              setSuspendedReason("");
            }}
          >
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.displayName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Note</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional note..."
          />
        </div>
      </div>

      {newStatus === "INACTIVE" && (
        <>
          <label>Inactive Reason</label>
          <select
            value={inactiveReason}
            onChange={(e) => setInactiveReason(e.target.value)}
          >
            <option value="">Select reason</option>
            {inactiveReasons.map((reason) => (
              <option key={reason.value} value={reason.value}>
                {reason.displayName}
              </option>
            ))}
          </select>
        </>
      )}

      {newStatus === "SUSPENDED" && (
        <>
          <label>Suspended Reason</label>
          <select
            value={suspendedReason}
            onChange={(e) => setSuspendedReason(e.target.value)}
          >
            <option value="">Select reason</option>
            {suspendedReasons.map((reason) => (
              <option key={reason.value} value={reason.value}>
                {reason.displayName}
              </option>
            ))}
          </select>
        </>
      )}

      <div className="status-history-preview">
        <div className="status-history-title">
          <strong>Status History</strong>
          <button
            type="button"
            onClick={() =>
              navigate(`/customers/${selectedCustomer.id}/status-history`)
            }
          >
            View all
          </button>
        </div>

        {statusHistory.length === 0 ? (
          <p>No status history found.</p>
        ) : (
          statusHistory.slice(0, 3).map((item) => (
            <div className="status-history-item" key={item.id}>
              <span>
                {item.oldStatus} → {item.newStatus}
              </span>
              <small>
                {item.changedAt
                  ? new Date(item.changedAt).toLocaleString()
                  : "-"}
              </small>
            </div>
          ))
        )}
      </div>

      <div className="modal-actions">
        <button onClick={() => setSelectedCustomer(null)}>Cancel</button>
        <button className="primary-btn" onClick={submitStatusChange}>
          Save
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default Customers;
