import * as tileActions from "./tileActions.js";
import { generateBox, hashToColors } from "./generateBox.js";

/* check if the corner matches the nearest tile */
function checkForMatch(cornerTile, allTiles, startingSolve) {
	const cornerColor = tileActions.getCornerTileColor(cornerTile);

	var closestTileColor;
	if (cornerTile.id == "top-left") {
		closestTileColor = tileActions.getTileColor(allTiles[0]);
	} else if (cornerTile.id == "top-right") {
		closestTileColor = tileActions.getTileColor(allTiles[2]);
	} else if (cornerTile.id == "bottom-left") {
		closestTileColor = tileActions.getTileColor(allTiles[6]);
	} else if (cornerTile.id == "bottom-right") {
		closestTileColor = tileActions.getTileColor(allTiles[8]);
	}
	
	if (cornerColor != closestTileColor) {
		resetBox(startingSolve);
	} else {
		// mark corner solved
		cornerTile.classList.add(`${cornerColor}-tile`);
	}
}

async function checkIfBoxSolved(cornerTiles, movesMade) {
	var numCorrect = 0;
	cornerTiles.forEach(tile => {
		if (tile.classList.length == 4) {
			numCorrect++;
		}
	});

	if (numCorrect == 4) {
		const solvedModal = document.querySelector("#solved-modal");
		const finalMovesSpan = document.querySelector("#final-moves");
		finalMovesSpan.textContent = movesMade;
		solvedModal.showModal();

		//get avg moves from today
		const dailyStatsResponse = await fetch("http://127.0.0.1:8000/getDailyStats");
		const dailyStatsData = await dailyStatsResponse.json();
		const averageMovesSpan = document.querySelector("#average-moves");
		averageMovesSpan.textContent = dailyStatsData.avgMoves;

		// send stats to backend
		const stats = {
			movesMade: movesMade,
			timestamp: new Date().toISOString()
		};
		const response = await fetch("http://127.0.0.1:8000/addDailyStats", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(stats)
		});
		if (!response.ok) {
			console.error("Failed to send stats to backend");
		}
	}
}

/* do the corresponding action for the clicked tile */
function doTileAction(currTile, allTiles) {
	if (currTile.classList.contains("green-tile")) {
		tileActions.greenTileAction(currTile, allTiles);
	} else if (currTile.classList.contains("red-tile")) {
		tileActions.redTileAction(currTile, allTiles);
	} else if (currTile.classList.contains("black-tile")) {
		tileActions.blackTileAction(currTile, allTiles);
	} else if (currTile.classList.contains("yellow-tile")) {
		tileActions.yellowTileAction(currTile, allTiles);
	} else if (currTile.classList.contains("pink-tile")) {
		tileActions.pinkTileAction(currTile, allTiles);
	} else if (currTile.classList.contains("purple-tile")) {
		tileActions.purpleTileAction(currTile, allTiles);
	} else if (currTile.classList.contains("orange-tile")) {
		tileActions.orangeTileAction(currTile, allTiles);
	} else if (currTile.classList.contains("white-tile")) {
		tileActions.whiteTileAction(currTile, allTiles);
	} else if (currTile.classList.contains("blue-tile")) {
		tileActions.blueTileAction(currTile, allTiles);
	}
}

function resetBox(startingSolve) {
	const tileButtons = document.querySelectorAll(".main-tile");
	const cornerButtons = document.querySelectorAll(".corner");

	for (var i=0; i<startingSolve[0].length; i++) {
		tileButtons[i].className = startingSolve[0][i].className;
	}
	for (var i=0; i<startingSolve[1].length; i++) {
		cornerButtons[i].className = startingSolve[1][i].className;
	}
	console.log("resetting to starting solving state...");
}

function renderBox(boxConfig) {
	const tileButtons = document.querySelectorAll(".main-tile");
	const cornerButtons = document.querySelectorAll(".corner");

	console.log(boxConfig);

	const tileColors = boxConfig[0];
	const cornerColors = boxConfig[1];
	for (var i=0; i<tileColors.length; i++) {
		tileButtons[i].classList.remove("grey-tile");
		tileButtons[i].classList.add(`${tileColors[i]}-tile`);
	};

	for (var i=0; i<cornerColors.length; i++) {
		cornerButtons[i].classList.remove("grey-realm");
		cornerButtons[i].classList.add(`${cornerColors[i]}-realm`);
	};
}


// set starting values
var mode = "Daily";
var currButtonId = -1;
var startingSolve = [];
var movesMade = 0;

const tileSelectModal = document.querySelector("#tile-select-modal");
const closeModalBtn = document.querySelector("#closeModalBtn");
const modalColorButtons = document.querySelectorAll(".color-option");
const tileButtons = document.querySelectorAll(".main-tile");
const cornerButtons = document.querySelectorAll(".corner");
// const generateButton = document.querySelector("#generate");
const statsButton = document.querySelector("#view-stats");
const closeStatsModalBtn = document.querySelector("#closeStatsModalBtn");
const closeSolvedModalBtn = document.querySelector("#closeSolvedModalBtn");

closeStatsModalBtn.addEventListener("click", () => {
	const statsModal = document.querySelector("#stats-modal");
	statsModal.close();
});

closeSolvedModalBtn.addEventListener("click", () => {
	const solvedModal = document.querySelector("#solved-modal");
	solvedModal.close();
});

