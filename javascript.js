// game object to let us view and edit the gameboard
let game = (function () {
    let row = 3;
    let column = 3;
    let gameBoard = [];
    for (let i = 0 ; i < row * column; i++) {
        gameBoard[i] = (' ');
    }

    let showBoard = () => console.log(gameBoard);

    return {
        gameBoard,
        showBoard,
    }
})();

// game controller that deals with players and the user
let gameController = (function () {
    let gameWin = false;

    // making players
    let players = [];
    let createPlayer = (name, marker) => {
        if (players.length > 1) {
            console.log(`MAXIMUM PLAYERS REACHED`);
            return;
        }
        else if (marker.length > 1) {
            console.log(`PLEASE INPUT A SHORTER MARKER OF 1 CHARACTERS`)
            return;
        }
        let userPlayer = Player(name, marker);
        players.push(userPlayer);
    }

    // keep count of players turn
    let currentTurn = 0;

    // switch turn 
    let switchTurn = () => {
        if (currentTurn == 0) {
            currentTurn = 1;
        }
        else if (currentTurn == 1) {
            currentTurn = 0;
        }
    }

    // check for wins after move is played;
    const wins = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6],
    ];
    let checkWin = () => {
        for (let combination of wins) {
            let points = 0;
            for (let index of combination) {
                if (game.gameBoard[index] == players[currentTurn].marker) {
                    points++;
                }
            }
            if (points == 3) {
                gameWin = true;
                console.log(`${players[currentTurn].name} won the game!`);
            }
        }
    }

    // play a token
    let playTurn = (index) => {
        if (gameWin) {
            console.log(`Game is already won.`);
            return;
        }
        game.gameBoard[index] = players[currentTurn].marker; 
        game.showBoard();
        checkWin();
        switchTurn();
    }

    return {
        players,
        createPlayer,
        playTurn,
    }
})();

function Player (name, marker) {
    return {
        name,
        marker,
    }
}