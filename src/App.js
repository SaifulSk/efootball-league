import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import SetupTournament from "./components/SetupTournament";
import Fixtures from "./components/Fixtures";
import "./styles.css";
import PointsTable from "./components/PointsTable";
import MatchResults from "./components/MatchResults";

function App() {
  const [showMenu, setShowMenu] = React.useState(false);
  return (
    <Router>
      <div className="app">
        <nav class="navbar">
          <div class="navbar-header">
            <button class="hamburger" onClick={() => setShowMenu(!showMenu)}>
              &#9776;
            </button>
          </div>
          <ul
            class={"navbar-menu " + (showMenu ? "show" : "")}
            id="navbar-menu"
          >
            <li>
              <a href="/" data-discover="true">
                Home
              </a>
            </li>
            <li>
              <a href="/setup" data-discover="true">
                Setup Tournament
              </a>
            </li>
            {localStorage.getItem("tournamentData") && (
              <>
                <li>
                  <a href="/fixtures" data-discover="true">
                    Fixtures
                  </a>
                </li>
                <li>
                  <a href="/points-table" data-discover="true">
                    Points Table
                  </a>
                </li>
                <li>
                  <a href="/match-results" data-discover="true">
                    Match Results
                  </a>
                </li>
              </>
            )}
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/setup" element={<SetupTournament />} />
          <Route path="/fixtures" element={<Fixtures />} />
          <Route path="/points-table" element={<PointsTable />} />
          <Route path="/match-results" element={<MatchResults />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
