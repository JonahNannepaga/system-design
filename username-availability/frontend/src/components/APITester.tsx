import React, { useState } from "react";
import {
  checkUsernameAvailability,
  registerUsername,
  getUsernameSuggestions,
  fetchHealthStatus,
} from "../services/api";

interface TestResult {
  id: string;
  name: string;
  status: "pending" | "success" | "error";
  response?: any;
  error?: string;
  timestamp: Date;
}

const APITester: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addTestResult = (result: TestResult) => {
    setTestResults((prev) => [...prev, result]);
  };

  const updateTestResult = (id: string, updates: Partial<TestResult>) => {
    setTestResults((prev) =>
      prev.map((result) =>
        result.id === id ? { ...result, ...updates } : result
      )
    );
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const runTest = async (
    id: string,
    name: string,
    testFn: () => Promise<any>
  ) => {
    const testResult: TestResult = {
      id,
      name,
      status: "pending",
      timestamp: new Date(),
    };

    addTestResult(testResult);

    try {
      const response = await testFn();
      updateTestResult(id, {
        status: "success",
        response,
      });
    } catch (error: any) {
      updateTestResult(id, {
        status: "error",
        error: error.message,
      });
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    clearResults();

    const tests = [
      {
        id: "health-check",
        name: "Health Check",
        test: () => fetchHealthStatus(),
      },
      {
        id: "check-available",
        name: "Check Available Username",
        test: () => checkUsernameAvailability(`testuser${Date.now()}`),
      },
      {
        id: "register-user",
        name: "Register Username",
        test: async () => {
          const username = `testuser${Date.now()}`;
          const userId = `0001`;
          return registerUsername(username, userId);
        },
      },
      {
        id: "check-taken",
        name: "Check Taken Username",
        test: () => checkUsernameAvailability("admin"),
      },
      {
        id: "register-duplicate",
        name: "Try Duplicate Registration",
        test: () => registerUsername("admin", "user-duplicate"),
      },
      {
        id: "suggestions-5",
        name: "Get 5 Suggestions",
        test: () => getUsernameSuggestions("admin", 5),
      },
      {
        id: "suggestions-3",
        name: "Get 3 Suggestions",
        test: () => getUsernameSuggestions("user", 3),
      },
      {
        id: "suggestions-10",
        name: "Get 10 Suggestions",
        test: () => getUsernameSuggestions("test", 10),
      },
    ];

    for (const test of tests) {
      await runTest(test.id, test.name, test.test);
      // Add small delay between tests
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    setIsRunning(false);
  };

  const runSingleTest = async (testName: string) => {
    const singleTests: { [key: string]: () => Promise<any> } = {
      health: () => fetchHealthStatus(),
      check: () => checkUsernameAvailability(`single${Date.now()}`),
      register: () =>
        registerUsername(`single${Date.now()}`, `user-${Date.now()}`),
      suggest: () => getUsernameSuggestions("developer", 5),
    };

    if (singleTests[testName]) {
      await runTest(
        `single-${testName}-${Date.now()}`,
        `Single ${testName} Test`,
        singleTests[testName]
      );
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return "⏳";
      case "success":
        return "✅";
      case "error":
        return "❌";
      default:
        return "❓";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#ffc107";
      case "success":
        return "#28a745";
      case "error":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "20px",
        marginTop: "20px",
        backgroundColor: "#f8f9fa",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ margin: 0 }}>API Testing Suite</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={runAllTests}
            disabled={isRunning}
            style={{
              padding: "10px 20px",
              backgroundColor: isRunning ? "#ccc" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: isRunning ? "not-allowed" : "pointer",
            }}
          >
            {isRunning ? "Running Tests..." : "Run All Tests"}
          </button>
          <button
            onClick={clearResults}
            style={{
              padding: "10px 20px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Clear Results
          </button>
        </div>
      </div>

      {/* Individual Test Buttons */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={() => runSingleTest("health")}
          style={{
            padding: "8px 12px",
            backgroundColor: "#17a2b8",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Test Health
        </button>
        <button
          onClick={() => runSingleTest("check")}
          style={{
            padding: "8px 12px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Test Check
        </button>
        <button
          onClick={() => runSingleTest("register")}
          style={{
            padding: "8px 12px",
            backgroundColor: "#ffc107",
            color: "black",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Test Register
        </button>
        <button
          onClick={() => runSingleTest("suggest")}
          style={{
            padding: "8px 12px",
            backgroundColor: "#6f42c1",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Test Suggest
        </button>
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <div>
          <h3>Test Results</h3>
          <div
            style={{
              maxHeight: "400px",
              overflowY: "auto",
              border: "1px solid #dee2e6",
              borderRadius: "4px",
              backgroundColor: "white",
            }}
          >
            {testResults.map((result) => (
              <div
                key={result.id}
                style={{
                  padding: "15px",
                  borderBottom: "1px solid #eee",
                  borderLeft: `4px solid ${getStatusColor(result.status)}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <span style={{ fontWeight: "bold" }}>
                    {getStatusIcon(result.status)} {result.name}
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#6c757d",
                    }}
                  >
                    {result.timestamp.toLocaleTimeString()}
                  </span>
                </div>

                {result.status === "success" && result.response && (
                  <div
                    style={{
                      backgroundColor: "#f8f9fa",
                      padding: "10px",
                      borderRadius: "4px",
                      fontSize: "14px",
                    }}
                  >
                    <strong>Response:</strong>
                    <pre
                      style={{
                        margin: "5px 0 0 0",
                        fontSize: "12px",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      {JSON.stringify(result.response, null, 2)}
                    </pre>
                  </div>
                )}

                {result.status === "error" && result.error && (
                  <div
                    style={{
                      backgroundColor: "#f8d7da",
                      color: "#721c24",
                      padding: "10px",
                      borderRadius: "4px",
                      fontSize: "14px",
                    }}
                  >
                    <strong>Error:</strong> {result.error}
                  </div>
                )}

                {result.status === "pending" && (
                  <div
                    style={{
                      color: "#6c757d",
                      fontSize: "14px",
                    }}
                  >
                    Running test...
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default APITester;
