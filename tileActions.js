function getTileColor(tile) {
    const regex = /^(?!main-)\w+-tile$/;
    const matchedClass = Array.from(tile.classList).find(className => regex.test(className));
    return matchedClass.split("-")[0];
}

function swapTwoTiles(currTile, swapTileInd, allTiles) {
	const currTileClass = currTile.className;
	const swapTileClass = allTiles[swapTileInd].className;

	allTiles[currTileInd].className = swapTileClass;
	allTiles[swapTileInd].className = currTileClass;
}

function getOrthAdjTileInds(currTileInd) {
    const width = 3, height = 3;
    const currTileCoords = [Math.floor(currTileInd / height), currTileInd % width];
    const adjTileInds = [];
	if (currTileCoords[0] > 0)
		adjTileInds.push((currTileCoords[0] - 1) * width + currTileCoords[1]);
	if (currTileCoords[0] < height - 1)
		adjTileInds.push((currTileCoords[0] + 1) * width + currTileCoords[1]);
	if (currTileCoords[1] > 0)
		adjTileInds.push(currTileCoords[0] * width + (currTileCoords[1] - 1));
	if (currTileCoords[1] < width - 1)
		adjTileInds.push(currTileCoords[0] * 3 + (currTileCoords[1] + 1));
    return adjTileInds;
}

// swap across box
export function greenTileAction(currTile, allTiles) {
	const currTileInd = currTile.id.split("-")[1];
	var swapTileInd;
	if (currTileInd == 4) return;
	if (currTileInd == 0) swapTileInd = 8;
	else if (currTileInd == 1) swapTileInd = 7;
	else if (currTileInd == 2) swapTileInd = 6;
	else if (currTileInd == 3) swapTileInd = 5;
	else if (currTileInd == 5) swapTileInd = 3;
	else if (currTileInd == 6) swapTileInd = 2;
	else if (currTileInd == 7) swapTileInd = 1;
	else if (currTileInd == 8) swapTileInd = 0;

	swapTwoTiles(currTile, swapTileInd, allTiles);
	console.log("performed green tile action");
}

// swap adj tiles b/w white and grey (doesnt affect other colors)
export function whiteTileAction(currTile, allTiles) {
	const currTileInd = Number(currTile.id.split("-")[1]);
	const adjTileInds = getOrthAdjTileInds(currTileInd);

	adjTileInds.forEach(adjTileInd => {
		if (adjTileInd < 0 || adjTileInd > 8) return;
		if (allTiles[adjTileInd].classList.contains("white-tile")) {
			allTiles[adjTileInd].classList.remove("white-tile");
			allTiles[adjTileInd].classList.add("grey-tile");
		} else if (allTiles[adjTileInd].classList.contains("grey-tile")) {
			allTiles[adjTileInd].classList.remove("grey-tile");
			allTiles[adjTileInd].classList.add("white-tile");
		}
	});

	currTile.classList.remove("white-tile");
	currTile.classList.add("grey-tile");

	console.log("performed white tile action");
}

// any tile on board white -> black & black -> red
export function redTileAction(currTile, allTiles) {
	allTiles.forEach(tile => {
		if (tile.classList.contains("white-tile")) {
			tile.classList.remove("white-tile");
			tile.classList.add("black-tile");
		} else if (tile.classList.contains("black-tile")) {
			tile.classList.remove("black-tile");
			tile.classList.add("red-tile");
		}
	});
	console.log("performed red tile action");
}

// cycle tiles in row (shift right)
export function blackTileAction(currTile, allTiles) {
	const currTileInd = currTile.id.split("-")[1];
	if (currTileInd < 3) {
		const tile1Class = allTiles[0].className;
		const tile2Class = allTiles[1].className;
		const tile3Class = allTiles[2].className;

		allTiles[0].className = tile3Class;
		allTiles[1].className = tile1Class;
		allTiles[2].className = tile2Class;
	} else if (currTileInd < 6) {
		const tile1Class = allTiles[3].className;
		const tile2Class = allTiles[4].className;
		const tile3Class = allTiles[5].className;

		allTiles[3].className = tile3Class;
		allTiles[4].className = tile1Class;
		allTiles[5].className = tile2Class;
	} else {
		const tile1Class = allTiles[6].className;
		const tile2Class = allTiles[7].className;
		const tile3Class = allTiles[8].className;

		allTiles[6].className = tile3Class;
		allTiles[7].className = tile1Class;
		allTiles[8].className = tile2Class;
	}
	console.log("performed black tile action");
}

// rotate adj tiles clockwise
export function pinkTileAction(currTile, allTiles) {
	console.log("performed pink tile action");
}

// move down
export function purpleTileAction(currTile, allTiles) {
	const currTileInd = Number(currTile.id.split("-")[1]);
	if (currTileInd > 5) return;

	const swapTileInd = currTileInd + 3;
	swapTwoTiles(currTile, swapTileInd, allTiles);
	console.log("performed purple tile action");
}

// move up
export function yellowTileAction(currTile, allTiles) {
	const currTileInd = currTile.id.split("-")[1];
	if (currTileInd < 3) return;

	const swapTileInd = currTileInd - 3;
	swapTwoTiles(currTile, swapTileInd, allTiles);
	console.log("performed yellow tile action");
}

// transform self to majority color in surrounding orth adj tiles
export function orangeTileAction(currTile, allTiles) {
    const currTileInd = Number(currTile.id.split("-")[1]);
	const adjTileInds = getOrthAdjTileInds(currTileInd);
    
    const adjColors = new Map();
    adjTileInds.forEach(adjTileInd => {
        const adjColor = getTileColor(allTiles[adjTileInd]);
        if (adjColors.has(getTileColor(allTiles[adjTileInd]))) {
            adjColors.set(adjColor, adjColors.get(adjColor) + 1);
        } else {
            adjColors.set(adjColor, 1);
        }
    });

    //choose majority color

    //set curr tile to majority color

	console.log("performed orange tile action");
}

// mimic center tile
export function blueTileAction(currTile, allTiles) {
	console.log("performed blue tile action");
}
