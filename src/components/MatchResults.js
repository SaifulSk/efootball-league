import React, { useEffect, useState } from "react";

function MatchResults() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const savedResults = JSON.parse(localStorage.getItem("matchResults")) || [];
    setResults(savedResults);
  }, []);

  return (
    <div className="match-results">
      <h2>Match Results</h2>
      {results.length === 0 ? (
        <p>No match results available.</p>
      ) : (
        <div>
          {results.map((result, index) => (
            <div key={index} className="result-card">
              <h3>{result.group}</h3>
              <p>
                <strong>Match:</strong> {result.match}
              </p>
              <p>
                <strong>Score:</strong> {result.homeGoals} - {result.awayGoals}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MatchResults;
