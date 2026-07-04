import "./App.css";
import Sidebar from "./components/Sidebar/Sidebar";
import Customers from "./pages/Customers/Customers";

function App() {
  return (
    <div className="app">
      <Sidebar />

      <main className="main-content">
        <Customers />
      </main>
    </div>
  );
}

export default App;