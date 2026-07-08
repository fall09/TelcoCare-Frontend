import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Sidebar from "./components/Sidebar/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";

import Dashboard from "./pages/Dashboard/Dashboard";
import Customers from "./pages/Customers/Customers";
import CreateCustomer from "./pages/CreateCustomer/CreateCustomer";
import UpdateCustomer from "./pages/UpdateCustomer/UpdateCustomer";
import CustomerTickets from "./pages/CustomerTickets/CustomerTickets";
import CustomerStatusHistory from "./pages/CustomerStatusHistory/CustomerStatusHistory";

import Tickets from "./pages/Tickets/Tickets";
import MyTickets from "./pages/MyTickets/MyTickets";
import CreateTicket from "./pages/CreateTicket/CreateTicket";
import TicketDetail from "./pages/Tickets/TicketDetail";

import Categories from "./pages/Category/Categories";
import Reports from "./pages/Reports/Reports";
import Settings from "./pages/Settings/Settings";

import Register from "./pages/Auth/Register";

function Layout({ children }) {
  return (
    <div className="app">
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  );
}

function ProtectedPage({ children }) {
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedPage>
              <Dashboard />
            </ProtectedPage>
          }
        />

        <Route
          path="/customers"
          element={
            <ProtectedPage>
              <Customers />
            </ProtectedPage>
          }
        />

        <Route
          path="/customers/new"
          element={
            <ProtectedPage>
              <CreateCustomer />
            </ProtectedPage>
          }
        />

        <Route
          path="/customers/:id/edit"
          element={
            <ProtectedPage>
              <UpdateCustomer />
            </ProtectedPage>
          }
        />

        <Route
          path="/customers/:id/status-history"
          element={
            <ProtectedPage>
              <CustomerStatusHistory />
            </ProtectedPage>
          }
        />

        <Route
          path="/customers/:id/tickets"
          element={
            <ProtectedPage>
              <CustomerTickets />
            </ProtectedPage>
          }
        />

        <Route
          path="/tickets"
          element={
            <ProtectedPage>
              <Tickets />
            </ProtectedPage>
          }
        />

        <Route
          path="/my-tickets"
          element={
            <ProtectedPage>
              <MyTickets />
            </ProtectedPage>
          }
        />

        <Route
          path="/tickets/new"
          element={
            <ProtectedPage>
              <CreateTicket />
            </ProtectedPage>
          }
        />

        <Route
          path="/tickets/:id"
          element={
            <ProtectedPage>
              <TicketDetail />
            </ProtectedPage>
          }
        />

        <Route
          path="/categories"
          element={
            <ProtectedPage>
              <Categories />
            </ProtectedPage>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedPage>
              <Reports />
            </ProtectedPage>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedPage>
              <Settings />
            </ProtectedPage>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
