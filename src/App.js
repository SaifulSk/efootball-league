import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import SetupTournament from "./components/SetupTournament";
import Fixtures from "./components/Fixtures";
import "./styles.css";
import PointsTable from "./components/PointsTable";
import MatchResults from "./components/MatchResults";

function App() {
  return (
    <Router>
      <div className="app">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/setup">Setup Tournament</Link>
            </li>
            <li>
              <Link to="/fixtures">Fixtures</Link>
            </li>
            <li>
              <Link to="/points-table">Points Table</Link>
            </li>
            <li>
              <Link to="/match-results">Match Results</Link>
            </li>
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
