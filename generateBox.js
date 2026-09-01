import * as colorActions from "./tileActions.js";

const colors = ["red", "green", "blue", "white", "black", "orange", "yellow", "pink", "purple", "grey"];

export function generateBox() {
    var isSolvable = false;
    var boxHash = "";
    var cornerHash = "";
    while (!isSolvable) {
        for (var i=0; i<9; i++) {
            const colorInd = Math.floor(Math.random() * 10);
            boxHash += colorInd;
        }

        //corner cant be grey
        for (var i=0; i<4; i++) {
            const colorInd = Math.floor(Math.random() * 9);
            cornerHash += colorInd;
        }

        const validSolution = validateConfiguration(boxHash, cornerHash);
        //ensure solution isnt too easy
        if (validSolution != null && validSolution[1] > 2) isSolvable = true;
        else {
            boxHash = "";
            cornerHash = "";
        }
    }
    return [hashToColors(boxHash), hashToColors(cornerHash)];
}

export function hashToColors(hash) {
    var boxColors = [];
    hash.split("").forEach((x) => {
        boxColors.push(colors[Number(x)]);
    });
    return boxColors;
}

function validateConfiguration(boxHash, cornerHash) {
    var endState = [cornerHash[0], "0", cornerHash[1], "0", "0", "0", cornerHash[2], "0", cornerHash[3]].join("");
    
    const solution = bfsSolve(boxHash, endState);
    if (solution == null) return null;
    return solution;
}

function getPossibleActions(currState) {
    //possible action is clicking any button that isnt grey
    var possibleActions = [];
    for (var i=0; i<currState.length; i++) {
        if (currState[i] == 9) continue;
        possibleActions.push([currState[i], colors[currState[i]]]);
    }
    return possibleActions;
}

function applyAction(currState, action) {
    // console.log(`apply ${action} action to curr state of ${currState}`);
    var newState;
    if (action[1] == "red") newState = colorActions.redAction(action[0], currState);
    else if (action[1] == "green") newState = colorActions.greenAction(action[0], currState);
    else if (action[1] == "blue") newState = colorActions.blueAction(action[0], currState);
    else if (action[1] == "white") newState = colorActions.whiteAction(action[0], currState);
    else if (action[1] == "black") newState = colorActions.blackAction(action[0], currState);
    else if (action[1] == "orange") newState = colorActions.orangeAction(action[0], currState);
    else if (action[1] == "yellow") newState = colorActions.yellowAction(action[0], currState);
    else if (action[1] == "pink") newState = colorActions.pinkAction(action[0], currState);
    else if (action[1] == "purple") newState = colorActions.purpleAction(action[0], currState);
    return newState;
}

//not sure this is needed, the actions already only make valid moves
function isValidState(currState) {
    return true;
}

function bfsSolve(startState, endState) {
    const maxMoves = 10;
    var numMoves = 0;
    const queue = [];
    const visited = new Set();

    queue.push(startState);
    visited.add(startState);

    while (queue.length > 0 && numMoves < maxMoves) {
        const currState = queue.shift();
        //check for end state, but only corners matter
        if (currState[0] == endState[0] && currState[2] == endState[2] && currState[6] == endState[6] && currState[8] == endState[8]) {
            return [currState, numMoves];
        }
        const validActions = getPossibleActions(currState);
        validActions.forEach((action) => {
            const nextState = applyAction(currState, action);
            if (isValidState(nextState) && !visited.has(nextState)) {
                visited.add(nextState);
                queue.push(nextState);
            }
        });
        numMoves++;
    }

    return null;
}