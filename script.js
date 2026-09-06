// ======================================================
// BIG BROTHER SIMULATOR
// ======================================================

let houseguests = [];
let evictedHouseguests = [];
let jury = [];
let alliances = [];
let relationships = [];
let customTwists = [];

let currentWeek = 1;
let currentHOH = null;
let nominees = [];
let povWinner = null;
let seasonStarted = false;


// ======================================================
// SECTION NAVIGATION
// ======================================================

function showSection(sectionName) {

    const sections = document.querySelectorAll(".page-section");

    sections.forEach(function(section) {
        section.classList.remove("active");
    });

    const selected = document.getElementById(sectionName);

    if (selected) {
        selected.classList.add("active");
    }

    updateAllDisplays();
}


// ======================================================
// HOUSEGUESTS
// ======================================================

function addHouseguest() {

    const name = document.getElementById("nameInput").value.trim();
    const image = document.getElementById("imageInput").value.trim();

    const physical = Number(document.getElementById("physicalInput").value) || 5;
    const mental = Number(document.getElementById("mentalInput").value) || 5;
    const social = Number(document.getElementById("socialInput").value) || 5;
    const strategy = Number(document.getElementById("strategyInput").value) || 5;

    if (!name) {
        alert("Please enter a houseguest name.");
        return;
    }

    const houseguest = {
        id: Date.now(),
        name: name,
        image: image || "https://placehold.co/400x500?text=Houseguest",
        physical: physical,
        mental: mental,
        social: social,
        strategy: strategy,
        status: "In House"
    };

    houseguests.push(houseguest);

    document.getElementById("nameInput").value = "";
    document.getElementById("imageInput").value = "";

    updateAllDisplays();

    alert(name + " has been added to the cast!");
}


function removeHouseguest(id) {

    const player = houseguests.find(function(p) {
        return p.id === id;
    });

    if (!player) return;

    houseguests = houseguests.filter(function(p) {
        return p.id !== id;
    });

    updateAllDisplays();
}


function updateCastDisplay() {

    const grid = document.getElementById("castGrid");

    if (!grid) return;

    if (houseguests.length === 0) {
        grid.innerHTML = '<div class="empty">No houseguests added yet.</div>';
        return;
    }

    grid.innerHTML = "";

    houseguests.forEach(function(player) {

        const card = document.createElement("div");
        card.className = "houseguest-card";

        card.innerHTML = `
            <img src="${escapeHTML(player.image)}" alt="${escapeHTML(player.name)}"
                 onerror="this.src='https://placehold.co/400x500?text=Houseguest'">

            <div class="houseguest-info">

                <h3>${escapeHTML(player.name)}</h3>

                <div class="stat">
                    <span>Physical</span>
                    <strong>${player.physical}</strong>
                </div>

                <div class="stat">
                    <span>Mental</span>
                    <strong>${player.mental}</strong>
                </div>

                <div class="stat">
                    <span>Social</span>
                    <strong>${player.social}</strong>
                </div>

                <div class="stat">
                    <span>Strategy</span>
                    <strong>${player.strategy}</strong>
                </div>

                <div class="stat">
                    <span>Status</span>
                    <strong>${escapeHTML(player.status)}</strong>
                </div>

                <br>

                <button class="danger" onclick="removeHouseguest(${player.id})">
                    Remove
                </button>

            </div>
        `;

        grid.appendChild(card);
    });
}


// ======================================================
// TWISTS
// ======================================================

function createTwist() {

    const name = document.getElementById("twistNameInput").value.trim();
    const description = document.getElementById("twistDescriptionInput").value.trim();

    if (!name) {
        alert("Please enter a twist name.");
        return;
    }

    customTwists.push({
        id: Date.now(),
        name: name,
        description: description || "No description provided.",
        enabled: true
    });

    document.getElementById("twistNameInput").value = "";
    document.getElementById("twistDescriptionInput").value = "";

    updateTwistDisplay();
}


function toggleTwist(id) {

    const twist = customTwists.find(function(t) {
        return t.id === id;
    });

    if (!twist) return;

    twist.enabled = !twist.enabled;

    updateTwistDisplay();
}


function deleteTwist(id) {

    customTwists = customTwists.filter(function(t) {
        return t.id !== id;
    });

    updateTwistDisplay();
}


