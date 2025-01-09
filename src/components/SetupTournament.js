import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SetupTournament.css";

function SetupTournament() {
  const [type, setType] = useState("league");
  const [groups, setGroups] = useState(0);
  const [teamsPerGroup, setTeamsPerGroup] = useState(0);
  const [groupTeams, setGroupTeams] = useState({});
  const navigate = useNavigate();

  // Load saved data from localStorage
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("tournamentData"));
    if (savedData) {
      setType(savedData.type);
      setGroups(savedData.groups);
      setTeamsPerGroup(savedData.teamsPerGroup);
      setGroupTeams(savedData.groupTeams);
    }
  }, []);

  const handleGroupsChange = (e) => {
    const numGroups = parseInt(e.target.value, 10);
    setGroups(numGroups);
    const updatedGroups = {};
    for (let i = 1; i <= numGroups; i++) {
      updatedGroups[String.fromCharCode(64 + i)] =
        Array(teamsPerGroup).fill("");
    }
    setGroupTeams(updatedGroups);
  };

  const handleTeamsChange = (e, group, index) => {
    const updatedTeams = { ...groupTeams };
    updatedTeams[group][index] = e.target.value;
    setGroupTeams(updatedTeams);
  };

  const handleTeamsPerGroupChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setTeamsPerGroup(value);
    const updatedGroups = { ...groupTeams };
    for (let i = 1; i <= groups; i++) {
      updatedGroups[String.fromCharCode(64 + i)] = Array(value).fill("");
    }
    setGroupTeams(updatedGroups);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const tournamentData = {
      type,
      groups,
      teamsPerGroup,
      groupTeams,
    };
    localStorage.setItem("tournamentData", JSON.stringify(tournamentData));
    navigate("/fixtures");
  };

  const clearAllData = () => {
    localStorage.clear();
    setType("league");
    setGroups(0);
    setTeamsPerGroup(0);
    setGroupTeams({});
  };

  return (
    <div className="setup-container">
      <div className="setup-header">
        <h2>Setup Tournament</h2>
        <button
          style={{
            height: "100%",
          }}
          onClick={() => clearAllData()}
        >
          Reset Data
        </button>
      </div>
      <form onSubmit={handleSubmit} className="setup-form">
        <div className="form-group">
          <label>Tournament Type:</label>
          <select
            className="form-control"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="league">League</option>
            <option value="cup">Cup</option>
          </select>
        </div>

        <div className="form-group">
          <label>Number of Groups:</label>
          <input
            className="form-control"
            type="number"
            value={groups}
            min="1"
            onChange={handleGroupsChange}
          />
        </div>

        <div className="form-group">
          <label>Teams per Group:</label>
          <input
            className="form-control"
            type="number"
            value={teamsPerGroup}
            min="2"
            onChange={handleTeamsPerGroupChange}
          />
        </div>

        {Object.keys(groupTeams).map((group) => (
          <div key={group} className="group-section">
            <h3>Group {group}</h3>
            {groupTeams[group].map((team, index) => (
              <div key={index} className="form-group">
                <label>Team {index + 1}:</label>
                <input
                  className="form-control"
                  type="text"
                  value={team}
                  onChange={(e) => handleTeamsChange(e, group, index)}
                />
              </div>
            ))}
          </div>
        ))}

        <button className="btn-submit" type="submit">
          Generate Fixtures
        </button>
      </form>
    </div>
  );
}

export default SetupTournament;
