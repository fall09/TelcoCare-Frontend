import "./Tickets.css";

const tickets = [
  {
    id: "TT-2026-000001",
    customer: "Ahmet Yılmaz",
    category: "Internet",
    subCategory: "No Internet Connection",
    priority: "HIGH",
    status: "OPEN",
    city: "İstanbul",
    district: "Kadıköy",
    createdAt: "03.07.2026 14:30",
  },
  {
    id: "TT-2026-000002",
    customer: "Ayşe Kaya",
    category: "Billing",
    subCategory: "Payment Failed",
    priority: "MEDIUM",
    status: "IN_PROGRESS",
    city: "Ankara",
    district: "Çankaya",
    createdAt: "03.07.2026 13:10",
  },
];

function Tickets() {
  return (
    <div className="tickets-page">
      <div className="page-header">
        <div>
          <h1>Tickets</h1>
          <p>Manage customer support tickets and issue records.</p>
        </div>

        <button className="create-ticket-btn">+ New Ticket</button>
      </div>

      <div className="filters-card">
        <input placeholder="Search by ticket no, customer or category..." />

        <select>
          <option>Status</option>
          <option>OPEN</option>
          <option>IN_PROGRESS</option>
          <option>ON_HOLD</option>
          <option>RESOLVED</option>
          <option>CLOSED</option>
        </select>

        <select>
          <option>Priority</option>
          <option>LOW</option>
          <option>MEDIUM</option>
          <option>HIGH</option>
          <option>CRITICAL</option>
        </select>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Ticket No</th>
              <th>Customer</th>
              <th>Category</th>
              <th>Sub Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Location</th>
              <th>Created At</th>
            </tr>
          </thead>

          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td className="ticket-id">{ticket.id}</td>
                <td>{ticket.customer}</td>
                <td>{ticket.category}</td>
                <td>{ticket.subCategory}</td>
                <td>
                  <span className={`badge priority ${ticket.priority.toLowerCase()}`}>
                    {ticket.priority}
                  </span>
                </td>
                <td>
                  <span className={`badge status ${ticket.status.toLowerCase()}`}>
                    {ticket.status}
                  </span>
                </td>
                <td>
                  {ticket.city} / {ticket.district}
                </td>
                <td>{ticket.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Tickets;