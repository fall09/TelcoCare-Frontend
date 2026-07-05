import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Customers.css";
import { getCustomers, updateCustomerStatus } from "../../services/customerService";
import {
  getCustomerStatuses,
  getInactiveReasons,
  getSuspendedReasons,
} from "../../services/customerStatusService";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [inactiveReasons, setInactiveReasons] = useState([]);
  const [suspendedReasons, setSuspendedReasons] = useState([]);

  const [newStatus, setNewStatus] = useState("");
  const [inactiveReason, setInactiveReason] = useState("");
  const [suspendedReason, setSuspendedReason] = useState("");
  const [note, setNote] = useState("");
  const [statusError, setStatusError] = useState("");

  const navigate = useNavigate();
  const rowsPerPage = 15;

  useEffect(() => {
    loadCustomers();
    loadStatusOptions();
  }, []);

  const loadCustomers = async (searchText = "") => {
    try {
      const data = await getCustomers(searchText);
      setCustomers(data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to load customers:", error);
    }
  };

  const loadStatusOptions = async () => {
    setStatuses(await getCustomerStatuses());
    setInactiveReasons(await getInactiveReasons());
    setSuspendedReasons(await getSuspendedReasons());
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    loadCustomers(value);
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setShowStatusMenu(false);
    setCurrentPage(1);
  };

  const openStatusModal = (customer) => {
    setSelectedCustomer(customer);
    setNewStatus(customer.status);
    setInactiveReason("");
    setSuspendedReason("");
    setNote("");
    setStatusError("");
  };

  const submitStatusChange = async () => {
    try {
      setStatusError("");

      const payload = {
        status: newStatus,
        inactiveReason: newStatus === "INACTIVE" ? inactiveReason : null,
        suspendedReason: newStatus === "SUSPENDED" ? suspendedReason : null,
        note,
      };

      const updatedCustomer = await updateCustomerStatus(selectedCustomer.id, payload);

      setCustomers((prev) =>
        prev.map((customer) =>
          customer.id === updatedCustomer.id ? updatedCustomer : customer
        )
      );

      setSelectedCustomer(null);
    } catch (error) {
      setStatusError(error.message);
    }
  };

  const filteredCustomers =
    statusFilter === "ALL"
      ? customers
      : customers.filter((customer) => customer.status === statusFilter);

  const totalPages = Math.ceil(filteredCustomers.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;

  const currentCustomers = filteredCustomers.slice(
    startIndex,
    startIndex + rowsPerPage
  );

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
          <div>Province</div>
          <div>District</div>

          <div className="status-filter-wrapper">
            <button
              type="button"
              className="status-filter-button"
              onClick={() => setShowStatusMenu(!showStatusMenu)}
            >
              Status ▾
            </button>

            {showStatusMenu && (
              <div className="status-filter-menu">
                <button onClick={() => handleStatusFilterChange("ALL")}>All</button>
                <button onClick={() => handleStatusFilterChange("ACTIVE")}>Active</button>
                <button onClick={() => handleStatusFilterChange("INACTIVE")}>Inactive</button>
                <button onClick={() => handleStatusFilterChange("SUSPENDED")}>Suspended</button>
              </div>
            )}
          </div>
        </div>

        {currentCustomers.map((customer) => (
          <div className="customers-table-row" key={customer.id}>
            <div>#{customer.id}</div>
            <div>{customer.firstName} {customer.lastName}</div>
            <div>{customer.phoneNumber}</div>
            <div>{customer.email}</div>
            <div>{customer.province}</div>
            <div>{customer.district}</div>

            <div className="status-cell">
              <button
                className={`customer-status ${customer.status.toLowerCase()}`}
                onClick={() => openStatusModal(customer)}
              >
                {customer.status}
              </button>

              <button
                className="history-btn"
                onClick={() => navigate(`/customers/${customer.id}/status-history`)}
              >
                Details
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </button>

        <span>Page {currentPage} of {totalPages}</span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>

      {selectedCustomer && (
        <div className="modal-overlay">
          <div className="status-modal">
            <h2>Change Customer Status</h2>
            <p>
              {selectedCustomer.firstName} {selectedCustomer.lastName}
            </p>

            {statusError && <div className="form-error">{statusError}</div>}

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

            <label>Note</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional note..."
            />

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