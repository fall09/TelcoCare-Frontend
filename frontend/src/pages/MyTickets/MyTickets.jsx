import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Ticket, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { getMyTickets } from "../../services/ticketService";
import "./MyTickets.css";

function MyTickets() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  useEffect(() => {
    loadMyTickets();
  }, []);

  const loadMyTickets = async () => {
    const data = await getMyTickets();
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

  const openCount = tickets.filter((t) => t.status === "OPEN").length;
  const progressCount = tickets.filter((t) => t.status === "IN_PROGRESS").length;
  const resolvedCount = tickets.filter(
    (t) => t.status === "RESOLVED" || t.status === "CLOSED"
  ).length;
  const criticalCount = tickets.filter((t) => t.priority === "CRITICAL").length;

  return (
    <div className="mytickets-page">
      <div className="page-header">
        <div>
          <h1>My Tickets</h1>
          <p>Tickets assigned to you.</p>
        </div>
      </div>

      <div className="mytickets-stats">
        <div className="myticket-stat-card">
          <div className="myticket-stat-icon blue">
            <Ticket size={22} />
          </div>
          <div>
            <span>Total</span>
            <strong>{tickets.length}</strong>
          </div>
        </div>

        <div className="myticket-stat-card">
          <div className="myticket-stat-icon orange">
            <Clock size={22} />
          </div>
          <div>
            <span>Open</span>
            <strong>{openCount}</strong>
          </div>
        </div>

        <div className="myticket-stat-card">
          <div className="myticket-stat-icon purple">
            <Clock size={22} />
          </div>
          <div>
            <span>In Progress</span>
            <strong>{progressCount}</strong>
          </div>
        </div>

        <div className="myticket-stat-card">
          <div className="myticket-stat-icon green">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <span>Resolved</span>
            <strong>{resolvedCount}</strong>
          </div>
        </div>

        <div className="myticket-stat-card">
          <div className="myticket-stat-icon red">
            <AlertCircle size={22} />
          </div>
          <div>
            <span>Critical</span>
            <strong>{criticalCount}</strong>
          </div>
        </div>
      </div>

      <div className="mytickets-filter-card">
        <div className="myticket-search">
          <Search size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ticket no, customer, phone, category..."
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Statuses</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="ALL">All Priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="CRITICAL">Critical</option>
        </select>
      </div>

      <div className="mytickets-table-card">
        <div className="mytickets-table-header">
          <div>Ticket No</div>
          <div>Customer</div>
          <div>Category</div>
          <div>Sub Category</div>
          <div>Priority</div>
          <div>Status</div>
          <div>Created</div>
        </div>

        {filteredTickets.length === 0 ? (
          <div className="mytickets-empty">No assigned tickets found.</div>
        ) : (
          filteredTickets.map((ticket) => (
            <div
              className="mytickets-table-row"
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
                <span className={`ticket-priority ${ticket.priority.toLowerCase()}`}>
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
          ))
        )}
      </div>
    </div>
  );
}

export default MyTickets;