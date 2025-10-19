import React, { useEffect, useState } from "react";
import { fetchHealthStatus, HealthResponse } from "../services/api";

const HealthStatus: React.FC = () => {
  const [healthStatus, setHealthStatus] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchHealthStatus();
      setHealthStatus(response);
      setLastChecked(new Date());
    } catch (err) {
      setError("Failed to fetch health status");
      setHealthStatus(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();

    // Auto-refresh every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    if (loading) return "#ffc107"; // yellow
    if (error || !healthStatus) return "#dc3545"; // red
    return healthStatus.status === "UP" ? "#28a745" : "#dc3545"; // green or red
  };

  const getStatusText = () => {
    if (loading) return "Checking...";
    if (error || !healthStatus) return "Service Down";
    return healthStatus.status === "UP" ? "Service Healthy" : "Service Down";
  };

  return (
    <div
      style={{
        backgroundColor: "#f8f9fa",
        border: "1px solid #dee2e6",
        borderRadius: "8px",
        padding: "15px",
        marginBottom: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "18px" }}>Service Health</h3>
        <button
          onClick={checkHealth}
          disabled={loading}
          style={{
            padding: "6px 12px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "12px",
          }}
        >
          {loading ? "Checking..." : "Refresh"}
        </button>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginTop: "10px",
        }}
      >
        <div
          style={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            backgroundColor: getStatusColor(),
          }}
        ></div>
        <span
          style={{
            fontWeight: "bold",
            color: getStatusColor(),
          }}
        >
          {getStatusText()}
        </span>
        {healthStatus && (
          <span style={{ fontSize: "12px", color: "#6c757d" }}>
            ({healthStatus.service})
          </span>
        )}
      </div>

      {lastChecked && (
        <div
          style={{
            fontSize: "12px",
            color: "#6c757d",
            marginTop: "5px",
          }}
        >
          Last checked: {lastChecked.toLocaleTimeString()}
        </div>
      )}

      {error && (
        <div
          style={{
            backgroundColor: "#f8d7da",
            color: "#721c24",
            padding: "8px",
            borderRadius: "4px",
            marginTop: "10px",
            fontSize: "14px",
          }}
        >
          ⚠️ {error}
        </div>
      )}
    </div>
  );
};

export default HealthStatus;
