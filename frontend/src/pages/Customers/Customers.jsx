import { useEffect, useState } from "react";
import "./Customers.css";
import { getCustomers } from "../../services/customerService";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const rowsPerPage = 15;

  useEffect(() => {
    loadCustomers();
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

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    loadCustomers(value);
  };

  const handleStatusChange = (status) => {
    setStatusFilter(status);
    setShowStatusMenu(false);
    setCurrentPage(1);
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

        <button className="create-customer-btn">+ New Customer</button>
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
                <button onClick={() => handleStatusChange("ALL")}>All</button>
                <button onClick={() => handleStatusChange("ACTIVE")}>Active</button>
                <button onClick={() => handleStatusChange("INACTIVE")}>Inactive</button>
                <button onClick={() => handleStatusChange("SUSPENDED")}>Suspended</button>
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
            <div>
              <span className={`customer-status ${customer.status.toLowerCase()}`}>
                {customer.status}
              </span>
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
    </div>
  );
}

export default Customers;