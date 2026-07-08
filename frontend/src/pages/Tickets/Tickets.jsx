import { useEffect, useState } from "react";
import { Search, Ticket, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { getTickets, takeTicket } from "../../services/ticketService";
import "./Tickets.css";

const chartColors = {
  OPEN: "#2563eb",
  IN_PROGRESS: "#7c3aed",
  RESOLVED: "#16a34a",
  CLOSED: "#64748b",
  LOW: "#22c55e",
  MEDIUM: "#f59e0b",
  HIGH: "#ef4444",
  CRITICAL: "#111827",
  Assigned: "#2563eb",
  Unassigned: "#f59e0b",
  Internet: "#2563eb",
  Mobile: "#7c3aed",
  Billing: "#f59e0b",
  TV: "#16a34a",
  Subscription: "#ec4899",
  Device: "#06b6d4",
  Infrastructure: "#ef4444",
  Account: "#8b5cf6",
  Complaint: "#111827",
  Information: "#64748b",
  Other: "#94a3b8",
};

function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [chartMode, setChartMode] = useState("STATUS");

  const navigate = useNavigate();
  const rowsPerPage = 15;

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    const data = await getTickets();
    setTickets(Array.isArray(data) ? data : []);
  };

  const handleTakeTicket = async (e, ticketId) => {
    e.stopPropagation();

    try {
      await takeTicket(ticketId);
      await loadTickets();
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    const keyword = search.toLowerCase();

    const matchesSearch =
      ticket.ticketNumber?.toLowerCase().includes(keyword) ||
      ticket.customerName?.toLowerCase().includes(keyword) ||
      ticket.customerPhone?.includes(search) ||
      ticket.category?.toLowerCase().includes(keyword) ||
      ticket.subCategory?.toLowerCase().includes(keyword) ||
      ticket.assignedEmployeeName?.toLowerCase().includes(keyword);

    const matchesStatus =
      statusFilter === "ALL" || ticket.status === statusFilter;

    const matchesPriority =
      priorityFilter === "ALL" || ticket.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const sortedTickets = [...filteredTickets].sort((a, b) => a.id - b.id);

  const totalPages = Math.ceil(sortedTickets.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentTickets = sortedTickets.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const countByStatus = (status) =>
    tickets.filter((ticket) => ticket.status === status).length;

  const assignedCount = tickets.filter((ticket) => ticket.assignedEmployeeId).length;
  const unassignedCount = tickets.filter((ticket) => !ticket.assignedEmployeeId).length;

  const criticalCount = tickets.filter(
    (ticket) => ticket.priority === "CRITICAL"
  ).length;

  const resolvedCount = countByStatus("RESOLVED") + countByStatus("CLOSED");
  const unresolvedCount = countByStatus("OPEN") + countByStatus("IN_PROGRESS");

  const criticalInProgressCount = tickets.filter(
    (ticket) =>
      ticket.status === "IN_PROGRESS" && ticket.priority === "CRITICAL"
  ).length;

  const nonCriticalInProgressCount = tickets.filter(
    (ticket) =>
      ticket.status === "IN_PROGRESS" && ticket.priority !== "CRITICAL"
  ).length;

  const buildCountData = (items, field) => {
    const result = {};

    items.forEach((item) => {
      const key = item[field] || "Unknown";
      result[key] = (result[key] || 0) + 1;
    });

    return Object.entries(result).map(([name, value]) => ({
      name,
      value,
    }));
  };

  const getChartData = () => {
    if (chartMode === "STATUS") return buildCountData(tickets, "status");
    if (chartMode === "PRIORITY") return buildCountData(tickets, "priority");

    if (chartMode === "ASSIGNMENT") {
      return [
        { name: "Assigned", value: assignedCount },
        { name: "Unassigned", value: unassignedCount },
      ];
    }

    if (chartMode === "CRITICAL_CATEGORY") {
      return buildCountData(
        tickets.filter((ticket) => ticket.priority === "CRITICAL"),
        "category"
      );
    }

    if (chartMode === "OPEN_CATEGORY") {
      return buildCountData(
        tickets.filter((ticket) => ticket.status === "OPEN"),
        "category"
      );
    }

    if (chartMode === "IN_PROGRESS_CATEGORY") {
      return buildCountData(
        tickets.filter((ticket) => ticket.status === "IN_PROGRESS"),
        "category"
      );
    }

    return [];
  };

  const getChartTitle = () => {
    if (chartMode === "STATUS") return "Ticket Status Distribution";
    if (chartMode === "PRIORITY") return "Ticket Priority Distribution";
    if (chartMode === "ASSIGNMENT") return "Ticket Assignment Distribution";
    if (chartMode === "CRITICAL_CATEGORY") return "Critical Tickets by Category";
    if (chartMode === "OPEN_CATEGORY") return "Open Tickets by Category";
    if (chartMode === "IN_PROGRESS_CATEGORY")
      return "In Progress Tickets by Category";

    return "Ticket Analytics";
  };

  const chartData = getChartData();

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
        <button
          className="ticket-stat-card"
          onClick={() => setChartMode("STATUS")}
        >
          <div className="ticket-stat-icon blue">
            <Ticket size={22} />
          </div>
          <div>
            <span>Total Tickets</span>
            <strong>{tickets.length}</strong>
          </div>
        </button>

        <button
          className="ticket-stat-card"
          onClick={() => setChartMode("OPEN_CATEGORY")}
        >
          <div className="ticket-stat-icon orange">
            <Clock size={22} />
          </div>
          <div>
            <span>Unresolved</span>
            <strong>{unresolvedCount}</strong>
          </div>
        </button>

        <button
          className="ticket-stat-card"
          onClick={() => setChartMode("PRIORITY")}
        >
          <div className="ticket-stat-icon green">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <span>Resolved</span>
            <strong>{resolvedCount}</strong>
          </div>
        </button>

        <button
          className="ticket-stat-card"
          onClick={() => setChartMode("CRITICAL_CATEGORY")}
        >
          <div className="ticket-stat-icon red">
            <AlertCircle size={22} />
          </div>
          <div>
            <span>Critical</span>
            <strong>{criticalCount}</strong>
          </div>
        </button>
      </div>

      <div className="ticket-analytics-card">
        <div className="analytics-header">
          <div>
            <h2>{getChartTitle()}</h2>
            <p>Hover over chart segments to see ticket counts.</p>
          </div>

          <div className="analytics-tabs">
            <button
              className={chartMode === "STATUS" ? "active" : ""}
              onClick={() => setChartMode("STATUS")}
            >
              Status
            </button>

            <button
              className={chartMode === "PRIORITY" ? "active" : ""}
              onClick={() => setChartMode("PRIORITY")}
            >
              Priority
            </button>

            <button
              className={chartMode === "ASSIGNMENT" ? "active" : ""}
              onClick={() => setChartMode("ASSIGNMENT")}
            >
              Assignment
            </button>

            <button
              className={chartMode === "OPEN_CATEGORY" ? "active" : ""}
              onClick={() => setChartMode("OPEN_CATEGORY")}
            >
              Open
            </button>

            <button
              className={chartMode === "IN_PROGRESS_CATEGORY" ? "active" : ""}
              onClick={() => setChartMode("IN_PROGRESS_CATEGORY")}
            >
              In Progress
            </button>

            <button
              className={chartMode === "CRITICAL_CATEGORY" ? "active" : ""}
              onClick={() => setChartMode("CRITICAL_CATEGORY")}
            >
              Critical
            </button>
          </div>
        </div>

        <div className="analytics-content">
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={105}
                  paddingAngle={4}
                >
                  {chartData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={chartColors[entry.name] || "#94a3b8"}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} tickets`, name]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="analytics-summary">
            <div>
              <span>Open</span>
              <strong>{countByStatus("OPEN")}</strong>
            </div>

            <div>
              <span>In Progress</span>
              <strong>{countByStatus("IN_PROGRESS")}</strong>
            </div>

            <div>
              <span>Assigned</span>
              <strong>{assignedCount}</strong>
            </div>

            <div>
              <span>Unassigned</span>
              <strong>{unassignedCount}</strong>
            </div>

            <div>
              <span>Critical In Progress</span>
              <strong>{criticalInProgressCount}</strong>
            </div>

            <div>
              <span>Non-Critical In Progress</span>
              <strong>{nonCriticalInProgressCount}</strong>
            </div>
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
            placeholder="Search by ticket no, customer, phone, category, assignee..."
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
        <div className="ticket-pool-title">
          <div>
            <h2>Ticket Pool</h2>
            <p>
              Tickets are sorted by ticket ID. Assigned tickets show the owner;
              unassigned tickets can be taken.
            </p>
          </div>
        </div>

        <div className="tickets-table-header">
          <div>Ticket No</div>
          <div>Customer</div>
          <div>Category</div>
          <div>Sub Category</div>
          <div>Priority</div>
          <div>Status</div>
          <div>Created</div>
          <div>Assignment</div>
        </div>

        {currentTickets.map((ticket) => (
          <div
            className="tickets-table-row clickable-row"
            key={ticket.id}
            onClick={() => navigate(`/tickets/${ticket.id}`)}
          >
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

            <div>
              {ticket.assignedEmployeeId ? (
                <span className="assigned-label">
                  {ticket.assignedEmployeeName}
                </span>
              ) : (
                <button
                  className="take-ticket-btn"
                  onClick={(e) => handleTakeTicket(e, ticket.id)}
                >
                  Take
                </button>
              )}
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