function updateTwistDisplay() {

    const list = document.getElementById("twistList");

    if (!list) return;

    if (customTwists.length === 0) {
        list.innerHTML = '<div class="empty">No custom twists created.</div>';
        return;
    }

    list.innerHTML = "";

    customTwists.forEach(function(twist) {

        const card = document.createElement("div");

        card.className = "twist-card" + (twist.enabled ? " enabled" : "");

        card.innerHTML = `
            <h3>${escapeHTML(twist.name)}</h3>

            <p>${escapeHTML(twist.description)}</p>

            <p>
                Status:
                <strong>${twist.enabled ? "ACTIVE" : "OFF"}</strong>
            </p>

            <button onclick="toggleTwist(${twist.id})">
                ${twist.enabled ? "Disable" : "Enable"}
            </button>

            <button class="danger" onclick="deleteTwist(${twist.id})">
                Delete
            </button>
        `;

        list.appendChild(card);
    });
}


// ======================================================
// ALLIANCES
// ======================================================

function createAlliance() {

    const name = document.getElementById("allianceNameInput").value.trim();
    const membersText = document.getElementById("allianceMembersInput").value.trim();

    if (!name) {
        alert("Please enter an alliance name.");
        return;
    }

    const members = membersText
        ? membersText.split(",").map(function(member) {
            return member.trim();
        }).filter(Boolean)
        : [];

    alliances.push({
        id: Date.now(),
        name: name,
        members: members
    });

    document.getElementById("allianceNameInput").value = "";
    document.getElementById("allianceMembersInput").value = "";

    updateAllianceDisplay();
}


function updateAllianceDisplay() {

    const list = document.getElementById("allianceList");

    if (!list) return;

    if (alliances.length === 0) {
        list.innerHTML = '<div class="empty">No alliances created.</div>';
        return;
    }

    list.innerHTML = "";

    alliances.forEach(function(alliance) {

        const card = document.createElement("div");

        card.className = "alliance-card";

        card.innerHTML = `
            <h3>${escapeHTML(alliance.name)}</h3>
            <p>
                <strong>Members:</strong>
                ${alliance.members.length
                    ? alliance.members.map(escapeHTML).join(", ")
                    : "No members listed"}
            </p>
        `;

        list.appendChild(card);
    });
}


// ======================================================
// RELATIONSHIPS
// ======================================================

function updateRelationshipPlayers() {

    const player1 = document.getElementById("relationshipPlayer1");
    const player2 = document.getElementById("relationshipPlayer2");

    if (!player1 || !player2) return;

    player1.innerHTML = "";
    player2.innerHTML = "";

    houseguests.forEach(function(player) {

        const option1 = document.createElement("option");
        option1.value = player.id;
        option1.textContent = player.name;

        const option2 = document.createElement("option");
        option2.value = player.id;
        option2.textContent = player.name;

        player1.appendChild(option1);
        player2.appendChild(option2);
    });
}


function createRelationship() {

    const player1Id = Number(document.getElementById("relationshipPlayer1").value);
    const player2Id = Number(document.getElementById("relationshipPlayer2").value);

    const score = Number(document.getElementById("relationshipScore").value) || 0;

    if (!player1Id || !player2Id) {
        alert("You need at least two houseguests.");
        return;
    }

    if (player1Id === player2Id) {
        alert("A player cannot have a relationship with themselves.");
        return;
    }

    const player1 = houseguests.find(function(p) {
        return p.id === player1Id;
    });

    const player2 = houseguests.find(function(p) {
        return p.id === player2Id;
    });

    if (!player1 || !player2) return;

    relationships.push({
        id: Date.now(),
        player1: player1.name,
        player2: player2.name,
        score: score
    });

    updateRelationshipDisplay();
}


function updateRelationshipDisplay() {

    const list = document.getElementById("relationshipList");

    if (!list) return;

    if (relationships.length === 0) {
        list.innerHTML = '<div class="empty">No relationships created.</div>';
        return;
    }

    list.innerHTML = "";

    relationships.forEach(function(rel) {

        const card = document.createElement("div");

        card.className = "relationship-card";

        card.innerHTML = `
            <strong>${escapeHTML(rel.player1)}</strong>
            ↔
            <strong>${escapeHTML(rel.player2)}</strong>

            <br><br>

            Relationship:
            <strong>${rel.score}</strong>
        `;

        list.appendChild(card);
    });
}


// ======================================================
// START SEASON
// ======================================================

