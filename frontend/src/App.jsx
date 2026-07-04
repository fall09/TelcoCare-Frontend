import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Sidebar from "./components/Sidebar/Sidebar";
import Customers from "./pages/Customers/Customers";
import CreateCustomer from "./pages/CreateCustomer/CreateCustomer";
import CustomerStatusHistory from "./pages/CustomerStatusHistory/CustomerStatusHistory";
import Categories from "./pages/Category/Categories";

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
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;