import { useState, useMemo } from "react";
import { turkeyMapPaths } from "./TurkeyMapPaths";
import { X } from "lucide-react";
import "./TurkeyMap.css";

const TurkeyMap = ({ data = {}, selectedProvince = null, onSelectProvince }) => {
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, province: null, provinceData: null });

  // Filter out Cyprus (plateNumber 99)
  const provincesToRender = useMemo(() => {
    return turkeyMapPaths.filter((p) => p.plateNumber !== "99");
  }, []);

  // Calculate max tickets for choropleth scale normalization
  const maxTickets = useMemo(() => {
    const counts = Object.values(data).map((d) => d.ticketCount || 0);
    return counts.length > 0 ? Math.max(...counts, 1) : 1;
  }, [data]);

  // Pre-calculate fill colors for each province for maximum performance
  const fillColors = useMemo(() => {
    const colors = {};
    provincesToRender.forEach((province) => {
      const pCode = province.plateNumber;
      const pData = data[pCode];
      if (!pData || pData.ticketCount === 0) {
        // Low density / default color
        colors[pCode] = "rgba(255, 255, 255, 0.06)";
      } else {
        // Dynamic intensity scaling (HSL)
        // Light blue (low density) to Dark Blue/Indigo (high density)
        const intensity = pData.ticketCount / maxTickets;
        colors[pCode] = `hsla(220, 80%, ${70 - intensity * 35}%, ${0.25 + intensity * 0.75})`;
      }
    });
    return colors;
  }, [data, maxTickets, provincesToRender]);

  const handleMouseEnter = (e, province) => {
    const pData = data[province.plateNumber] || {
      ticketCount: 0,
      customerCount: 0,
      resolvedRatio: 0,
      topCategory: "None"
    };

    setTooltip({
      show: true,
      x: e.clientX,
      y: e.clientY,
      province,
      provinceData: pData
    });
  };

  const handleMouseMove = (e) => {
    if (!tooltip.show) return;
    setTooltip((prev) => ({
      ...prev,
      x: e.clientX,
      y: e.clientY
    }));
  };

  const handleMouseLeave = () => {
    setTooltip({ show: false, x: 0, y: 0, province: null, provinceData: null });
  };

  return (
    <div className="turkey-map-container">
      <div className="turkey-map-header">
        <h3>Region Density Map {selectedProvince && `— ${selectedProvince.name}`}</h3>
        {selectedProvince && (
          <button className="clear-filter-btn" onClick={() => onSelectProvince(null)}>
            <X size={14} />
            Filtreyi Temizle
          </button>
        )}
      </div>

      <svg
        version="1.1"
        id="svg-turkiye-haritasi"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1007.478 527.323"
        className="turkey-map-svg"
      >
        <g id="turkiye">
          {provincesToRender.map((province) => {
            const isSelected = selectedProvince && selectedProvince.plateNumber === province.plateNumber;
            const isDimmed = selectedProvince && selectedProvince.plateNumber !== province.plateNumber;

            return (
              <g
                key={province.plateNumber}
                id={province.id}
                className={`province-group ${isSelected ? "selected" : ""} ${isDimmed ? "dimmed" : ""}`}
                onClick={() => onSelectProvince(province)}
                onMouseEnter={(e) => handleMouseEnter(e, province)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                {province.paths.map((d, idx) => (
                  <path
                    key={idx}
                    d={d}
                    className={`province-path interactive ${isSelected ? "selected" : ""}`}
                    fill={fillColors[province.plateNumber]}
                  />
                ))}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Floating Tooltip */}
      {tooltip.show && tooltip.province && (
        <div
          className="map-tooltip"
          style={{
            top: tooltip.y + 15,
            left: tooltip.x + 15
          }}
        >
          <div className="tooltip-header">
            <h4>{tooltip.province.name}</h4>
          </div>
          <div className="tooltip-metrics">
            <div className="tooltip-metric">
              <span className="label">Active Customers</span>
              <span className="value">{tooltip.provinceData.customerCount}</span>
            </div>
            <div className="tooltip-metric">
              <span className="label">Total Tickets</span>
              <span className="value highlight">{tooltip.provinceData.ticketCount}</span>
            </div>
            <div className="tooltip-metric">
              <span className="label">Solved Ratio</span>
              <span className="value">
                {tooltip.provinceData.ticketCount > 0
                  ? `${Math.round(tooltip.provinceData.resolvedRatio * 100)}%`
                  : "0%"}
              </span>
            </div>
            <div className="tooltip-metric">
              <span className="label">Top Category</span>
              <span className="value" style={{ fontSize: "0.75rem" }}>
                {tooltip.provinceData.topCategory}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TurkeyMap;