function startNewSeason() {

    if (houseguests.length < 2) {
        alert("Add at least 2 houseguests before starting the season.");
        return;
    }

    evictedHouseguests = [];
    jury = [];

    currentWeek = 1;
    currentHOH = null;
    nominees = [];
    povWinner = null;

    seasonStarted = true;

    addEvent("The Big Brother season has officially started!");

    updateAllDisplays();

    showSection("week");
}


// ======================================================
// RANDOM PLAYER
// ======================================================

function getRandomPlayer(excluded) {

    excluded = excluded || [];

    const available = houseguests.filter(function(player) {

        return player.status === "In House" &&
               !excluded.includes(player.id);

    });

    if (available.length === 0) {
        return null;
    }

    return available[Math.floor(Math.random() * available.length)];
}


// ======================================================
// COMPETITION WINNER
// ======================================================

function competitionWinner(type) {

    const available = houseguests.filter(function(player) {
        return player.status === "In House";
    });

    if (available.length === 0) {
        return null;
    }

    let winner = null;

    let highestScore = -Infinity;

    available.forEach(function(player) {

        let score = Math.random() * 10;

        if (type === "physical") {
            score += player.physical * 2;
        }

        if (type === "mental") {
            score += player.mental * 2;
        }

        if (type === "social") {
            score += player.social * 2;
        }

        if (type === "strategy") {
            score += player.strategy * 2;
        }

        if (score > highestScore) {
            highestScore = score;
            winner = player;
        }

    });

    return winner;
}


// ======================================================
// HOH
// ======================================================

function runHOH() {

    if (!seasonStarted) {
        alert("Start a new season first.");
        return;
    }

    const winner = competitionWinner("physical");

    if (!winner) {
        alert("There are no eligible houseguests.");
        return;
    }

    currentHOH = winner;

    addEvent(winner.name + " won the Head of Household competition!");

    updateGameDisplay();
}


// ======================================================
// NOMINATIONS
// ======================================================

function makeNominations() {

    if (!seasonStarted) {
        alert("Start a new season first.");
        return;
    }

    if (!currentHOH) {
        alert("Play the HOH competition first.");
        return;
    }

    const candidates = houseguests.filter(function(player) {

        return player.status === "In House" &&
               player.id !== currentHOH.id;

    });

    if (candidates.length < 2) {
        alert("There are not enough players to make nominations.");
        return;
    }

    const shuffled = candidates.sort(function() {
        return Math.random() - 0.5;
    });

    nominees = [shuffled[0], shuffled[1]];

    addEvent(
        currentHOH.name +
        " nominated " +
        nominees[0].name +
        " and " +
        nominees[1].name +
        " for eviction."
    );

    updateGameDisplay();
}


// ======================================================
// POV
// ======================================================

function runPOV() {

    if (!seasonStarted) {
        alert("Start a new season first.");
        return;
    }

    if (nominees.length !== 2) {
        alert("Make nominations first.");
        return;
    }

    const winner = competitionWinner("mental");

    if (!winner) return;

    povWinner = winner;

    addEvent(winner.name + " won the Power of Veto!");

    updateGameDisplay();
}


// ======================================================
// USE POV
// ======================================================

function usePOV() {

    if (!povWinner) {
        alert("Play the Power of Veto first.");
        return;
    }

    if (nominees.length !== 2) {
        alert("There are no nominations.");
        return;
    }

    const povOnNominee = nominees.some(function(player) {
        return player.id === povWinner.id;
    });

    if (!povOnNominee) {
        addEvent(
            povWinner.name +
            " chose not to use the Power of Veto."
        );

        alert("The POV winner did not use the Power of Veto.");

        return;
    }

    const replacementCandidates = houseguests.filter(function(player) {

        return player.status === "In House" &&
               player.id !== currentHOH.id &&
               player.id !== nominees[0].id &&
               player.id !== nominees[1].id &&
               player.id !== povWinner.id;

    });

    if (replacementCandidates.length === 0) {
        alert("There is no replacement nominee available.");
        return;
    }

    const replacement =
        replacementCandidates[
            Math.floor(Math.random() * replacementCandidates.length)
        ];

    const removedNominee = povWinner;

    nominees = nominees.filter(function(player) {
        return player.id !== removedNominee.id;
    });

    nominees.push(replacement);

    addEvent(
        povWinner.name +
        " used the Power of Veto and removed themselves from the block."
    );

    addEvent(
        currentHOH.name +
        " nominated " +
        replacement.name +
        " as the replacement nominee."
    );

    updateGameDisplay();
}


