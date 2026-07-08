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
  Save,
  Clock,
  MessageSquare,
  UserCheck,
} from "lucide-react";

import {
  getTicketById,
  updateTicket,
  getTicketStatusHistory,
  takeTicket,
} from "../../services/ticketService";

import "./TicketDetail.css";

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [taking, setTaking] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

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

      setDescription(ticketData.description || "");
      setPriority(ticketData.priority || "");
      setStatus(ticketData.status || "");
      setStatusNote("");
      setValidationError("");
    } catch (err) {
      console.error(err);
      setError("Bilet detayları yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  const isStatusChanged = ticket ? status !== ticket.status : false;

  const handleTakeTicket = async () => {
    try {
      setTaking(true);
      setValidationError("");

      const updated = await takeTicket(id);
      setTicket(updated);
      setSuccessMsg("Bilet başarıyla üzerinize alındı.");

      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      setValidationError(err.message || "Bilet üzerinize alınamadı.");
    } finally {
      setTaking(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");
    setSuccessMsg("");

    if (isStatusChanged && !statusNote.trim()) {
      setValidationError(
        "Bilet durumunu değiştirdiğinizde açıklama/not girilmesi zorunludur."
      );
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

      const updatedHistory = await getTicketStatusHistory(id);
      setHistory(updatedHistory);

      setStatusNote("");

      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      console.error(err);
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
      {successMsg && (
        <div className="toast-success">
          <CheckCircle2 size={20} className="toast-icon" />
          <span>{successMsg}</span>
        </div>
      )}

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
        <div className="layout-left">
          <div className="detail-card info-summary">
            <div className="ticket-assignment-box">
              {ticket.assignedEmployeeName ? (
                <div className="assigned-info">
                  <UserCheck size={18} />
                  <span>
                    Assigned to <strong>{ticket.assignedEmployeeName}</strong>
                  </span>
                </div>
              ) : (
                <button
                  type="button"
                  className="take-ticket-detail-btn"
                  onClick={handleTakeTicket}
                  disabled={taking}
                >
                  <UserCheck size={18} />
                  {taking ? "Taking..." : "Take This Ticket"}
                </button>
              )}
            </div>

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
                  <span>
                    {ticket.category} — {ticket.subCategory}
                  </span>
                </div>
              </div>

              <div className="info-item">
                <MapPin size={16} />
                <div>
                  <label>Bölge</label>
                  <span>
                    {ticket.issueProvince || "Belirtilmemiş"} /{" "}
                    {ticket.issueDistrict || "Belirtilmemiş"}
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
                  <span>
                    {ticket.updatedAt
                      ? new Date(ticket.updatedAt).toLocaleString("tr-TR")
                      : "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="detail-card edit-card">
            <h3>Bileti Düzenle</h3>

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Bilet Durumu</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="ON_HOLD">On Hold</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Öncelik</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Arıza Açıklaması</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {isStatusChanged && (
                <div className="form-group status-note-group animate-slide">
                  <label className="required-label">
                    Durum Değişiklik Açıklaması
                  </label>
                  <textarea
                    rows={3}
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    required
                  />
                </div>
              )}

              {validationError && (
                <div className="validation-error">
                  <AlertCircle size={16} />
                  <span>{validationError}</span>
                </div>
              )}

              <div className="form-actions">
                <button type="submit" disabled={saving} className="btn-submit">
                  <Save size={18} />
                  <span>{saving ? "Kaydediliyor..." : "Bileti Güncelle"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="layout-right">
          <div className="detail-card history-timeline-card">
            <div className="history-card-header">
              <Activity size={18} className="header-icon" />
              <h3>Bilet Durum Geçmişi</h3>
            </div>

            <div className="timeline-container">
              {history.length === 0 ? (
                <div className="empty-timeline">
                  Durum geçmişi kaydı bulunmuyor.
                </div>
              ) : (
                <div className="timeline">
                  {history.map((log, index) => (
                    <div className="timeline-item" key={log.id}>
                      <div className="timeline-indicator">
                        <div className="timeline-dot" />
                        {index < history.length - 1 && (
                          <div className="timeline-line" />
                        )}
                      </div>

                      <div className="timeline-content">
                        <div className="timeline-meta">
                          <span className="timeline-date">
                            {new Date(log.changedAt).toLocaleString("tr-TR")}
                          </span>
                        </div>

                        <div className="status-transition">
                          {log.oldStatus && log.oldStatus !== "NONE" && (
                            <>
                              <span
                                className={`status-badge-mini ${log.oldStatus.toLowerCase()}`}
                              >
                                {log.oldStatus.replace("_", " ")}
                              </span>
                              <span className="arrow-transition">→</span>
                            </>
                          )}

                          <span
                            className={`status-badge-mini ${log.newStatus.toLowerCase()}`}
                          >
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