statsButton.addEventListener("click", async () => {
	const response = await fetch("http://127.0.0.1:8000/getStatsHistory")
	const statsHistoryData = await response.json();
	console.log("history:",statsHistoryData)

	const statsModal = document.querySelector("#stats-modal");
	const statsContentDiv = document.querySelector("#stats-content");
	statsContentDiv.innerHTML = ""; // Clear previous content

	// Create table
	const table = document.createElement("table");
	table.classList.add("stats-table");

	// Create header row
	const headerRow = document.createElement("tr");
	const headers = ["Date", "Average Moves", "Number of Solvers"];
	headers.forEach(headerText => {
		const th = document.createElement("th");
		th.textContent = headerText;
		headerRow.appendChild(th);
	});
	table.appendChild(headerRow);

	// Create data rows
	statsHistoryData.forEach(entry => {
		const row = document.createElement("tr");
		const dateCell = document.createElement("td");
		dateCell.textContent = entry.date;
		const avgMovesCell = document.createElement("td");
		avgMovesCell.textContent = entry.avgMoves;
		const numSolversCell = document.createElement("td");
		numSolversCell.textContent = entry.numSolvers;

		row.appendChild(dateCell);
		row.appendChild(avgMovesCell);
		row.appendChild(numSolversCell);
		table.appendChild(row);
	});

	statsContentDiv.appendChild(table);
	statsModal.showModal();
});

window.addEventListener('load', async () => {
	const response = await fetch("http://127.0.0.1:8000/dailyPuzzle")
	const dailyPuzzleInfo = await response.json();
	console.log(dailyPuzzleInfo)
	
	//set as starting solve and set corners and box to this starting position
	const dailyTileColors = hashToColors(dailyPuzzleInfo.dailyPuzzleHash);
	const dailyCornerColors = hashToColors(dailyPuzzleInfo.dailyCornerHash);
	renderBox([dailyTileColors, dailyCornerColors]);

	const copiedTiles = Array.from(tileButtons, node => node.cloneNode(true));
	const copiedCorners = Array.from(cornerButtons, node => node.cloneNode(true));
	startingSolve = [copiedTiles, copiedCorners];

	console.log("Daily Puzzle loaded")
});

// const dropdown = document.querySelector("#modeSelector");
// dropdown.addEventListener("change", event => {
// 	const selectedMode = event.target.value;
// 	console.log(`${selectedMode} mode selected`);
// 	mode = selectedMode;
// 	if (mode == "Solve") {
// 		const copiedTiles = Array.from(tileButtons, node => node.cloneNode(true));
// 		const copiedCorners = Array.from(cornerButtons, node => node.cloneNode(true));
// 		startingSolve = [copiedTiles, copiedCorners];
// 	}
// });

const resetButton = document.querySelector("#reset");
resetButton.addEventListener("click", () => {
	console.log("reset box");
	if (mode == "Edit") {
		currButtonId = -1;
		//re-render box
		cornerButtons.forEach(button => {
			button.className = ["tile", "corner", "grey-realm"].join(" ");
		});
		tileButtons.forEach(button => {
			button.className = ["tile", "main-tile", "grey-tile"].join(" ");
		});
	} else {
		// reset box to starting pattern for solving
		resetBox(startingSolve);
		movesMade = 0;
		const movesMadeSpan = document.querySelector("#moves-made");
		movesMadeSpan.textContent = movesMade;
	}
});

// generateButton.addEventListener("click", () => {
// 	console.log("generating new box...");
// 	const newBoxConfiguration = generateBox();
// 	currButtonId = -1;
// 	//re-render box
// 	cornerButtons.forEach(button => {
// 		button.className = ["tile", "corner", "grey-realm"].join(" ");
// 	});
// 	tileButtons.forEach(button => {
// 		button.className = ["tile", "main-tile", "grey-tile"].join(" ");
// 	});
// 	renderBox(newBoxConfiguration);
// 	const copiedTiles = Array.from(tileButtons, node => node.cloneNode(true));
// 	const copiedCorners = Array.from(cornerButtons, node => node.cloneNode(true));
// 	startingSolve = [copiedTiles, copiedCorners];
// });

tileButtons.forEach(button => {
	button.addEventListener("click", () => {
		if (mode == "Edit") {
			currButtonId = button.id;
			tileSelectModal.showModal();
		} else {
			doTileAction(button, tileButtons);
			movesMade++;
			const movesMadeSpan = document.querySelector("#moves-made");
			movesMadeSpan.textContent = movesMade;
		}
	});
});

cornerButtons.forEach(button => {
	button.addEventListener("click", () => {
		if (mode == "Edit") {
			currButtonId = button.id;
			tileSelectModal.showModal();
		} else {
			checkForMatch(button, tileButtons, startingSolve);
			checkIfBoxSolved(cornerButtons, movesMade);
		}
	});
});

closeModalBtn.addEventListener("click", () => {
	tileSelectModal.close();
	currButtonId = -1;
});

modalColorButtons.forEach(button => {
	button.addEventListener("click", () => {
		const currButton = document.querySelector(`.tile#${currButtonId}`);
		if (currButton.classList.contains("corner")) {
			//remove color class if exists
			if (currButton.classList.length > 2) {
				currButton.className = ["tile", "corner"].join(" ");
			}
			currButton.classList.add(`${button.id}-realm`);
		} else {
			//remove color class if exists
			if (currButton.classList.length > 2) {
				currButton.className = ["tile", "main-tile"].join(" ");
			}
			currButton.classList.add(`${button.id}-tile`);
		}
		tileSelectModal.close();
		currButtonId = -1;
	});
});
