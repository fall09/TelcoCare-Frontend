import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./CustomerStatusHistory.css";
import { getCustomerStatusHistory } from "../../services/customerService";

function CustomerStatusHistory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await getCustomerStatusHistory(id);
      setHistory(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const formatReason = (item) => {
    return item.inactiveReason || item.suspendedReason || "-";
  };

  return (
    <div className="history-page">
      <div className="history-card">
        <div className="history-header">
          <div>
            <h1>Status History</h1>
            <p>Customer ID #{id}</p>
          </div>

          <button onClick={() => navigate("/customers")}>Back</button>
        </div>

        {error && <div className="history-error">{error}</div>}

        {history.length === 0 ? (
          <div className="empty-history">No status history found.</div>
        ) : (
          <div className="history-list">
            {history.map((item) => (
              <div className="history-item" key={item.id}>
                <div className="history-status">
                  <span>{item.oldStatus}</span>
                  <strong>→</strong>
                  <span>{item.newStatus}</span>
                </div>

                <div className="history-meta">
                  <p>
                    <strong>Reason:</strong> {formatReason(item)}
                  </p>

                  <p>
                    <strong>Note:</strong> {item.note || "-"}
                  </p>

                  <p>
                    <strong>Changed At:</strong>{" "}
                    {new Date(item.changedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerStatusHistory;