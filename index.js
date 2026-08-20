import * as tileActions from "./tileActions.js";

/* check if the corner matches the nearest tile */
function checkForMatch(cornerTile, allTiles) {

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

// set starting values
var mode = "Edit";
// var buttons = new Array(9).fill(Colors.GREY);
var currButtonId = -1;

const dropdown = document.querySelector("#modeSelector");
dropdown.addEventListener("change", event => {
	const selectedMode = event.target.value;
	console.log(`${selectedMode} mode selected`);
	mode = selectedMode;
});

const tileSelectModal = document.querySelector("#tile-select-modal");
const closeModalBtn = document.querySelector("#closeModalBtn");
const modalColorButtons = document.querySelectorAll(".color-option");
const tileButtons = document.querySelectorAll(".main-tile");
const cornerButtons = document.querySelectorAll(".corner");

const resetButton = document.querySelector("#reset");
resetButton.addEventListener("click", () => {
	console.log("reset box");
	if (mode == "Edit") {
		currButtonId = -1;
		//re-render box
		cornerButtons.forEach(button => {
			button.className = ["tile", "corner"].join(" ");
		});
		tileButtons.forEach(button => {
			button.className = ["tile", "main-tile", "grey-tile"].join(" ");
		});
	} else {
		// reset box to starting pattern for solving
	}
});

tileButtons.forEach(button => {
	button.addEventListener("click", event => {
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
	button.addEventListener("click", event => {
		console.log(`corner button ${button.id} clicked`);
		if (mode == "Edit") {
			currButtonId = button.id;
			tileSelectModal.showModal();
		} else {
			checkForMatch(button, tileButtons);
		}
	});
});

closeModalBtn.addEventListener("click", () => {
	tileSelectModal.close();
	currButtonId = -1;
});

modalColorButtons.forEach(button => {
	button.addEventListener("click", event => {
		console.log(`${button.id} color selected`);
		const currButton = document.querySelector(`.tile#${currButtonId}`);
		if (currButton.classList.contains("corner")) {
			//remove color class if exists
			if (currButton.classList.length > 2) {
				currButton.className = ["tile", "corner"].join(" ");
			}
			currButton.classList.add(`${button.id}-tile`);
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
