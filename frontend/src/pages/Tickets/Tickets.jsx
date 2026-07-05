import { useEffect, useState } from "react";
import { Search, Ticket, AlertCircle } from "lucide-react";
import "./Tickets.css";
import { getTickets } from "../../services/ticketService";
import { useNavigate } from "react-router-dom";

function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const rowsPerPage = 15;

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    const data = await getTickets();
    setTickets(data);
  };

  const filteredTickets = tickets.filter((ticket) => {
    const keyword = search.toLowerCase();

    const matchesSearch =
      ticket.ticketNumber?.toLowerCase().includes(keyword) ||
      ticket.customerName?.toLowerCase().includes(keyword) ||
      ticket.customerPhone?.includes(search) ||
      ticket.category?.toLowerCase().includes(keyword) ||
      ticket.subCategory?.toLowerCase().includes(keyword);

    const matchesStatus =
      statusFilter === "ALL" || ticket.status === statusFilter;

    const matchesPriority =
      priorityFilter === "ALL" || ticket.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const totalPages = Math.ceil(filteredTickets.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentTickets = filteredTickets.slice(
    startIndex,
    startIndex + rowsPerPage,
  );

  const countByStatus = (status) =>
    tickets.filter((ticket) => ticket.status === status).length;

  const criticalCount = tickets.filter(
    (ticket) => ticket.priority === "CRITICAL",
  ).length;

  return (
    <div className="tickets-page">
      <div className="page-header">
        <div>
          <h1>Tickets</h1>
          <p>View, filter and manage customer support tickets.</p>
        </div>

        <button
          className="create-ticket-btn"
          onClick={() => navigate("/tickets/new")}
        >
          + New Ticket
        </button>
      </div>

      <div className="ticket-stats">
        <div className="ticket-stat-card">
          <div className="ticket-stat-icon blue">
            <Ticket size={22} />
          </div>
          <div>
            <span>Total Tickets</span>
            <strong>{tickets.length}</strong>
          </div>
        </div>

        <div className="ticket-stat-card">
          <div className="ticket-stat-icon orange">
            <Ticket size={22} />
          </div>
          <div>
            <span>Open</span>
            <strong>{countByStatus("OPEN")}</strong>
          </div>
        </div>

        <div className="ticket-stat-card">
          <div className="ticket-stat-icon purple">
            <Ticket size={22} />
          </div>
          <div>
            <span>In Progress</span>
            <strong>{countByStatus("IN_PROGRESS")}</strong>
          </div>
        </div>

        <div className="ticket-stat-card">
          <div className="ticket-stat-icon red">
            <AlertCircle size={22} />
          </div>
          <div>
            <span>Critical</span>
            <strong>{criticalCount}</strong>
          </div>
        </div>
      </div>

      <div className="tickets-filter-card">
        <div className="ticket-search">
          <Search size={18} />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by ticket no, customer, phone, category..."
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="ALL">All Statuses</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => {
            setPriorityFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="ALL">All Priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="CRITICAL">Critical</option>
        </select>
      </div>

      <div className="tickets-table-card">
        <div className="tickets-table-header">
          <div>Ticket No</div>
          <div>Customer</div>
          <div>Category</div>
          <div>Sub Category</div>
          <div>Priority</div>
          <div>Status</div>
          <div>Created</div>
        </div>

        {currentTickets.map((ticket) => (
          <div className="tickets-table-row" key={ticket.id}>
            <div className="ticket-number">{ticket.ticketNumber}</div>

            <div>
              <strong>{ticket.customerName}</strong>
              <span>{ticket.customerPhone}</span>
            </div>

            <div>{ticket.category}</div>
            <div>{ticket.subCategory}</div>

            <div>
              <span
                className={`ticket-priority ${ticket.priority.toLowerCase()}`}
              >
                {ticket.priority}
              </span>
            </div>

            <div>
              <span className={`ticket-status ${ticket.status.toLowerCase()}`}>
                {ticket.status.replace("_", " ")}
              </span>
            </div>

            <div>
              {ticket.createdAt
                ? new Date(ticket.createdAt).toLocaleDateString()
                : "-"}
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

        <span>
          Page {currentPage} of {totalPages || 1}
        </span>

        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Tickets;
