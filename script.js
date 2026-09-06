script.js
```javascript
/* =========================================
   BIG BROTHER CUSTOM SIMULATOR
========================================= */


/* =========================================
   GAME DATA
========================================= */

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


/* =========================================
   NAVIGATION
========================================= */

function showSection(sectionName) {

    const sections =
        document.querySelectorAll(
            ".page-section"
        );

    sections.forEach(
        section => {

            section.classList.remove(
                "active"
            );

        }
    );


    const selected =
        document.getElementById(
            sectionName
        );


    if (selected) {

        selected.classList.add(
            "active"
        );

    }

}


/* =========================================
   ADD HOUSEGUEST
========================================= */

function addHouseguest() {

    const name =
        document.getElementById(
            "nameInput"
        ).value.trim();


    const image =
        document.getElementById(
            "imageInput"
        ).value.trim();


    const physical =
        Number(
            document.getElementById(
                "physicalInput"
            ).value
        ) || 5;


    const mental =
        Number(
            document.getElementById(
                "mentalInput"
            ).value
        ) || 5;


    const social =
        Number(
            document.getElementById(
                "socialInput"
            ).value
        ) || 5;


    const strategy =
        Number(
            document.getElementById(
                "strategyInput"
            ).value
        ) || 5;


    if (!name) {

        alert(
            "Enter a houseguest name."
        );

        return;

    }


    const player = {

        id:
            Date.now(),

        name:
            name,

        image:
            image ||
            "https://placehold.co/400x500?text=" +
            encodeURIComponent(name),

        physical:
            Math.min(
                10,
                Math.max(
                    1,
                    physical
                )
            ),

        mental:
            Math.min(
                10,
                Math.max(
                    1,
                    mental
                )
            ),

        social:
            Math.min(
                10,
                Math.max(
                    1,
                    social
                )
            ),

        strategy:
            Math.min(
                10,
                Math.max(
                    1,
                    strategy
                )
            ),

        active:
            true

    };


    houseguests.push(
        player
    );


    document.getElementById(
        "nameInput"
    ).value = "";


    document.getElementById(
        "imageInput"
    ).value = "";


    document.getElementById(
        "physicalInput"
    ).value = "";


    document.getElementById(
        "mentalInput"
    ).value = "";


    document.getElementById(
        "socialInput"
    ).value = "";


    document.getElementById(
        "strategyInput"
    ).value = "";


    updateAllDisplays();


    addEvent(
        "👤 " +
        name +
        " has joined the Big Brother house."
    );

}



/* =========================================
   CAST DISPLAY
========================================= */

function updateCastDisplay() {

    const grid =
        document.getElementById(
            "castGrid"
        );


    grid.innerHTML = "";


    houseguests.forEach(
        player => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "houseguest-card";


            card.innerHTML = `

                <img
                    src="${player.image}"
                    alt="${player.name}"
                >

                <h3>
                    ${player.name}
                </h3>

                <div class="stats">

                    <p>
                        💪 Physical:
                        ${player.physical}
                    </p>

                    <p>
                        🧠 Mental:
                        ${player.mental}
                    </p>

                    <p>
                        ❤️ Social:
                        ${player.social}
                    </p>

                    <p>
                        ♟ Strategy:
                        ${player.strategy}
                    </p>

                </div>

                <button
                    onclick="removeHouseguest(${player.id})"
                >
                    REMOVE
                </button>

            `;


            grid.appendChild(
                card
            );

        }
    );

}



/* =========================================
   REMOVE HOUSEGUEST
========================================= */

function removeHouseguest(id) {

    const player =
        houseguests.find(
            p =>
            p.id === id
        );


    if (!player) return;


    if (
        !confirm(
            "Remove " +
            player.name +
            " from the cast?"
        )
    ) {

        return;

    }


    houseguests =
        houseguests.filter(
            p =>
            p.id !== id
        );


    updateAllDisplays();

}



/* =========================================
   CREATE TWIST
========================================= */

function createTwist() {

    const name =
        document.getElementById(
            "twistNameInput"
        ).value.trim();


    const description =
        document.getElementById(
            "twistDescriptionInput"
        ).value.trim();


    if (!name) {

        alert(
            "Enter a twist name."
        );

        return;

    }


    const twist = {

        id:
            Date.now(),

        name:
            name,

        description:
            description ||
            "Custom Big Brother twist.",

        active:
            false

    };


    customTwists.push(
        twist
    );


    document.getElementById(
        "twistNameInput"
    ).value = "";


    document.getElementById(
        "twistDescriptionInput"
    ).value = "";


    updateTwistDisplay();


    addEvent(
        "🌀 Created custom twist: " +
        name
    );

}



/* =========================================
   DISPLAY TWISTS
========================================= */

function updateTwistDisplay() {

    const list =
        document.getElementById(
            "twistList"
        );


    list.innerHTML = "";


    customTwists.forEach(
        twist => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "twist-card" +
                (
                    twist.active
                    ? " active"
                    : ""
                );


            card.innerHTML = `

                <h3>
                    ${twist.name}
                </h3>

                <p>
                    ${twist.description}
                </p>

                <button
                    onclick="toggleTwist(${twist.id})"
                >
                    ${
                        twist.active
                        ? "DEACTIVATE"
                        : "ACTIVATE"
                    }
                </button>

                <button
                    onclick="deleteTwist(${twist.id})"
                >
                    DELETE
                </button>

            `;


            list.appendChild(
                card
            );

        }
    );

}



/* =========================================
   TOGGLE TWIST
========================================= */

function toggleTwist(id) {

    const twist =
        customTwists.find(
            t =>
            t.id === id
        );


    if (!twist) return;


    twist.active =
        !twist.active;


    addEvent(

        "🌀 Twist " +

        twist.name +

        " is now " +

        (
            twist.active
            ? "ACTIVE."
            : "INACTIVE."
        )

    );


    updateTwistDisplay();

}



/* =========================================
   DELETE TWIST
========================================= */

function deleteTwist(id) {

    customTwists =
        customTwists.filter(
            twist =>
            twist.id !== id
        );


    updateTwistDisplay();

}



/* =========================================
   CREATE ALLIANCE
========================================= */

function createAlliance() {

    const name =
        document.getElementById(
            "allianceNameInput"
        ).value.trim();


    const membersText =
        document.getElementById(
            "allianceMembersInput"
        ).value.trim();


    if (!name) {

        alert(
            "Enter an alliance name."
        );

        return;

    }


    const members =
        membersText
        .split(",")
        .map(
            name =>
            name.trim()
        )
        .filter(
            name =>
            name !== ""
        );


    alliances.push({

        id:
            Date.now(),

        name:
            name,

        members:
            members

    });


    document.getElementById(
        "allianceNameInput"
    ).value = "";


    document.getElementById(
        "allianceMembersInput"
    ).value = "";


    updateAllianceDisplay();


    addEvent(
        "🤝 Alliance formed: " +
        name
    );

}



/* =========================================
   DISPLAY ALLIANCES
========================================= */

function updateAllianceDisplay() {

    const list =
        document.getElementById(
            "allianceList"
        );


    list.innerHTML = "";


    alliances.forEach(
        alliance => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "alliance-card";


            card.innerHTML = `

                <h3>
                    🤝 ${alliance.name}
                </h3>

                <p>
                    ${alliance.members.join(
                        ", "
                    )}
                </p>

            `;


            list.appendChild(
                card
            );

        }
    );

}



/* =========================================
   RELATIONSHIP DROPDOWNS
========================================= */

function updateRelationshipPlayers() {

    const first =
        document.getElementById(
            "relationshipPlayer1"
        );


    const second =
        document.getElementById(
            "relationshipPlayer2"
        );


    first.innerHTML = "";

    second.innerHTML = "";


    houseguests.forEach(
        player => {

            const option1 =
                document.createElement(
                    "option"
                );

            option1.value =
                player.name;

            option1.textContent =
                player.name;


            first.appendChild(
                option1
            );


            const option2 =
                document.createElement(
                    "option"
                );

            option2.value =
                player.name;

            option2.textContent =
                player.name;


            second.appendChild(
                option2
            );

        }
    );

}



/* =========================================
   CREATE RELATIONSHIP
========================================= */

function createRelationship() {

    const player1 =
        document.getElementById(
            "relationshipPlayer1"
        ).value;


    const player2 =
        document.getElementById(
            "relationshipPlayer2"
        ).value;


    const score =
        Number(
            document.getElementById(
                "relationshipScore"
            ).value
        );


    if (
        !player1 ||
        !player2 ||
        player1 === player2
    ) {

        alert(
            "Choose two different houseguests."
        );

        return;

    }


    relationships.push({

        player1:
            player1,

        player2:
            player2,

        score:
            Math.min(
                100,
                Math.max(
                    0,
                    score || 50
                )
            )

    });


    updateRelationshipDisplay();

}



/* =========================================
   RELATIONSHIP DISPLAY
========================================= */

function updateRelationshipDisplay() {

    const list =
        document.getElementById(
            "relationshipList"
        );


    list.innerHTML = "";


    relationships.forEach(
        relationship => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "relationship-card";


            card.innerHTML = `

                <strong>
                    ${relationship.player1}
                </strong>

                ❤️

                <strong>
                    ${relationship.player2}
                </strong>

                <br>

                Relationship:
                ${relationship.score}/100

            `;


            list.appendChild(
                card
            );

        }
    );

}



/* =========================================
   START SEASON
========================================= */

function startNewSeason() {

    if (
        houseguests.length < 4
    ) {

        alert(
            "You need at least 4 houseguests."
        );

        return;

    }


    seasonStarted =
        true;


    currentWeek =
        1;


    currentHOH =
        null;


    nominees =
        [];


    povWinner =
        null;


    evictedHouseguests =
        [];


    jury =
        [];


    addEvent(
        "🏠 The Big Brother season has officially begun!"
    );


    updateAllDisplays();

}



/* =========================================
   RANDOM PLAYER
========================================= */

function getRandomPlayer(
    excluded = []
) {

    const available =
        houseguests.filter(
            player =>
            player.active &&
            !excluded.includes(
                player.name
            )
        );


    if (
        available.length === 0
    ) {

        return null;

    }


    return available[
        Math.floor(
            Math.random() *
            available.length
        )
    ];

}



/* =========================================
   STAT-BASED COMPETITION
========================================= */

function competitionWinner(
    type
) {

    const players =
        houseguests.filter(
            player =>
            player.active
        );


    if (
        players.length === 0
    ) {

        return null;

    }


    let weightedPlayers =
        [];


    players.forEach(
        player => {

            let stat =
                5;


            if (
                type === "physical"
            ) {

                stat =
                    player.physical;

            }


            if (
                type === "mental"
            ) {

                stat =
                    player.mental;

            }


            if (
                type === "social"
            ) {

                stat =
                    player.social;

            }


            if (
                type === "strategy"
            ) {

                stat =
                    player.strategy;

            }


            /*
                Higher stats give a player
                more entries in the draw.
            */

            for (
                let i = 0;
                i < stat;
                i++
            ) {

                weightedPlayers.push(
                    player
                );

            }

        }
    );


    return weightedPlayers[
        Math.floor(
            Math.random() *
            weightedPlayers.length
        )
    ];

}



/* =========================================
   HOH
========================================= */

function runHOH() {

    if (!seasonStarted) {

        alert(
            "Start the season first."
        );

        return;

    }


    const winner =
        competitionWinner(
            "physical"
        );


    if (!winner) return;


    currentHOH =
        winner.name;


    addEvent(

        "🏆 " +
        winner.name +
        " has won HOH!"

    );


    updateGameDisplay();

}



/* =========================================
   NOMINATIONS
========================================= */

function makeNominations() {

    if (!currentHOH) {

        alert(
            "Run HOH first."
        );

        return;

    }


    const available =
        houseguests.filter(
            player =>
            player.active &&
            player.name !== currentHOH
        );


    if (
        available.length < 2
    ) {

        return;

    }


    nominees =
        [];


    while (
        nominees.length < 2
    ) {

        const player =
            available[
                Math.floor(
                    Math.random() *
                    available.length
                )
            ];


        if (
            !nominees.includes(
                player.name
            )
        ) {

            nominees.push(
                player.name
            );

        }

    }


    addEvent(

        "📋 " +
        currentHOH +
        " nominated " +
        nominees[0] +
        " and " +
        nominees[1] +
        "."

    );


    updateGameDisplay();

}



/* =========================================
   POV
========================================= */

function runPOV() {

    if (
        nominees.length !== 2
    ) {

        alert(
            "You need two nominees first."
        );

        return;

    }


    const winner =
        competitionWinner(
            "mental"
        );


    if (!winner) return;


    povWinner =
        winner.name;


    addEvent(

        "🥇 " +
        winner.name +
        " has won the Power of Veto!"

    );


    updateGameDisplay();

}



/* =========================================
   USE POV
========================================= */

function usePOV() {

    if (!povWinner) {

        alert(
            "Run POV first."
        );

        return;

    }


    const useVeto =
        confirm(

            povWinner +
            " has won POV.\n\n" +
            "Use the Power of Veto?"

        );


    if (!useVeto) {

        addEvent(

            "🦸 " +
            povWinner +
            " decided not to use POV."

        );

        return;

    }


    let removedNominee =
        nominees[0];


    if (
        nominees.includes(
            povWinner
        )
    ) {

        removedNominee =
            povWinner;

    }


    nominees =
        nominees.filter(
            name =>
            name !== removedNominee
        );


    const replacement =
        getRandomPlayer(
            [
                currentHOH,
                povWinner,
                ...nominees
            ]
        );


    if (replacement) {

        nominees.push(
            replacement.name
        );


        addEvent(

            "🦸 " +
            povWinner +
            " used POV on " +
            removedNominee +
            ". " +
            currentHOH +
            " nominated " +
            replacement.name +
            " as the replacement nominee."

        );

    }


    updateGameDisplay();

}



/* =========================================
   EVICTION
========================================= */

function runEviction() {

    if (
        nominees.length !== 2
    ) {

        alert(
            "There must be two nominees."
        );

        return;

    }


    const nominee1 =
        houseguests.find(
            player =>
            player.name ===
            nominees[0]
        );


    const nominee2 =
        houseguests.find(
            player =>
            player.name ===
            nominees[1]
        );


    if (
        !nominee1 ||
        !nominee2
    ) {

        return;

    }


    /*
       Social and strategy affect
       eviction chances.
    */

    const score1 =
        nominee1.social +
        nominee1.strategy +
        Math.random() * 10;


    const score2 =
        nominee2.social +
        nominee2.strategy +
        Math.random() * 10;


    const evicted =
        score1 < score2
        ? nominee1
        : nominee2;


    evicted.active =
        false;


    evictedHouseguests.push(
        evicted
    );


    /*
       Players entering the jury
       once the season gets deeper.
    */

    if (
        currentWeek >= 5
    ) {

        jury.push(
            evicted
        );

    }


    addEvent(

        "🚪 " +
        evicted.name +
        " has been evicted from the Big Brother house!"

    );


    nominees =
        [];


    currentHOH =
        null;


    povWinner =
        null;


    currentWeek++;


    updateAllDisplays();


    checkForWinner();

}



/* =========================================
   WINNER
========================================= */

function checkForWinner() {

    const remaining =
        houseguests.filter(
            player =>
            player.active
        );


    if (
        remaining.length === 1
    ) {

        const winner =
            remaining[0];


        seasonStarted =
            false;


        document.getElementById(
            "finaleContent"
        ).innerHTML = `

            <h2>
                👑 ${winner.name}
            </h2>

            <p>
                ${winner.name}
                is the winner of Big Brother!
            </p>

        `;


        addEvent(

            "👑 " +
            winner.name +
            " has WON Big Brother!"

        );


        showSection(
            "finale"
        );

    }

}



/* =========================================
   EVENT LOG
========================================= */

function addEvent(
    message
) {

    const log =
        document.getElementById(
            "eventLog"
        );


    const event =
        document.createElement(
            "div"
        );


    event.className =
        "event";


    event.innerHTML =
        message.replace(
            /\n/g,
            "<br>"
        );


    log.prepend(
        event
    );

}



/* =========================================
   MEMORY WALL
========================================= */

function updateMemoryWall() {

    const wall =
        document.getElementById(
            "memoryWall"
        );


    wall.innerHTML = "";


    houseguests.forEach(
        player => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "memory-card";


            card.innerHTML = `

                <img
                    src="${player.image}"
                    alt="${player.name}"
                >

                <h3>
                    ${player.name}
                </h3>

            `;


            wall.appendChild(
                card
            );

        }
    );

}



/* =========================================
   JURY DISPLAY
========================================= */

function updateJuryDisplay() {

    const list =
        document.getElementById(
            "juryList"
        );


    list.innerHTML = "";


    if (
        jury.length === 0
    ) {

        list.innerHTML =
            "No jury members yet.";

        return;

    }


    jury.forEach(
        player => {

            const item =
                document.createElement(
                    "span"
                );


            item.className =
                "player-item evicted";


            item.textContent =
                player.name;


            list.appendChild(
                item
            );

        }
    );

}



/* =========================================
   EVICTED DISPLAY
========================================= */

function updateEvictedDisplay() {

    const list =
        document.getElementById(
            "evictedPlayers"
        );


    list.innerHTML = "";


    evictedHouseguests.forEach(
        player => {

            const item =
                document.createElement(
                    "span"
                );


            item.className =
                "player-item evicted";


            item.textContent =
                player.name;


            list.appendChild(
                item
            );

        }
    );

}



/* =========================================
   GAME DISPLAY
========================================= */

function updateGameDisplay() {

    document.getElementById(
        "weekTitle"
    ).textContent =
        "Week " +
        currentWeek;


    document.getElementById(
        "weekDisplay"
    ).textContent =
        currentWeek;


    document.getElementById(
        "hohDisplay"
    ).textContent =
        currentHOH ||
        "None";


    document.getElementById(
        "nomineesDisplay"
    ).textContent =

        nominees.length
        ? nominees.join(
            " & "
        )
        : "None";


    document.getElementById(
        "povDisplay"
    ).textContent =
        povWinner ||
        "None";

}



/* =========================================
   SEASON SUMMARY
========================================= */

function updateSeasonSummary() {

    const summary =
        document.getElementById(
            "seasonSummary"
        );


    const remaining =
        houseguests.filter(
            player =>
            player.active
        );


    summary.innerHTML = `

        <p>
            <strong>
                Week:
            </strong>
            ${currentWeek}
        </p>

        <p>
            <strong>
                Houseguests Remaining:
            </strong>
            ${remaining.length}
        </p>

        <p>
            <strong>
                Evicted:
            </strong>
            ${evictedHouseguests.length}
        </p>

        <p>
            <strong>
                Jury:
            </strong>
            ${jury.length}
        </p>

        <p>
            <strong>
                Active Twists:
            </strong>
            ${
                customTwists.filter(
                    twist =>
                    twist.active
                ).length
            }
        </p>

    `;

}



/* =========================================
   UPDATE EVERYTHING
========================================= */

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



/* =========================================
   SAVE GAME
========================================= */

function saveGame() {

    const game = {

        houseguests,

        evictedHouseguests,

        jury,

        alliances,

        relationships,

        customTwists,

        currentWeek,

        currentHOH,

        nominees,

        povWinner,

        seasonStarted

    };


    localStorage.setItem(

        "myBigBrotherSimulator",

        JSON.stringify(
            game
        )

    );


    alert(
        "Your Big Brother season has been saved!"
    );

}



/* =========================================
   LOAD GAME
========================================= */

function loadGame() {

    const saved =
        localStorage.getItem(
            "myBigBrotherSimulator"
        );


    if (!saved) {

        alert(
            "No saved season found."
        );

        return;

    }


    const game =
        JSON.parse(
            saved
        );


    houseguests =
        game.houseguests || [];


    evictedHouseguests =
        game.evictedHouseguests || [];


    jury =
        game.jury || [];


    alliances =
        game.alliances || [];


    relationships =
        game.relationships || [];


    customTwists =
        game.customTwists || [];


    currentWeek =
        game.currentWeek || 1;


    currentHOH =
        game.currentHOH || null;


    nominees =
        game.nominees || [];


    povWinner =
        game.povWinner || null;


    seasonStarted =
        game.seasonStarted || false;


    updateAllDisplays();


    addEvent(
        "💾 Saved season loaded."
    );

}



/* =========================================
   RESET
========================================= */

function resetGame() {

    if (
        !confirm(
            "Are you sure you want to erase your entire season?"
        )
    ) {

        return;

    }


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


    localStorage.removeItem(
        "myBigBrotherSimulator"
    );


    document.getElementById(
        "eventLog"
    ).innerHTML =
        "<p>Your season is ready.</p>";


    updateAllDisplays();


    alert(
        "Everything has been reset."
    );

}



/* =========================================
   INITIALIZE
========================================= */

updateAllDisplays();
```
