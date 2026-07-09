import { useEffect, useMemo, useState } from "react";
import {
  TrendingUp,
  Award,
  MapPin,
  Users,
  Ticket,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Activity,
  Flag,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import "./Reports.css";

const CHART_COLORS = {
  LOW: "#22c55e",
  MEDIUM: "#f59e0b",
  HIGH: "#ef4444",
  CRITICAL: "#111827",

  OPEN: "#2563eb",
  IN_PROGRESS: "#7c3aed",
  ON_HOLD: "#f59e0b",
  RESOLVED: "#16a34a",
  CLOSED: "#64748b",

  ACTIVE: "#10b981",
  INACTIVE: "#ef4444",
  SUSPENDED: "#f59e0b",
  POTENTIAL: "#8b5cf6",

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

import { getCustomerStatusCounts } from "../../services/customerService";
import {
  getTicketSummary,
  getTopCategory,
  getTopProvince,
  getTopPriority,
  getCategoryDistribution,
  getProvinceDistribution,
  getPriorityDistribution,
  getDailyTrend,
} from "../../services/reportsService";

const formatLabel = (value) =>
  value ? String(value).replaceAll("_", " ") : "Unknown";

const normalizeChartData = (data) => {
  if (!Array.isArray(data)) return [];

  return data.map((item) => {
    if (Array.isArray(item)) {
      return {
        name: String(item[0]),
        value: Number(item[1] || 0),
      };
    }

    return {
      name: String(item.name || "Unknown"),
      value: Number(item.value || 0),
    };
  });
};

const getTopItem = (data, emptyLabel = "None") => {
  if (!data.length) {
    return { name: emptyLabel, value: 0 };
  }

  return data[0];
};

const Reports = () => {
  const [ticketSummary, setTicketSummary] = useState(null);
  const [customerStats, setCustomerStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topCategory, setTopCategory] = useState(null);
  const [topProvince, setTopProvince] = useState(null);
  const [topPriority, setTopPriority] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [provinceData, setProvinceData] = useState([]);
  const [priorityData, setPriorityData] = useState([]);
  const [dailyTrendData, setDailyTrendData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          summary,
          stats,
          category,
          province,
          priority,
          categoryChart,
          provinceChart,
          priorityChart,
          trendChart,
        ] = await Promise.all([
          getTicketSummary(),
          getCustomerStatusCounts(),
          getTopCategory(),
          getTopProvince(),
          getTopPriority(),
          getCategoryDistribution(),
          getProvinceDistribution(),
          getPriorityDistribution(),
          getDailyTrend(),
        ]);

        setTicketSummary(summary);
        setCustomerStats(stats);
        setTopCategory(category);
        setTopProvince(province);
        setTopPriority(priority);
        setCategoryData(normalizeChartData(categoryChart));
        setProvinceData(normalizeChartData(provinceChart));
        setPriorityData(normalizeChartData(priorityChart));
        setDailyTrendData(trendChart || []);
      } catch (err) {
        console.error("Error loading reports data:", err);
        setError("An error occurred while loading reports data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const customerStatusData = useMemo(() => {
    if (!customerStats) return [];

    return [
      { name: "ACTIVE", value: customerStats.activeCustomers || 0 },
      { name: "INACTIVE", value: customerStats.inactiveCustomers || 0 },
      { name: "SUSPENDED", value: customerStats.suspendedCustomers || 0 },
      { name: "POTENTIAL", value: customerStats.potentialCustomers || 0 },
    ];
  }, [customerStats]);


  const kpis = useMemo(() => {
    const totalTickets = ticketSummary?.totalTickets || 0;
    const openTickets = ticketSummary?.openTickets || 0;
    const inProgressTickets = ticketSummary?.inProgressTickets || 0;
    const onHoldTickets = ticketSummary?.onHoldTickets || 0;
    const resolvedTickets = ticketSummary?.resolvedTickets || 0;
    const criticalTickets = ticketSummary?.criticalTickets || 0;

    const resolutionRate = ticketSummary?.resolutionRate || 0;

    const totalCustomers = customerStats?.totalCustomers || 0;
    const activeCustomers = customerStats?.activeCustomers || 0;
    const potentialCustomers = customerStats?.potentialCustomers || 0;

    const topCategoryData = topCategory || { name: "None", value: 0 };
    const topProvinceData = topProvince || { name: "None", value: 0 };
    const topPriorityData = topPriority || { name: "None", value: 0 };
    const topCustomerStatus = getTopItem(
      customerStatusData.filter((item) => item.value > 0),
    );

    return {
      totalTickets,
      openTickets,
      inProgressTickets,
      onHoldTickets,
      resolvedTickets,
      criticalTickets,
      totalCustomers,
      activeCustomers,
      potentialCustomers,
      resolutionRate,
      topCategory: topCategoryData,
      topProvince: topProvinceData,
      topPriority: topPriorityData,
      topCustomerStatus,
    };
  }, [
    customerStats,
    customerStatusData,
    ticketSummary,
    topCategory,
    topProvince,
    topPriority,
  ]);

  const statistics = useMemo(
    () => [
      {
        title: "Most Active Category",
        value: kpis.topCategory.name,
        detail: `${kpis.topCategory.value} ticket${kpis.topCategory.value === 1 ? "" : "s"}`,
        icon: Layers,
        tone: "blue",
      },
      {
        title: "Province with Most Tickets",
        value: kpis.topProvince.name,
        detail: `${kpis.topProvince.value} ticket${kpis.topProvince.value === 1 ? "" : "s"}`,
        icon: MapPin,
        tone: "purple",
      },
      {
        title: "Most Common Priority",
        value: formatLabel(kpis.topPriority.name),
        detail: `${kpis.topPriority.value} ticket${kpis.topPriority.value === 1 ? "" : "s"}`,
        icon: Flag,
        tone: "red",
      },
      {
        title: "Most Common Customer Status",
        value: formatLabel(kpis.topCustomerStatus.name),
        detail: `${kpis.topCustomerStatus.value} customer${kpis.topCustomerStatus.value === 1 ? "" : "s"}`,
        icon: Users,
        tone: "green",
      },
    ],
    [kpis],
  );

  if (loading) {
    return (
      <div className="reports-loading">
        <div className="spinner"></div>
        <p>Analysis reports are being prepared...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reports-error">
        <AlertTriangle size={48} className="error-icon" />
        <h3>System Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="reports-page">
      <div className="reports-header">
        <div>
          <h1>Reports and Analytics</h1>
          <p>
            Customer service performance, ticket categories, priorities, and
            customer status charts.
          </p>
        </div>
      </div>

      <div className="reports-kpi-grid">
        <div className="report-card kpi">
          <div className="kpi-icon-wrap blue">
            <Ticket size={24} />
          </div>
          <div className="kpi-details">
            <span>Total Tickets</span>
            <strong>{kpis.totalTickets}</strong>
            <p className="kpi-subtext">
              Open tickets: <b>{kpis.openTickets}</b>
            </p>
          </div>
        </div>

        <div className="report-card kpi">
          <div className="kpi-icon-wrap purple">
            <Activity size={24} />
          </div>
          <div className="kpi-details">
            <span>Active Workload</span>
            <strong>{kpis.inProgressTickets + kpis.onHoldTickets}</strong>
            <p className="kpi-subtext">In progress / on hold tickets</p>
          </div>
        </div>

        <div className="report-card kpi">
          <div className="kpi-icon-wrap green">
            <Award size={24} />
          </div>
          <div className="kpi-details">
            <span>Resolution Rate</span>
            <strong>{kpis.resolutionRate}%</strong>
            <p className="kpi-subtext">
              Resolved or closed: <b>{kpis.resolvedTickets}</b>
            </p>
          </div>
        </div>

        <div className="report-card kpi">
          <div className="kpi-icon-wrap red">
            <AlertTriangle size={24} />
          </div>
          <div className="kpi-details">
            <span>Critical Tickets</span>
            <strong
              className={kpis.criticalTickets > 0 ? "critical-pulse" : ""}
            >
              {kpis.criticalTickets}
            </strong>
            <p className="kpi-subtext">Requires immediate attention</p>
          </div>
        </div>
      </div>

      <div className="reports-aux-grid">
        {statistics.map((item) => {
          const Icon = item.icon;

          return (
            <div className="report-card aux-item" key={item.title}>
              <div className="aux-header">
                <Icon size={18} />
                <h4>{item.title}</h4>
              </div>
              <div className="aux-body">
                <strong>{item.value}</strong>
                <span>{item.detail}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="reports-charts-grid">
        <div className="report-card chart-container span-2">
          <div className="chart-header">
            <h3>Ticket Volume & Resolution Performance</h3>
            <p>
              Daily newly added and resolved ticket counts for the last 15 days
            </p>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={dailyTrendData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="colorResolved"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "#64748b" }}
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "#64748b" }}
                />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "none",
                    borderRadius: "10px",
                    color: "#f8fafc",
                    fontSize: "12px",
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
                  }}
                />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ paddingTop: "15px", fontSize: "12px" }}
                />
                <Area
                  name="New Tickets"
                  type="monotone"
                  dataKey="Created"
                  stroke="#2563eb"
                  fillOpacity={1}
                  fill="url(#colorCreated)"
                  strokeWidth={2.5}
                />
                <Area
                  name="Resolved / Closed"
                  type="monotone"
                  dataKey="Resolved"
                  stroke="#16a34a"
                  fillOpacity={1}
                  fill="url(#colorResolved)"
                  strokeWidth={2.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="report-card chart-container">
          <div className="chart-header">
            <h3>Tickets by Category</h3>
            <p>Total distribution of tickets by service category</p>
          </div>
          <div className="chart-wrapper">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={categoryData}
                  layout="vertical"
                  margin={{ top: 10, right: 10, left: 15, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke="#e2e8f0"
                  />
                  <XAxis
                    type="number"
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 10, fill: "#64748b" }}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 10, fill: "#475569", fontWeight: 600 }}
                    width={90}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "none",
                      borderRadius: "10px",
                      color: "#f8fafc",
                      fontSize: "12px",
                    }}
                  />
                  <Bar
                    dataKey="value"
                    name="Ticket Count"
                    radius={[0, 6, 6, 0]}
                    barSize={12}
                  >
                    {categoryData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={CHART_COLORS[entry.name] || CHART_COLORS.Other}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="no-data-placeholder">No data found.</div>
            )}
          </div>
        </div>

        <div className="report-card chart-container">
          <div className="chart-header">
            <h3>Top Issue Provinces</h3>
            <p>Ticket volume grouped by issue location</p>
          </div>
          <div className="chart-wrapper">
            {provinceData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={provinceData}
                  layout="vertical"
                  margin={{ top: 10, right: 10, left: 15, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke="#e2e8f0"
                  />
                  <XAxis
                    type="number"
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 10, fill: "#64748b" }}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 10, fill: "#475569", fontWeight: 600 }}
                    width={90}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "none",
                      borderRadius: "10px",
                      color: "#f8fafc",
                      fontSize: "12px",
                    }}
                  />
                  <Bar
                    dataKey="value"
                    name="Ticket Count"
                    fill="#2563eb"
                    radius={[0, 6, 6, 0]}
                    barSize={12}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="no-data-placeholder">No data found.</div>
            )}
          </div>
        </div>


        <div className="report-card chart-container">
          <div className="chart-header">
            <h3>Data-Driven Summary</h3>
            <p>Calculated directly from current tickets and customers</p>
          </div>
          <div className="insights-list">
            <div className="insight-item info">
              <div className="insight-icon">
                <Layers size={16} />
              </div>
              <div className="insight-content">
                <h5>Most Active Category</h5>
                <p>
                  {kpis.topCategory.name} has the highest ticket volume with{" "}
                  {kpis.topCategory.value} ticket
                  {kpis.topCategory.value === 1 ? "" : "s"}.
                </p>
              </div>
            </div>

            <div className="insight-item warning">
              <div className="insight-icon">
                <AlertTriangle size={16} />
              </div>
              <div className="insight-content">
                <h5>Critical Ticket Load</h5>
                <p>
                  There {kpis.criticalTickets === 1 ? "is" : "are"}{" "}
                  {kpis.criticalTickets} critical priority ticket
                  {kpis.criticalTickets === 1 ? "" : "s"} in the current data.
                </p>
              </div>
            </div>

            <div className="insight-item success">
              <div className="insight-icon">
                <CheckCircle2 size={16} />
              </div>
              <div className="insight-content">
                <h5>Customer Base</h5>
                <p>
                  {kpis.activeCustomers} of {kpis.totalCustomers} registered
                  customer{kpis.totalCustomers === 1 ? "" : "s"} are active.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
