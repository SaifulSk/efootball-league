import React, { useState, useEffect } from "react";

function calculateGroupPointsTable(fixtures, results) {
  const groupPoints = {};

  fixtures.forEach((round) => {
    round.groups.forEach((group) => {
      const groupName = group.group;
      if (!groupPoints[groupName]) {
        groupPoints[groupName] = {};
      }

      group.matches.forEach((match) => {
        const [homeTeam, awayTeam] = match.split(" vs ");
        if (!groupPoints[groupName][homeTeam]) {
          groupPoints[groupName][homeTeam] = {
            team: homeTeam,
            played: 0,
            won: 0,
            drawn: 0,
            lost: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            points: 0,
          };
        }
        if (!groupPoints[groupName][awayTeam]) {
          groupPoints[groupName][awayTeam] = {
            team: awayTeam,
            played: 0,
            won: 0,
            drawn: 0,
            lost: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            points: 0,
          };
        }
      });
    });
  });

  results.forEach((result) => {
    const { match, homeGoals, awayGoals, group } = result;
    const [homeTeam, awayTeam] = match.split(" vs ");

    if (groupPoints[group][homeTeam] && groupPoints[group][awayTeam]) {
      groupPoints[group][homeTeam].played += 1;
      groupPoints[group][awayTeam].played += 1;

      groupPoints[group][homeTeam].goalsFor += homeGoals;
      groupPoints[group][homeTeam].goalsAgainst += awayGoals;

      groupPoints[group][awayTeam].goalsFor += awayGoals;
      groupPoints[group][awayTeam].goalsAgainst += homeGoals;

      if (homeGoals > awayGoals) {
        groupPoints[group][homeTeam].won += 1;
        groupPoints[group][awayTeam].lost += 1;
        groupPoints[group][homeTeam].points += 3;
      } else if (homeGoals < awayGoals) {
        groupPoints[group][awayTeam].won += 1;
        groupPoints[group][homeTeam].lost += 1;
        groupPoints[group][awayTeam].points += 3;
      } else {
        groupPoints[group][homeTeam].drawn += 1;
        groupPoints[group][awayTeam].drawn += 1;
        groupPoints[group][homeTeam].points += 1;
        groupPoints[group][awayTeam].points += 1;
      }
    }
  });

  const sortedGroupPoints = {};
  Object.keys(groupPoints).forEach((groupName) => {
    sortedGroupPoints[groupName] = Object.values(groupPoints[groupName]).sort(
      (a, b) => b.points - a.points || b.goalsFor - b.goalsAgainst
    );
  });

  return sortedGroupPoints;
}