// ======================================================
// EVICTION
// ======================================================

function runEviction() {

    if (!seasonStarted) {
        alert("Start a new season first.");
        return;
    }

    if (nominees.length !== 2) {
        alert("You need two nominees before eviction.");
        return;
    }

    const randomIndex = Math.floor(Math.random() * nominees.length);

    const evicted = nominees[randomIndex];

    evicted.status = "Evicted";

    evictedHouseguests.push(evicted);

    jury.push(evicted);

    addEvent(evicted.name + " was evicted from the Big Brother house!");

    nominees = [];
    povWinner = null;
    currentHOH = null;

    currentWeek++;

    checkForWinner();

    updateAllDisplays();
}


// ======================================================
// WINNER CHECK
// ======================================================

function checkForWinner() {

    const remaining = houseguests.filter(function(player) {
        return player.status === "In House";
    });

    if (remaining.length <= 2) {

        seasonStarted = false;

        const finale = document.getElementById("finaleContent");

        if (finale) {

            finale.innerHTML = `
                <h2>Finale!</h2>

                <p>The final two houseguests are:</p>

                <h3>
                    ${remaining.map(function(player) {
                        return escapeHTML(player.name);
                    }).join(" vs. ")}
                </h3>

                <p>
                    Your season has reached the finale.
                </p>
            `;
        }

        addEvent("The season has reached the Final Two!");
    }
}


// ======================================================
// EVENT LOG
// ======================================================

function addEvent(message) {

    const eventLog = document.getElementById("eventLog");

    if (!eventLog) return;

    const event = document.createElement("div");

    event.className = "event";

    event.textContent =
        "Week " + currentWeek + ": " + message;

    eventLog.prepend(event);
}


// ======================================================
// MEMORY WALL
// ======================================================

function updateMemoryWall() {

    const wall = document.getElementById("memoryWall");

    if (!wall) return;

    wall.innerHTML = "";

    houseguests.forEach(function(player) {

        const card = document.createElement("div");

        card.className = "memory-card";

        card.innerHTML = `
            <img src="${escapeHTML(player.image)}"
                 alt="${escapeHTML(player.name)}"
                 onerror="this.src='https://placehold.co/400x500?text=Houseguest'">

            <div>
                ${escapeHTML(player.name)}
                <br>
                <small>${escapeHTML(player.status)}</small>
            </div>
        `;

        wall.appendChild(card);
    });
}


// ======================================================
// JURY
// ======================================================

function updateJuryDisplay() {

    const list = document.getElementById("juryList");

    if (!list) return;

    if (jury.length === 0) {
        list.innerHTML = '<div class="empty">No jury members yet.</div>';
        return;
    }

    list.innerHTML = "";

    jury.forEach(function(player) {

        const row = document.createElement("div");

        row.className = "player-row";

        row.textContent = player.name;

        list.appendChild(row);
    });
}


// ======================================================
// EVICTED PLAYERS
// ======================================================

function updateEvictedDisplay() {

    const list = document.getElementById("evictedPlayers");

    if (!list) return;

    if (evictedHouseguests.length === 0) {
        list.innerHTML = '<div class="empty">No evicted players yet.</div>';
        return;
    }

    list.innerHTML = "";

    evictedHouseguests.forEach(function(player) {

        const row = document.createElement("div");

        row.className = "player-row";

        row.textContent =
            player.name + " — Evicted";

        list.appendChild(row);
    });
}


// ======================================================
// GAME DISPLAY
// ======================================================

function updateGameDisplay() {

    const weekTitle = document.getElementById("weekTitle");
    const hohDisplay = document.getElementById("hohDisplay");
    const nomineesDisplay = document.getElementById("nomineesDisplay");
    const povDisplay = document.getElementById("povDisplay");
    const weekDisplay = document.getElementById("weekDisplay");

    if (weekTitle) {
        weekTitle.textContent = "Week " + currentWeek;
    }

    if (hohDisplay) {

        hohDisplay.textContent =
            currentHOH
                ? currentHOH.name
                : "Not played";
    }

    if (nomineesDisplay) {

        nomineesDisplay.textContent =
            nominees.length
                ? nominees.map(function(player) {
                    return player.name;
                }).join(" & ")
                : "Not nominated";
    }

    if (povDisplay) {

        povDisplay.textContent =
            povWinner
                ? povWinner.name
                : "Not played";
    }

    if (weekDisplay) {

        if (!seasonStarted) {

            weekDisplay.textContent =
                "Start a season to begin playing.";

        } else {

            weekDisplay.textContent =
                "The house is currently playing Week " +
                currentWeek +
                ".";
        }
    }
}


