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
import CreateTicket from "./pages/CreateTicket/CreateTicket";
import Categories from "./pages/Category/Categories";
import Reports from "./pages/Reports/Reports";
import Settings from "./pages/Settings/Settings";

function Layout({ children }) {
  return (
    <div className="app">
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/customers"
          element={
            <ProtectedRoute>
              <Layout>
                <Customers />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/customers/new"
          element={
            <ProtectedRoute>
              <Layout>
                <CreateCustomer />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/customers/:id/edit"
          element={
            <ProtectedRoute>
              <Layout>
                <UpdateCustomer />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/customers/:id/status-history"
          element={
            <ProtectedRoute>
              <Layout>
                <CustomerStatusHistory />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/customers/:id/tickets"
          element={
            <ProtectedRoute>
              <Layout>
                <CustomerTickets />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/tickets"
          element={
            <ProtectedRoute>
              <Layout>
                <Tickets />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/tickets/new"
          element={
            <ProtectedRoute>
              <Layout>
                <CreateTicket />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <Layout>
                <Categories />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Layout>
                <Reports />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Layout>
                <Settings />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;