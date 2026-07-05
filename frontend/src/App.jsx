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

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Sidebar />

        <main className="main-content">
          <Routes>
            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/new" element={<CreateCustomer />} />
            <Route path="/customers/:id/status-history" element={<CustomerStatusHistory />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/tickets/new" element={<CreateTicket />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;