import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Sidebar from "./components/Sidebar/Sidebar";
import Customers from "./pages/Customers/Customers";
import CreateCustomer from "./pages/CreateCustomer/CreateCustomer";
import CustomerStatusHistory from "./pages/CustomerStatusHistory/CustomerStatusHistory";
import Categories from "./pages/Category/Categories";
import Settings from "./pages/Settings/Settings";
import Tickets from "./pages/Tickets/Tickets";
import CreateTicket from "./pages/CreateTicket/CreateTicket";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Reports from "./pages/Reports/Reports";
import UpdateCustomer from "./pages/UpdateCustomer/UpdateCustomer";
import CustomerTickets from "./pages/CustomerTickets/CustomerTickets";
import TicketDetail from "./pages/Tickets/TicketDetail";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Sidebar />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/new" element={<CreateCustomer />} />
            <Route
              path="/customers/:id/status-history"
              element={<CustomerStatusHistory />}
            />
            <Route path="/categories" element={<Categories />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/tickets/new" element={<CreateTicket />} />
            <Route path="/tickets/:id" element={<TicketDetail />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/customers/:id/edit" element={<UpdateCustomer />} />
            <Route
              path="/customers/:id/tickets"
              element={<CustomerTickets />}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
