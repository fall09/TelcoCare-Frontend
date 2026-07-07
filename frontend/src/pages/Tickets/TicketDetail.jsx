import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  User,
  Phone,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Tag,
  Activity,
  FileText,
  Save,
  Clock,
  MessageSquare
} from "lucide-react";
import {
  getTicketById,
  updateTicket,
  getTicketStatusHistory
} from "../../services/ticketService";
import "./TicketDetail.css";

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Form states
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    loadTicketAndHistory();
  }, [id]);

  const loadTicketAndHistory = async () => {
    try {
      setLoading(true);
      const ticketData = await getTicketById(id);
      const historyData = await getTicketStatusHistory(id);

      setTicket(ticketData);
      setHistory(historyData);

      // Initialize form fields
      setDescription(ticketData.description || "");
      setPriority(ticketData.priority || "");
      setStatus(ticketData.status || "");
      setStatusNote("");
      setValidationError("");
    } catch (err) {
      console.error("Error loading ticket data:", err);
      setError("Bilet detayları yüklenemedi. Bilet mevcut olmayabilir.");
    } finally {
      setLoading(false);
    }
  };

  const isStatusChanged = ticket ? status !== ticket.status : false;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");
    setSuccessMsg("");

    // Validate status note if status changed
    if (isStatusChanged && !statusNote.trim()) {
      setValidationError("Bilet durumunu değiştirdiğinizde açıklama/not girilmesi zorunludur.");
      return;
    }

    try {
      setSaving(true);
      const updated = await updateTicket(id, {
        status,
        priority,
        description,
        note: isStatusChanged ? statusNote : "",
      });

      setTicket(updated);
      setSuccessMsg("Bilet detayları başarıyla güncellendi.");
      
      // Reload history logs
      const updatedHistory = await getTicketStatusHistory(id);
      setHistory(updatedHistory);
      
      // Reset status change note
      setStatusNote("");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      console.error("Error updating ticket:", err);
      setValidationError("Güncelleme sırasında bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="ticket-detail-loading">
        <div className="spinner"></div>
        <p>Bilet detayları yükleniyor...</p>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="ticket-detail-error">
        <AlertCircle size={48} className="error-icon" />
        <h3>Bilet Bulunamadı</h3>
        <p>{error}</p>
        <button onClick={() => navigate("/tickets")} className="btn-back">
          <ArrowLeft size={16} /> Bilet Listesine Dön
        </button>
      </div>
    );
  }

  return (
    <div className="ticket-detail-page">
      {/* Toast message */}
      {successMsg && (
        <div className="toast-success">
          <CheckCircle2 size={20} className="toast-icon" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Header section */}
      <div className="detail-header">
        <button onClick={() => navigate("/tickets")} className="btn-back-link">
          <ArrowLeft size={18} />
          <span>Biletler</span>
        </button>
        <div className="header-title-row">
          <div>
            <h1>{ticket.ticketNumber}</h1>
            <p>Müşteri Destek Bilet Detayları ve Durum Geçişleri</p>
          </div>
          <div className="status-badges-group">
            <span className={`status-badge ${ticket.status.toLowerCase()}`}>
              {ticket.status.replace("_", " ")}
            </span>
            <span className={`priority-badge ${ticket.priority.toLowerCase()}`}>
              {ticket.priority} Öncelik
            </span>
          </div>
        </div>
      </div>

      <div className="detail-layout">
        {/* Left Column: Form & Details */}
        <div className="layout-left">
          {/* Read-only Ticket Metadata */}
          <div className="detail-card info-summary">
            <h3>Bilet Genel Bilgileri</h3>
            <div className="info-grid">
              <div className="info-item">
                <User size={16} />
                <div>
                  <label>Müşteri Ad Soyad</label>
                  <strong>{ticket.customerName}</strong>
                </div>
              </div>

              <div className="info-item">
                <Phone size={16} />
                <div>
                  <label>Müşteri Telefon</label>
                  <span>{ticket.customerPhone}</span>
                </div>
              </div>

              <div className="info-item">
                <Tag size={16} />
                <div>
                  <label>Kategori / Alt Kategori</label>
                  <span>{ticket.category} — {ticket.subCategory}</span>
                </div>
              </div>

              <div className="info-item">
                <MapPin size={16} />
                <div>
                  <label>Bölge (İl / İlçe)</label>
                  <span>
                    {ticket.issueProvince || "Belirtilmemiş"} / {ticket.issueDistrict || "Belirtilmemiş"}
                  </span>
                </div>
              </div>

              <div className="info-item">
                <Calendar size={16} />
                <div>
                  <label>Oluşturulma Tarihi</label>
                  <span>{new Date(ticket.createdAt).toLocaleString("tr-TR")}</span>
                </div>
              </div>

              <div className="info-item">
                <Clock size={16} />
                <div>
                  <label>Son Güncelleme</label>
                  <span>{ticket.updatedAt ? new Date(ticket.updatedAt).toLocaleString("tr-TR") : "-"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="detail-card edit-card">
            <h3>Bileti Düzenle</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="status">Bilet Durumu</label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="OPEN">Open (Açık)</option>
                    <option value="IN_PROGRESS">In Progress (İşlemde)</option>
                    <option value="ON_HOLD">On Hold (Beklemede)</option>
                    <option value="RESOLVED">Resolved (Çözüldü)</option>
                    <option value="CLOSED">Closed (Kapatıldı)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="priority">Öncelik Derecesi</label>
                  <select
                    id="priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="LOW">Low (Düşük)</option>
                    <option value="MEDIUM">Medium (Orta)</option>
                    <option value="HIGH">High (Yüksek)</option>
                    <option value="CRITICAL">Critical (Kritik)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Arıza Açıklaması / Detayı</label>
                <textarea
                  id="description"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Arıza detaylı açıklamasını girin..."
                />
              </div>

              {/* Status Note (Conditional and Required on status change) */}
              {isStatusChanged && (
                <div className="form-group status-note-group animate-slide">
                  <label htmlFor="statusNote" className="required-label">
                    Durum Değişiklik Açıklaması (Zorunlu)
                  </label>
                  <textarea
                    id="statusNote"
                    rows={3}
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="Bilet durumunu neden değiştirdiğinize dair açıklama girin..."
                    required
                  />
                  <small className="help-text">
                    Durum geçişleri sırasında gerekçelendirme yapmak operasyon takibi için zorunludur.
                  </small>
                </div>
              )}

              {validationError && (
                <div className="validation-error">
                  <AlertCircle size={16} />
                  <span>{validationError}</span>
                </div>
              )}

              <div className="form-actions">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-submit"
                >
                  <Save size={18} />
                  <span>{saving ? "Kaydediliyor..." : "Bileti Güncelle"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Status History Timeline */}
        <div className="layout-right">
          <div className="detail-card history-timeline-card">
            <div className="history-card-header">
              <Activity size={18} className="header-icon" />
              <h3>Bilet Durum Geçmişi</h3>
            </div>
            
            <div className="timeline-container">
              {history.length === 0 ? (
                <div className="empty-timeline">Durum geçmişi kaydı bulunmuyor.</div>
              ) : (
                <div className="timeline">
                  {history.map((log, index) => (
                    <div className="timeline-item" key={log.id}>
                      <div className="timeline-indicator">
                        <div className="timeline-dot" />
                        {index < history.length - 1 && <div className="timeline-line" />}
                      </div>
                      
                      <div className="timeline-content">
                        <div className="timeline-meta">
                          <span className="timeline-date">
                            {new Date(log.changedAt).toLocaleString("tr-TR")}
                          </span>
                        </div>

                        <div className="status-transition">
                          {log.oldStatus && log.oldStatus !== "NONE" ? (
                            <>
                              <span className={`status-badge-mini ${log.oldStatus.toLowerCase()}`}>
                                {log.oldStatus.replace("_", " ")}
                              </span>
                              <span className="arrow-transition">→</span>
                            </>
                          ) : null}
                          <span className={`status-badge-mini ${log.newStatus.toLowerCase()}`}>
                            {log.newStatus.replace("_", " ")}
                          </span>
                        </div>

                        {log.note && (
                          <div className="timeline-note">
                            <MessageSquare size={12} className="note-icon" />
                            <p>{log.note}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
