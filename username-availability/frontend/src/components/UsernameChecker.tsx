import React, { useState, useEffect } from "react";
import {
  checkUsernameAvailability,
  getUsernameSuggestions,
  registerUsername,
  UsernameCheckResponse,
  SuggestionResponse,
} from "../services/api";
import "../styles/index.css";

const UsernameChecker: React.FC = () => {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [checkResult, setCheckResult] = useState<UsernameCheckResponse | null>(
    null
  );
  const [suggestions, setSuggestions] = useState<SuggestionResponse | null>(
    null
  );
  const [suggestionCount, setSuggestionCount] = useState(5);
  // const [loading, setLoading] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registerMessage, setRegisterMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleCheckUsername = async (usernameToCheck?: string) => {
    const targetUsername = usernameToCheck || username;
    if (!targetUsername.trim()) {
      setError("Please enter a username");
      return;
    }

    // setLoading(true);
    setCheckResult(null);
    setSuggestions(null);
    setError(null);

    try {
      const response = await checkUsernameAvailability(targetUsername);
      setCheckResult(response);

      // If username is not available, get suggestions
      if (!response.available) {
        const suggestionsResponse = await getUsernameSuggestions(
          targetUsername,
          suggestionCount
        );
        setSuggestions(suggestionsResponse);
      }
    } catch (error) {
      console.error("Error checking username availability:", error);
      setError("Failed to check username availability");
    } finally {
      // setLoading(false);
    }
  };

  const handleRegisterUsername = async () => {
    if (!username.trim() || !userId.trim()) {
      setRegisterMessage({
        type: "error",
        text: "Please fill in both username and user ID",
      });
      return;
    }

    setRegistering(true);
    setRegisterMessage(null);

    try {
      const response = await registerUsername(username, userId);
      setRegisterMessage({ type: "success", text: response.message });
      // Refresh availability check after successful registration
      await handleCheckUsername();
    } catch (error: any) {
      setRegisterMessage({
        type: "error",
        text: error.message || "Registration failed",
      });
    } finally {
      setRegistering(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setUsername(suggestion);
    handleCheckUsername(suggestion);
  };

  const handleSuggestionCountChange = async () => {
    if (checkResult && !checkResult.available) {
      try {
        const suggestionsResponse = await getUsernameSuggestions(
          username,
          suggestionCount
        );
        setSuggestions(suggestionsResponse);
      } catch (error) {
        console.error("Error getting suggestions:", error);
      }
    }
  };

  // const generateUserId = () => {
  //   const randomId = `user-${Math.random().toString(36).substr(2, 9)}`;
  //   setUserId(randomId);
  // };

  // Auto-check on username change with debounce
  useEffect(() => {
    if (!username.trim()) {
      setCheckResult(null);
      setSuggestions(null);
      setRegisterMessage(null);
      return;
    }

    const timeoutId = setTimeout(() => {
      handleCheckUsername();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [username]);

  return (
    <div>
      {/* Username Check Section */}
      <div className="username-section username-check-section">
        <h2>Check Username Availability</h2>

        <div className="username-input-group">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            className="username-input"
          />
          {/* <button
            onClick={() => handleCheckUsername()}
            disabled={loading || !username.trim()}
            className="username-check-button"
          >
            {loading ? "Checking..." : "Check"}
          </button> */}
        </div>

        {error && <div className="message-base message--error">❌ {error}</div>}

        {checkResult && (
          <div
            className={`check-result ${
              checkResult.available
                ? "check-result--available"
                : "check-result--unavailable"
            }`}
          >
            {checkResult.available ? (
              <div>
                ✅ <strong>{checkResult.username}</strong> is available!
                {checkResult.cached && (
                  <span className="cached-indicator"> (cached)</span>
                )}
              </div>
            ) : (
              <div>
                ❌ <strong>{checkResult.username}</strong> is not available
                {checkResult.cached && (
                  <span className="cached-indicator"> (cached)</span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Registration Section */}
      <div className="username-section username-register-section">
        <h2>Register Username</h2>

        <div className="form-group">
          <label className="form-label">Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username to register"
            className="username-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">User ID:</label>
          <div className="userid-input-group">
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter user ID"
              className="username-input"
            />
            {/* <button onClick={generateUserId} className="generate-button">
              Generate
            </button> */}
          </div>
        </div>

        <button
          onClick={handleRegisterUsername}
          disabled={
            registering ||
            !username.trim() ||
            !userId.trim() ||
            checkResult?.available === false
          }
          className={`register-button ${
            registering || !username.trim() || !userId.trim()
              ? "register-button--disabled"
              : checkResult?.available === false
              ? "register-button--unavailable"
              : "register-button--enabled"
          }`}
        >
          {registering
            ? "Registering..."
            : checkResult?.available === false
            ? "Username Not Available"
            : "Register Username"}
        </button>

        {registerMessage && (
          <div
            className={`message-base register-message ${
              registerMessage.type === "success"
                ? "message--success"
                : "message--error"
            }`}
          >
            {registerMessage.type === "success" ? "✅" : "❌"}{" "}
            {registerMessage.text}
          </div>
        )}
      </div>

      {/* Suggestions Section */}
      {suggestions && suggestions.suggestions.length > 0 && (
        <div className="username-section username-suggestions-section">
          <div className="suggestions-header">
            <h3 className="suggestions-title">Try these alternatives:</h3>
            <div className="suggestions-controls">
              <label className="suggestions-label">Count:</label>
              <select
                value={suggestionCount}
                onChange={(e) => {
                  setSuggestionCount(Number(e.target.value));
                  setTimeout(handleSuggestionCountChange, 100);
                }}
                className="suggestions-select"
              >
                <option value={3}>3</option>
                <option value={5}>5</option>
                <option value={7}>7</option>
                <option value={10}>10</option>
              </select>
            </div>
          </div>

          <div className="suggestions-grid">
            {suggestions.suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="suggestion-button"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UsernameChecker;