// ======================================================
// SEASON SUMMARY
// ======================================================

function updateSeasonSummary() {

    const summary = document.getElementById("seasonSummary");

    if (!summary) return;

    const remaining = houseguests.filter(function(player) {
        return player.status === "In House";
    });

    summary.innerHTML = `
        <p><strong>Season Started:</strong> ${seasonStarted ? "Yes" : "No"}</p>
        <p><strong>Current Week:</strong> ${currentWeek}</p>
        <p><strong>Houseguests:</strong> ${houseguests.length}</p>
        <p><strong>Still in House:</strong> ${remaining.length}</p>
        <p><strong>Evicted:</strong> ${evictedHouseguests.length}</p>
        <p><strong>Jury:</strong> ${jury.length}</p>
        <p><strong>Active Twists:</strong> ${customTwists.filter(function(t) {
            return t.enabled;
        }).length}</p>
    `;
}


// ======================================================
// SAVE GAME
// ======================================================

function saveGame() {

    const gameState = {
        houseguests: houseguests,
        evictedHouseguests: evictedHouseguests,
        jury: jury,
        alliances: alliances,
        relationships: relationships,
        customTwists: customTwists,
        currentWeek: currentWeek,
        currentHOH: currentHOH,
        nominees: nominees,
        povWinner: povWinner,
        seasonStarted: seasonStarted
    };

    localStorage.setItem(
        "bigBrotherSimulatorSave",
        JSON.stringify(gameState)
    );

    alert("Game saved!");
}


// ======================================================
// LOAD GAME
// ======================================================

function loadGame() {

    const saved = localStorage.getItem("bigBrotherSimulatorSave");

    if (!saved) {
        alert("No saved game was found.");
        return;
    }

    try {

        const gameState = JSON.parse(saved);

        houseguests = gameState.houseguests || [];
        evictedHouseguests = gameState.evictedHouseguests || [];
        jury = gameState.jury || [];
        alliances = gameState.alliances || [];
        relationships = gameState.relationships || [];
        customTwists = gameState.customTwists || [];

        currentWeek = gameState.currentWeek || 1;
        currentHOH = gameState.currentHOH || null;
        nominees = gameState.nominees || [];
        povWinner = gameState.povWinner || null;
        seasonStarted = gameState.seasonStarted || false;

        updateAllDisplays();

        alert("Game loaded!");

    } catch (error) {

        console.error(error);

        alert("The saved game could not be loaded.");
    }
}


// ======================================================
// RESET
// ======================================================

function resetGame() {

    const confirmed = confirm(
        "Are you sure you want to completely reset the simulator?"
    );

    if (!confirmed) return;

    houseguests = [];
    evictedHouseguests = [];
    jury = [];
    alliances = [];
    relationships = [];
    customTwists = [];

    currentWeek = 1;
    currentHOH = null;
    nominees = [];
    povWinner = null;
    seasonStarted = false;

    localStorage.removeItem("bigBrotherSimulatorSave");

    const eventLog = document.getElementById("eventLog");

    if (eventLog) {
        eventLog.innerHTML = "";
    }

    updateAllDisplays();

    showSection("home");

    alert("Simulator reset.");
}


// ======================================================
// UPDATE EVERYTHING
// ======================================================

function updateAllDisplays() {

    updateCastDisplay();
    updateTwistDisplay();
    updateAllianceDisplay();
    updateRelationshipPlayers();
    updateRelationshipDisplay();
    updateMemoryWall();
    updateJuryDisplay();
    updateEvictedDisplay();
    updateGameDisplay();
    updateSeasonSummary();
}


// ======================================================
// BASIC HTML ESCAPE
// ======================================================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ======================================================
// STARTUP
// ======================================================

document.addEventListener("DOMContentLoaded", function() {

    console.log("Big Brother Simulator JavaScript loaded successfully.");

    updateAllDisplays();

});
