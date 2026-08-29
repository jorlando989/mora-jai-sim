import * as tileActions from "./tileActions.js";
import { generateBox } from "./generateBox.js";

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

function checkIfBoxSolved(cornerTiles) {
	var numCorrect = 0;
	cornerTiles.forEach(tile => {
		if (tile.classList.length == 4) {
			numCorrect++;
		}
	});

	if (numCorrect == 4) {
		const solvedModal = document.querySelector("#solved-modal");
		solvedModal.showModal();
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
var mode = "Edit";
var currButtonId = -1;
var startingSolve = [];

const tileSelectModal = document.querySelector("#tile-select-modal");
const closeModalBtn = document.querySelector("#closeModalBtn");
const modalColorButtons = document.querySelectorAll(".color-option");
const tileButtons = document.querySelectorAll(".main-tile");
const cornerButtons = document.querySelectorAll(".corner");
const generateButton = document.querySelector("#generate");

const dropdown = document.querySelector("#modeSelector");
dropdown.addEventListener("change", event => {
	const selectedMode = event.target.value;
	console.log(`${selectedMode} mode selected`);
	mode = selectedMode;
	if (mode == "Solve") {
		const copiedTiles = Array.from(tileButtons, node => node.cloneNode(true));
		const copiedCorners = Array.from(cornerButtons, node => node.cloneNode(true));
		startingSolve = [copiedTiles, copiedCorners];
	}
});

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
	}
});

generateButton.addEventListener("click", () => {
	console.log("generating new box...");
	const newBoxConfiguration = generateBox();
	currButtonId = -1;
	//re-render box
	cornerButtons.forEach(button => {
		button.className = ["tile", "corner", "grey-realm"].join(" ");
	});
	tileButtons.forEach(button => {
		button.className = ["tile", "main-tile", "grey-tile"].join(" ");
	});
	renderBox(newBoxConfiguration);
	const copiedTiles = Array.from(tileButtons, node => node.cloneNode(true));
	const copiedCorners = Array.from(cornerButtons, node => node.cloneNode(true));
	startingSolve = [copiedTiles, copiedCorners];
});

tileButtons.forEach(button => {
	button.addEventListener("click", () => {
		console.log(`button ${button.id} clicked`);
		if (mode == "Edit") {
			currButtonId = button.id;
			tileSelectModal.showModal();
		} else {
			doTileAction(button, tileButtons);
		}
	});
});

cornerButtons.forEach(button => {
	button.addEventListener("click", () => {
		console.log(`corner button ${button.id} clicked`);
		if (mode == "Edit") {
			currButtonId = button.id;
			tileSelectModal.showModal();
		} else {
			checkForMatch(button, tileButtons, startingSolve);
			checkIfBoxSolved(cornerButtons);
		}
	});
});

closeModalBtn.addEventListener("click", () => {
	tileSelectModal.close();
	currButtonId = -1;
});

modalColorButtons.forEach(button => {
	button.addEventListener("click", () => {
		console.log(`${button.id} color selected`);
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
