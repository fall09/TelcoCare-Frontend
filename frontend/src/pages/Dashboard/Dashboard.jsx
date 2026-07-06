import { useEffect, useState, useMemo } from "react";
import { Users, Ticket, AlertTriangle, CheckCircle2 } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { getTickets } from "../../services/ticketService";
import { getCustomers } from "../../services/customerService";
import TurkeyMap from "../../components/TurkeyMap/TurkeyMap";
import { turkeyMapPaths } from "../../components/TurkeyMap/TurkeyMapPaths";
import "./Dashboard.css";

// Helper for Turkish case-insensitive comparison
const matchProvince = (pName, targetName) => {
  if (!pName || !targetName) return false;
  return pName.trim().toLocaleLowerCase("tr-TR") === targetName.trim().toLocaleLowerCase("tr-TR");
};

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [ticketsData, customersData] = await Promise.all([
          getTickets(),
          getCustomers(),
        ]);
        setTickets(ticketsData || []);
        setCustomers(customersData || []);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      }
    };

    loadDashboardData();
  }, []);

  // Filtered tickets/customers based on selected province
  const filteredTickets = useMemo(() => {
    if (!selectedProvince) return tickets;
    return tickets.filter((t) => matchProvince(t.issueProvince, selectedProvince.name));
  }, [tickets, selectedProvince]);

  const filteredCustomers = useMemo(() => {
    if (!selectedProvince) return customers;
    return customers.filter((c) => matchProvince(c.province, selectedProvince.name));
  }, [customers, selectedProvince]);

  // General KPIs computation
  const totalCustomersCount = useMemo(() => {
    return filteredCustomers.filter((c) => c.status === "ACTIVE").length;
  }, [filteredCustomers]);

  const totalTicketsCount = filteredTickets.length;

  const activeTicketsCount = useMemo(() => {
    return filteredTickets.filter((t) => t.status === "OPEN" || t.status === "IN_PROGRESS").length;
  }, [filteredTickets]);

  const solvedRatio = useMemo(() => {
    if (totalTicketsCount === 0) return 0;
    const solved = filteredTickets.filter((t) => t.status === "RESOLVED" || t.status === "CLOSED").length;
    return solved / totalTicketsCount;
  }, [filteredTickets, totalTicketsCount]);

  // Aggregate density map data per province (plateNumber -> metrics)
  const mapData = useMemo(() => {
    const provinceData = {};

    turkeyMapPaths.forEach((province) => {
      if (province.plateNumber === "99") return; // Ignore Cyprus

      const provTickets = tickets.filter((t) => matchProvince(t.issueProvince, province.name));
      const provCustomers = customers.filter((c) => matchProvince(c.province, province.name));

      const resolved = provTickets.filter((t) => t.status === "RESOLVED" || t.status === "CLOSED").length;
      const ratio = provTickets.length > 0 ? resolved / provTickets.length : 0;

      // Find top category
      const catCounts = {};
      provTickets.forEach((t) => {
        if (t.category) catCounts[t.category] = (catCounts[t.category] || 0) + 1;
      });
      let topCategory = "N/A";
      let maxCount = 0;
      Object.entries(catCounts).forEach(([cat, count]) => {
        if (count > maxCount) {
          maxCount = count;
          topCategory = cat;
        }
      });

      provinceData[province.plateNumber] = {
        ticketCount: provTickets.length,
        customerCount: provCustomers.filter((c) => c.status === "ACTIVE").length,
        resolvedRatio: ratio,
        topCategory,
      };
    });

    return provinceData;
  }, [tickets, customers]);

  // Trend Chart Data (Last 7 days ticket count)
  const trendChartData = useMemo(() => {
    const trendMap = {};
    const now = new Date();

    // Initialize last 7 days with 0
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateKey = d.toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
      trendMap[dateKey] = 0;
    }

    filteredTickets.forEach((t) => {
      if (!t.createdAt) return;
      const dateKey = new Date(t.createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
      if (trendMap[dateKey] !== undefined) {
        trendMap[dateKey] += 1;
      }
    });

    return Object.entries(trendMap).map(([date, count]) => ({
      date,
      Tickets: count,
    }));
  }, [filteredTickets]);

  // Recent/Critical Tickets (High & Critical priority tickets, last 5)
  const recentCriticalTickets = useMemo(() => {
    return filteredTickets
      .filter((t) => t.priority === "CRITICAL" || t.priority === "HIGH")
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }, [filteredTickets]);

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>
            {selectedProvince
              ? `${selectedProvince.name} ili detaylı telecom arıza ve müşteri verileri.`
              : "Türkiye genel durumu, bilet yoğunluk haritası ve genel performans metrikleri."}
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="dashboard-kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon blue">
            <Users size={22} />
          </div>
          <div className="kpi-info">
            <span>Active Customers</span>
            <strong>{totalCustomersCount}</strong>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon orange">
            <Ticket size={22} />
          </div>
          <div className="kpi-info">
            <span>Total Tickets</span>
            <strong>{totalTicketsCount}</strong>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon red">
            <AlertTriangle size={22} />
          </div>
          <div className="kpi-info">
            <span>Active Tickets</span>
            <strong>{activeTicketsCount}</strong>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon green">
            <CheckCircle2 size={22} />
          </div>
          <div className="kpi-info">
            <span>Solved Ratio</span>
            <strong>{Math.round(solvedRatio * 100)}%</strong>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="dashboard-main-section">
        {/* Left Side: Interative Turkey Map */}
        <div className="dashboard-left-panel">
          <TurkeyMap
            data={mapData}
            selectedProvince={selectedProvince}
            onSelectProvince={setSelectedProvince}
          />
        </div>

        {/* Right Side: Recharts trend and critical tickets */}
        <div className="dashboard-right-panel">
          {/* Trend Card */}
          <div className="trend-card">
            <div className="trend-card-header">
              <h3>Ticket Trends</h3>
              <p>Daily support tickets created in the last month</p>
            </div>
            <div style={{ width: "100%", height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendChartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#94a3b8" }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#94a3b8" }} />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "none",
                      borderRadius: "8px",
                      color: "#f8fafc",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="Tickets"
                    stroke="#2563eb"
                    fillOpacity={1}
                    fill="url(#colorTickets)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Critical Tickets Card */}
          <div className="recent-tickets-card">
            <div className="recent-tickets-header">
              <h3>Critical Alerts</h3>
              <p>Recent high priority and critical tickets</p>
            </div>
            <div className="tickets-list">
              {recentCriticalTickets.length > 0 ? (
                recentCriticalTickets.map((ticket) => (
                  <div key={ticket.id} className="ticket-item">
                    <div className="ticket-item-left">
                      <div
                        className={`status-dot ${ticket.priority === "CRITICAL" ? "critical" : "high"}`}
                      />
                      <div className="ticket-item-info">
                        <h4>{ticket.ticketNumber}</h4>
                        <span>{ticket.customerName}</span>
                      </div>
                    </div>
                    <div className="ticket-item-right">
                      <span className="ticket-item-category">{ticket.category}</span>
                      <span className={`ticket-item-priority ${ticket.priority.toLowerCase()}`}>
                        {ticket.priority}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-tickets">No critical tickets in this region.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