function PointsTable() {
  const [fixtures, setFixtures] = useState([]);
  const [results, setResults] = useState([]);
  const [groupPoints, setGroupPoints] = useState({});
  const [submittedResults, setSubmittedResults] = useState({});

  // Load data from localStorage
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("tournamentData"));
    if (data) {
      const generatedFixtures = JSON.parse(localStorage.getItem("fixtures"));
      setFixtures(generatedFixtures);
    }
    // localStorage.removeItem("matchResults");
    // localStorage.removeItem("submittedResults");
    const savedResults = JSON.parse(localStorage.getItem("matchResults")) || [];
    const savedSubmittedResults =
      JSON.parse(localStorage.getItem("submittedResults")) || {};

    setResults(savedResults);
    setSubmittedResults(savedSubmittedResults);
  }, []);

  // Recalculate and save updated points table
  useEffect(() => {
    const table = calculateGroupPointsTable(fixtures, results);
    setGroupPoints(table);
    if (fixtures?.length > 0 && results?.length > 0) {
      localStorage.setItem("matchResults", JSON.stringify(results));
    }
  }, [fixtures, results]);

  // Handle input changes for match results
  const handleResultChange = (e, match, group) => {
    const { name, value } = e.target;
    const existingResult = results.find(
      (result) => result.match === match && result.group === group
    );
    if (existingResult) {
      setResults((prev) =>
        prev.map((result) =>
          result.match === match && result.group === group
            ? { ...result, [name]: value == 0 ? 0 : parseInt(value, 10) || "" }
            : result
        )
      );
    } else {
      setResults((prev) => [
        ...prev,
        { match, group, [name]: value == 0 ? 0 : parseInt(value, 10) || "" },
      ]);
    }
  };

  // Handle result submission
  const handleSubmitResult = (match, group) => {
    const updatedSubmittedResults = {
      ...submittedResults,
      [`${group}-${match}`]: true,
    };
    setSubmittedResults(updatedSubmittedResults);
    localStorage.setItem(
      "submittedResults",
      JSON.stringify(updatedSubmittedResults)
    );
  };

  const clearRoundData = (round) => {
    const updatedResults = results.filter(
      (result) =>
        !round.groups.some((group) =>
          group.matches.some((match) => match === result.match)
        )
    );
    setResults(updatedResults);
    localStorage.setItem("matchResults", JSON.stringify(updatedResults));
    const updatedSubmittedResults = Object.keys(submittedResults).reduce(
      (acc, key) =>
        !round.groups.some((group) =>
          group.matches.some((match) => `${group.group}-${match}` === key)
        )
          ? { ...acc, [key]: submittedResults[key] }
          : acc,
      {}
    );
    setSubmittedResults(updatedSubmittedResults);
    localStorage.setItem(
      "submittedResults",
      JSON.stringify(updatedSubmittedResults)
    );
    window.location.reload();
  };

  useEffect(() => {
    // localStorage.removeItem("submittedResults");
    // localStorage.removeItem("Results")
  }, []);

  return (
    <div className="points-table">
      <h2>Enter Match Results</h2>
      {fixtures.map((round, roundIndex) => (
        <div key={roundIndex} className="round">
          <h3>
            {round.round}
            <button
              style={{
                height: "100%",
              }}
              onClick={() => clearRoundData(round)}
            >
              Reset Data
            </button>
          </h3>
          {round.groups.map((group, groupIndex) => (
            <div
              key={groupIndex}
              className="group"
              style={{
                gridColumn: round.groups?.length == 1 ? "span 2" : "",
              }}
            >
              {round.groups?.length > 1 && <h4>{`Group ${group.group}`}</h4>}
              {group.matches.map((match, matchIndex) => {
                const existingResult = results.find(
                  (result) =>
                    result.match === match && result.group === group.group
                );
                const homeGoals = existingResult
                  ? existingResult.homeGoals
                  : "";
                const awayGoals = existingResult
                  ? existingResult.awayGoals
                  : "";
                return (
                  <div key={matchIndex} className="match">
                    <div className="match-details">
                      <input
                        type="tel"
                        name="homeGoals"
                        // placeholder="Home Goals"
                        className="score-input"
                        value={homeGoals}
                        onChange={(e) =>
                          handleResultChange(e, match, group.group)
                        }
                        // disabled={submittedResults[`${group.group}-${match}`]}
                      />
                      <p>{match}</p>
                      <input
                        type="tel"
                        name="awayGoals"
                        // placeholder="Away Goals"
                        className="score-input"
                        value={awayGoals}
                        onChange={(e) =>
                          handleResultChange(e, match, group.group)
                        }
                        // disabled={submittedResults[`${group.group}-${match}`]}
                      />
                    </div>
                    {/* <button
                      className="goal-submit-btn"
                      onClick={() => handleSubmitResult(match, group.group)}
                      // disabled={submittedResults[`${group.group}-${match}`]}
                    >
                      Submit
                    </button> */}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ))}

      <h2>Points Table</h2>
      {Object.keys(groupPoints).map((groupName) => (
        <div key={groupName} className="group-points">
          {groupPoints?.length > 1 && <h3>{`Group ${groupName}`}</h3>}
          <table>
            <thead>
              <tr>
                <th>Team</th>
                <th>Pl</th>
                <th>W</th>
                <th>D</th>
                <th>L</th>
                <th>GF</th>
                <th>GA</th>
                <th>GD</th>
                <th>Pts</th>
              </tr>
            </thead>
            <tbody>
              {groupPoints[groupName].map((team, index) => (
                <tr key={index}>
                  <td>{team.team}</td>
                  <td>{team.played}</td>
                  <td>{team.won}</td>
                  <td>{team.drawn}</td>
                  <td>{team.lost}</td>
                  <td>{team.goalsFor}</td>
                  <td>{team.goalsAgainst}</td>
                  <td>{team.goalsFor - team.goalsAgainst}</td>
                  <td>{team.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default PointsTable;
