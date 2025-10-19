import React, { useState } from "react";
import UsernameChecker from "./components/UsernameChecker";
import HealthStatus from "./components/HealthStatus";
import APITester from "./components/APITester";
import "./styles/index.css";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"main" | "testing">("main");

  return (
    <div className="App">
      <div className="app-container">
        <header className="app-header">
          <h1 className="app-title">Username Management System</h1>
          <p className="app-subtitle">
            Check availability, register usernames, and get suggestions
          </p>
        </header>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button
            onClick={() => setActiveTab("main")}
            className={`tab-button ${
              activeTab === "main"
                ? "tab-button--active"
                : "tab-button--inactive"
            }`}
          >
            Main Interface
          </button>
          <button
            onClick={() => setActiveTab("testing")}
            className={`tab-button ${
              activeTab === "testing"
                ? "tab-button--active"
                : "tab-button--inactive"
            }`}
          >
            API Testing
          </button>
        </div>

        <HealthStatus />

        {activeTab === "main" && <UsernameChecker />}
        {activeTab === "testing" && <APITester />}

        <footer className="app-footer">
          <p className="footer-description">
            Powered by Redis, PostgreSQL, and Bloom Filters for high-performance
            username management
          </p>
          <div className="footer-apis">
            <span className="footer-apis-title">Available APIs:</span>
            <span className="footer-apis-list">
              Health Check • Username Availability • Registration • Suggestions
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
