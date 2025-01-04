import React, { useEffect, useState } from "react";

function generateFixtures(type, groupTeams) {
  const fixtures = [];
  const roundMatches = {}; // To hold all round matches, grouped by round number

  for (const [group, teams] of Object.entries(groupTeams)) {
    const validTeams = teams.filter((team) => team); // Exclude empty team names
    const numTeams = validTeams.length;

    if (numTeams > 1) {
      if (numTeams % 2 !== 0) {
        validTeams.push("BYE");
      }
      const numRounds = validTeams.length - 1;
      const numMatchesPerRound = validTeams.length / 2;

      for (let round = 0; round < numRounds; round++) {
        if (!roundMatches[`Round - ${round + 1}`]) {
          roundMatches[`Round - ${round + 1}`] = {};
        }

        // Initialize the group if it doesn't exist in the round
        if (!roundMatches[`Round - ${round + 1}`][group]) {
          roundMatches[`Round - ${round + 1}`][group] = [];
        }

        for (let match = 0; match < numMatchesPerRound; match++) {
          const home = validTeams[match];
          const away = validTeams[numTeams - match - 1];
          if (home !== "BYE" && away !== "BYE") {
            roundMatches[`Round - ${round + 1}`][group].push(
              `${home} vs ${away}`
            );
          }
        }

        // Rotate the teams for the next round
        validTeams.splice(1, 0, validTeams.pop());
      }
    }
  }

  // Convert roundMatches object into an array of round fixtures
  Object.keys(roundMatches).forEach((round) => {
    const roundFixture = { round, groups: [] };

    Object.keys(roundMatches[round]).forEach((group) => {
      roundFixture.groups.push({
        group,
        matches: roundMatches[round][group],
      });
    });

    fixtures.push(roundFixture);
  });

  return fixtures;
}

function Fixtures() {
  const [fixtures, setFixtures] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("tournamentData"));
    if (data) {
      const { type, groupTeams } = data;
      const generatedFixtures = generateFixtures(type, groupTeams);
      setFixtures(generatedFixtures);
      localStorage.setItem("fixtures", JSON.stringify(generatedFixtures));
    }
  }, []);

  return (
    <div className="fixtures">
      <h2>Fixtures</h2>
      {fixtures.map((round, roundIndex) => (
        <div key={roundIndex} className="round">
          <h3>{round.round}</h3> {/* Round name as the main heading */}
          {round.groups.map((group, groupIndex) => (
            <>
              <div key={groupIndex} className="group">
                <h4>{`Group ${group.group}`}</h4>{" "}
                {/* Group name as subheading */}
                <ul>
                  {group.matches.map((match, matchIndex) => (
                    <li key={matchIndex}>{match}</li> // Displaying all matches for that group in this round
                  ))}
                </ul>
              </div>
            </>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Fixtures;
