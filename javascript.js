// dom realted object and is initialized first to use in game object
let DOM = (function () {
  let gameboardDOM = document.querySelector(".board");

  let clearGrid = function () {
    gameboardDOM.innerHTML = '';
  }

  let render = function (value, index) {
    let square = document.createElement("div");
    square.className = "square";
    square.dataset.index = index;

    let span = document.createElement('span');
    span.textContent = value;
    square.appendChild(span);
    gameboardDOM.appendChild(square);

    if (value == gameController.players[0].marker) {
      span.classList.add('red');
    }
    else if (value == gameController.players[1].marker) {
      span.classList.add('blue');
    }

    square.addEventListener("click", (e) => {
      gameController.playTurn(e.target.dataset.index)
    });
  };

  let startButton = document.querySelector('#startButton');
  startButton.addEventListener("click", (e) => {
    debugger;
      createPlayerDom();

      // reset board array for rendering properly
      let status = document.querySelector('#statusDiv');
      status.className = ``;
      game.resetBoardArray();
      gameController.switchWon();

      // for dom 
      DOM.clearGrid();
      game.makeGrid();
  });

  let createPlayerDom = function () {
    gameController.players.length = 0;

    let player1nameInput = document.querySelector('#player1name');
    let player1markInput = document.querySelector('#player1mark');
    let player2nameInput = document.querySelector('#player2name');
    let player2markInput = document.querySelector('#player2mark');

    let player1name = player1nameInput.value;
    let player1mark = player1markInput.value;
    let player2name = player2nameInput.value;
    let player2mark = player2markInput.value;

    gameController.createPlayer(player1name, player1mark);
    gameController.createPlayer(player2name, player2mark);

    changeStatus(`${player1name} turn to play`);
  }

  let changeStatus = function (value) {
    let status = document.querySelector('#statusDiv');
    status.textContent = value;
  }

  let changeGameWon = function (playerIndex) {
    let status = document.querySelector('#statusDiv');
    status.classList.add('won');
    if (playerIndex == 0) {
      status.classList.add('player1');
    }
    else if (playerIndex == 1) {
      status.classList.add('player2');
    }
  }

  return {
    render,
    createPlayerDom,
    clearGrid,
    changeStatus,
    changeGameWon,
  };
})();

// game object to let us view and edit the gameboard
let game = (function () {

  let gameBoard = [];

  let resetBoardArray = function () {
    for (let i = 0; i < 9; i++) {
      gameBoard[i] = ' ';
    }
    gameController.gameWon = false;
  }

  let makeGrid = function () {
    let row = 3;
    let column = 3;
    for (let i = 0; i < row * column; i++) {
      DOM.render(gameBoard[i], i);
    }
  }

  return {
    gameBoard,
    makeGrid,
    resetBoardArray,
  };
})();

// game controller that deals with players and the user
let gameController = (function () {
  // making players
  let players = [];

  let createPlayer = (name, marker) => {
    let userPlayer = Player(name, marker);
    players.push(userPlayer);
  };

  // keep count of players turn
  let currentTurn = 0;

  // switch turn
  let switchTurn = () => {
    if (currentTurn == 0) {
      currentTurn = 1;
    } else if (currentTurn == 1) {
      currentTurn = 0;
    }
  };

  // check for wins after move is played;
  const wins = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  let gameWon = false;

  let switchWon = function () {
    currentTurn = 0;
    gameWon = false;
  }

  let checkWin = () => {
    for (let combination of wins) {
      let points = 0;
      for (let index of combination) {
        if (game.gameBoard[index] == players[currentTurn].marker) {
          points++;
        }
      }
      if (points == 3) {
        gameWon = true;
        return true;
      }
    }
    return false;
  };

  // play a token
  let playTurn = (index) => {
    debugger;

    if (gameWon) {
      return;
    }

    if (game.gameBoard[index] != ' ') {
      DOM.changeStatus('Please pick a different square.')
      return;
    }
    else {
      game.gameBoard[index] = players[currentTurn].marker;
    }
    
    // for dom 
    DOM.clearGrid();
    game.makeGrid();

    if (checkWin()) {
      DOM.changeStatus(`${players[currentTurn].name} Won !`);
      DOM.changeGameWon(currentTurn);
      return;
    };

    switchTurn();
    DOM.changeStatus(`${players[currentTurn].name} turn to play`);
  };

  return {
    players,
    createPlayer,
    playTurn,
    gameWon,
    switchWon,
  };
})();

function Player(name, marker) {
  return {
    name,
    marker,
  };
}

DOM.createPlayerDom();
game.resetBoardArray();
game.makeGrid();