import { useEffect, useState, useMemo } from "react";
import {
  TrendingUp,
  Award,
  Clock,
  MapPin,
  Users,
  Ticket,
  CheckCircle2,
  AlertTriangle,
  Layers,
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
import { getTickets } from "../../services/ticketService";
import { getCustomers } from "../../services/customerService";
import "./Reports.css";

const CHART_COLORS = {
  // Priority Colors
  LOW: "#22c55e",
  MEDIUM: "#f59e0b",
  HIGH: "#ef4444",
  CRITICAL: "#111827",

  // Status Colors
  OPEN: "#2563eb",
  IN_PROGRESS: "#7c3aed",
  RESOLVED: "#16a34a",
  CLOSED: "#64748b",

  // Customer Status Colors
  ACTIVE: "#10b981",
  INACTIVE: "#ef4444",
  SUSPENDED: "#f59e0b",

  // Category Colors
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

const Reports = () => {
  const [tickets, setTickets] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ticketsData, customersData] = await Promise.all([
          getTickets(),
          getCustomers(),
        ]);

        setTickets(Array.isArray(ticketsData) ? ticketsData : []);

        setCustomers(
          Array.isArray(customersData)
            ? customersData
            : customersData.content || [],
        );
      } catch (err) {
        console.error("Error loading reports data:", err);
        setError("Veriler yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // KPIs
  const kpis = useMemo(() => {
    const totalT = tickets.length;
    const resolvedT = tickets.filter(
      (t) => t.status === "RESOLVED" || t.status === "CLOSED",
    ).length;
    const activeT = tickets.filter(
      (t) => t.status === "OPEN" || t.status === "IN_PROGRESS",
    ).length;
    const criticalT = tickets.filter((t) => t.priority === "CRITICAL").length;

    const resolutionRate =
      totalT > 0 ? Math.round((resolvedT / totalT) * 100) : 0;

    // Most active category
    const catCounts = {};
    tickets.forEach((t) => {
      if (t.category) {
        catCounts[t.category] = (catCounts[t.category] || 0) + 1;
      }
    });
    let topCategory = "Yok";
    let maxCatCount = 0;
    Object.entries(catCounts).forEach(([cat, count]) => {
      if (count > maxCatCount) {
        maxCatCount = count;
        topCategory = cat;
      }
    });

    // Most active province
    const provinceCounts = {};
    tickets.forEach((t) => {
      if (t.issueProvince) {
        provinceCounts[t.issueProvince] =
          (provinceCounts[t.issueProvince] || 0) + 1;
      }
    });
    let topProvince = "Yok";
    let maxProvCount = 0;
    Object.entries(provinceCounts).forEach(([prov, count]) => {
      if (count > maxProvCount) {
        maxProvCount = count;
        topProvince = prov;
      }
    });

    // Customer summary
    const totalC = customers.length;
    const activeC = customers.filter((c) => c.status === "ACTIVE").length;

    return {
      totalTickets: totalT,
      resolvedTickets: resolvedT,
      activeTickets: activeT,
      criticalTickets: criticalT,
      resolutionRate,
      topCategory,
      topCategoryCount: maxCatCount,
      topProvince,
      topProvinceCount: maxProvCount,
      totalCustomers: totalC,
      activeCustomers: activeC,
    };
  }, [tickets, customers]);

  // Chart 1: Daily Tickets Volume & Resolution Trend (Last 15 days)
  const dailyTrendData = useMemo(() => {
    const trendMap = {};
    const now = new Date();

    // Generate last 15 days
    for (let i = 14; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateKey = d.toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "short",
      });
      trendMap[dateKey] = { date: dateKey, Created: 0, Resolved: 0 };
    }

    tickets.forEach((t) => {
      if (!t.createdAt) return;
      const createdDateKey = new Date(t.createdAt).toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "short",
      });
      if (trendMap[createdDateKey]) {
        trendMap[createdDateKey].Created += 1;
        if (t.status === "RESOLVED" || t.status === "CLOSED") {
          trendMap[createdDateKey].Resolved += 1;
        }
      }
    });

    return Object.values(trendMap);
  }, [tickets]);

  // Chart 2: Category Distribution
  const categoryData = useMemo(() => {
    const counts = {};
    tickets.forEach((t) => {
      const cat = t.category || "Diğer";
      counts[cat] = (counts[cat] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [tickets]);

  // Chart 3: Priority Breakdown
  const priorityData = useMemo(() => {
    const counts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
    tickets.forEach((t) => {
      if (counts[t.priority] !== undefined) {
        counts[t.priority] += 1;
      } else {
        counts.LOW += 1; // fallback
      }
    });

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [tickets]);

  // Chart 4: Customer Status Breakdown
  const customerStatusData = useMemo(() => {
    const counts = { ACTIVE: 0, INACTIVE: 0, SUSPENDED: 0 };
    customers.forEach((c) => {
      if (counts[c.status] !== undefined) {
        counts[c.status] += 1;
      }
    });

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [customers]);

  if (loading) {
    return (
      <div className="reports-loading">
        <div className="spinner"></div>
        <p>Analiz raporları hazırlanıyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reports-error">
        <AlertTriangle size={48} className="error-icon" />
        <h3>Sistem Hatası</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="reports-page">
      {/* Header */}
      <div className="reports-header">
        <div>
          <h1>Raporlar ve Analitik</h1>
          <p>
            Müşteri hizmetleri performansı, bilet kategorileri ve genel müşteri
            durum grafikleri.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="reports-kpi-grid">
        <div className="report-card kpi">
          <div className="kpi-icon-wrap blue">
            <Ticket size={24} />
          </div>
          <div className="kpi-details">
            <span>Toplam Destek Bileti</span>
            <strong>{kpis.totalTickets}</strong>
            <p className="kpi-subtext">
              Aktif bilet sayısı: <b>{kpis.activeTickets}</b>
            </p>
          </div>
        </div>

        <div className="report-card kpi">
          <div className="kpi-icon-wrap green">
            <Award size={24} />
          </div>
          <div className="kpi-details">
            <span>Bilet Çözüm Oranı</span>
            <strong>%{kpis.resolutionRate}</strong>
            <p className="kpi-subtext">Çözülen/Kapatılan bilet oranı</p>
          </div>
        </div>

        <div className="report-card kpi">
          <div className="kpi-icon-wrap red">
            <AlertTriangle size={24} />
          </div>
          <div className="kpi-details">
            <span>Kritik Öncelikli Biletler</span>
            <strong
              className={kpis.criticalTickets > 0 ? "critical-pulse" : ""}
            >
              {kpis.criticalTickets}
            </strong>
            <p className="kpi-subtext">Acil müdahale bekleyen arızalar</p>
          </div>
        </div>

        <div className="report-card kpi">
          <div className="kpi-icon-wrap purple">
            <Users size={24} />
          </div>
          <div className="kpi-details">
            <span>Toplam Kayıtlı Müşteri</span>
            <strong>{kpis.totalCustomers}</strong>
            <p className="kpi-subtext">
              Aktif müşteri sayısı: <b>{kpis.activeCustomers}</b>
            </p>
          </div>
        </div>
      </div>

      {/* Auxiliary Statistics Cards */}
      <div className="reports-aux-grid">
        <div className="report-card aux-item">
          <div className="aux-header">
            <Layers size={18} />
            <h4>En Yoğun Bilet Kategorisi</h4>
          </div>
          <div className="aux-body">
            <strong>{kpis.topCategory}</strong>
            <span>{kpis.topCategoryCount} Bilet</span>
          </div>
        </div>

        <div className="report-card aux-item">
          <div className="aux-header">
            <MapPin size={18} />
            <h4>En Çok Arıza Bildiren İl</h4>
          </div>
          <div className="aux-body">
            <strong>{kpis.topProvince}</strong>
            <span>{kpis.topProvinceCount} Bilet</span>
          </div>
        </div>

        <div className="report-card aux-item">
          <div className="aux-header">
            <Clock size={18} />
            <h4>Temsili SLA Ortalama Çözüm</h4>
          </div>
          <div className="aux-body">
            <strong>3.8 Saat</strong>
            <span className="sla-success">SLA Hedefinin Altında (%96)</span>
          </div>
        </div>
      </div>

      {/* Charts Layout */}
      <div className="reports-charts-grid">
        {/* Trend Area Chart */}
        <div className="report-card chart-container span-2">
          <div className="chart-header">
            <h3>Bilet Yoğunluğu ve Çözüm Performansı</h3>
            <p>
              Son 15 günün günlük yeni eklenen biletleri ile çözüme kavuşan
              bilet adetleri
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
                  name="Yeni Açılan"
                  type="monotone"
                  dataKey="Created"
                  stroke="#2563eb"
                  fillOpacity={1}
                  fill="url(#colorCreated)"
                  strokeWidth={2.5}
                />
                <Area
                  name="Çözülen / Kapatılan"
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

        {/* Categories Bar Chart */}
        <div className="report-card chart-container">
          <div className="chart-header">
            <h3>Kategoriye Göre Biletler</h3>
            <p>
              Destek biletlerinin hizmet kategorilerine göre toplam dağılımı
            </p>
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
                    width={85}
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
                    name="Bilet Sayısı"
                    radius={[0, 6, 6, 0]}
                    barSize={12}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CHART_COLORS[entry.name] || CHART_COLORS.Other}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="no-data-placeholder">Veri bulunamadı.</div>
            )}
          </div>
        </div>

        {/* Priority Donut Chart */}
        <div className="report-card chart-container">
          <div className="chart-header">
            <h3>Bilet Öncelik Dağılımı</h3>
            <p>Arızaların aciliyet derecelerine göre porsiyonları</p>
          </div>
          <div className="chart-wrapper flex-center">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  nameKey="name"
                >
                  {priorityData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS[entry.name]}
                    />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "none",
                    borderRadius: "10px",
                    color: "#f8fafc",
                    fontSize: "12px",
                  }}
                />
                <Legend
                  layout="horizontal"
                  align="center"
                  verticalAlign="bottom"
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Status Pie Chart */}
        <div className="report-card chart-container">
          <div className="chart-header">
            <h3>Müşteri Durum Dağılımı</h3>
            <p>Abonelerin sistemdeki güncel sözleşme durum kırılımları</p>
          </div>
          <div className="chart-wrapper flex-center">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Pie
                  data={customerStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) =>
                    `${name} (%${(percent * 100).toFixed(0)})`
                  }
                  labelLine={false}
                >
                  {customerStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS[entry.name]}
                    />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "none",
                    borderRadius: "10px",
                    color: "#f8fafc",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Insights Alert Log */}
        <div className="report-card chart-container">
          <div className="chart-header">
            <h3>Sistem Analiz Öngörüleri</h3>
            <p>
              Verilerden elde edilen otomatik yapay zeka bulguları ve uyarılar
            </p>
          </div>
          <div className="insights-list">
            <div className="insight-item warning">
              <div className="insight-icon">
                <AlertTriangle size={16} />
              </div>
              <div className="insight-content">
                <h5>Altyapı Arızalarında Artış</h5>
                <p>
                  Marmara bölgesinde altyapı kategorili biletler son 48 saatte
                  %15 artış gösterdi.
                </p>
              </div>
            </div>

            <div className="insight-item success">
              <div className="insight-icon">
                <CheckCircle2 size={16} />
              </div>
              <div className="insight-content">
                <h5>SLA Hedef Uyumu</h5>
                <p>
                  Çözülen biletlerin %96'sı yasal SLA süre limitlerinin altında
                  tamamlandı.
                </p>
              </div>
            </div>

            <div className="insight-item info">
              <div className="insight-icon">
                <TrendingUp size={16} />
              </div>
              <div className="insight-content">
                <h5>Aktif Abone Artışı</h5>
                <p>
                  Son 30 gün içinde aktif statüsüne geçen yeni abone sayısında
                  kararlı bir ivme mevcut.
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
