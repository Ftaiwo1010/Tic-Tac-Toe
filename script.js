const body = document.querySelector('body');
const darkModeButton = document.querySelector('.light-dark');
const containerElement = document.querySelector('.container');
const controlsElement = document.querySelectorAll('.control > div');
const cellElement = document.querySelectorAll('.grid-box > .cell');
const restartGameButtonElement = document.querySelector('.restart-game-btn');
const resetGameElement = document.querySelector('.reset-game');
const displayGameMsg = document.querySelector('.player-turn');
const player1Name = document.querySelector('.player1-name');
const player1Score = document.querySelector('.player1-score > .score');
const player2Name = document.querySelector('.player2-name');
const player2Score = document.querySelector('.player2-score > .score');
const tieScore = document.querySelector('.tie-score > .score');



darkModeButton.addEventListener('click', () => {
   if ( body.classList.toggle('dark')) {
      darkModeButton.firstElementChild.className = 'fa-solid fa-sun';
      containerElement.classList.add('dark');
      controlsElement.forEach(div => div.classList.add('dark'));
      cellElement.forEach(div => div.classList.add('dark'));
   } else {
      darkModeButton.firstElementChild.className = 'fa-solid fa-moon'; 
      containerElement.classList.remove('dark');
      controlsElement.forEach(div => div.classList.remove('dark'));
      cellElement.forEach(div => div.classList.remove('dark'));
   }
});




const CreatePlayerForm = () => {
   // form background layer
   const formBackGround = document.createElement('div');
   formBackGround.className = 'form-background';
   body.appendChild(formBackGround);

   // form
   const playerForm = document.createElement('form');
   formBackGround.appendChild(playerForm);

   // form title
   const formTitle = document.createElement('h1');
   formTitle.textContent = 'Tic Tac Toe';
   playerForm.appendChild(formTitle);

   // player controls div
   const formControlDiv = document.createElement('div');
   formControlDiv.classList.add('form-control-div');
   playerForm.appendChild(formControlDiv);

   // player 1
   const player1ControlDiv = document.createElement('div');
   formControlDiv.appendChild(player1ControlDiv);

   const player1Label = document.createElement('label');
   player1Label.htmlFor = 'player1';
   player1Label.textContent = 'Enter name for player 1:';
   player1ControlDiv.appendChild(player1Label);

   const player1Input = document.createElement('input');
   player1Input.type = 'text';
   player1Input.name = 'player1';
   player1Input.id = 'player1';
   player1Input.required = true;
   player1ControlDiv.appendChild(player1Input);


   // player 2
   const player2ControlDiv = document.createElement('div');
   formControlDiv.appendChild(player2ControlDiv);

   const player2Label = document.createElement('label');
   player2Label.htmlFor = 'player2';
   player2Label.textContent = 'Enter name for player 2:';
   player2ControlDiv.appendChild(player2Label);

   const player2Input = document.createElement('input');
   player2Input.type = 'text';
   player2Input.name = 'player2';
   player2Input.id = 'player2';
   player2Input.required = true;
   player2ControlDiv.appendChild(player2Input);


   const formSubmitButton = document.createElement('button');
   formSubmitButton.textContent = 'Start Game';
   formSubmitButton.type = 'submit';
   playerForm.appendChild(formSubmitButton);


   if ( body.classList.contains('dark')) {
      formBackGround.classList.add('dark');
      formSubmitButton.classList.add('dark');
   } else {
      formBackGround.classList.remove('dark');
      formSubmitButton.classList.remove('dark');
   }



   
   // submit player names
   playerForm.addEventListener('submit', (e) => {
      e.preventDefault(); 

      const playerName1 = player1Input.value.trim();
      const playerName2 = player2Input.value.trim();

      displayController.startGame(playerName1, playerName2);
     
      body.removeChild(formBackGround);
   })


};

window.addEventListener('load', CreatePlayerForm);



// Function that get players name
function Player (name, marker) {
  return {name, marker};
};




// IIFE for GameBoard
const GameBoard = (() => {
  let board = Array(9).fill('');

  // getBoard function
  function getBoard() {
    return board;
  }

  // getBoardCell Function
  function getBoardCell(index) {
    return board[index];
  }

  // setBoardCell Function
  function setBoardCell(index, marker) {
     if (board[index] === '') {
       board[index] = marker;  // add marker cell
       displayController.renderBoard();
       return true;  // move successful
     }
     displayController.showMsg(`spot is taken!`);
     return false // spot is taken
  }

  // resetBoard Function
  function resetBoard() {
    return board = Array(9).fill('');
  }


  return { getBoard, getBoardCell, setBoardCell, resetBoard };
})();




// IIFE for GameState
// that check (winner / tie)
const GameState = (() => {
  // winning combo
  const winningCombo = [
    [0, 1, 2], // top row
    [3, 4, 5], // middle row
    [6, 7, 8], // bottom row
    [0, 3, 6], // left column
    [1, 4, 7], // middle column
    [2, 5, 8], // right column
    [0, 4, 8], // diagonal
    [2, 4, 6]  // other diagonal
  ]


  // check winner function
  function checkWinner(board) {
    for (const combo of winningCombo) {
        const [a, b, c] = combo;
       if (board[a] && board[a] === board[b] && board[b] === board[c]) {
          return board[a]
       }
    }
    return null;
  }   


  // check tie function
  function checkTie(board) {
    return board.every(cell => cell !== '');
  }   

  return { checkWinner, checkTie };
})();



const GameController = (playerName1, playerName2) => {
   // initialize player
   let player1 = Player(playerName1, '<i class="fa-solid fa-xmark"></i>');
   let player2 = Player(playerName2, '<i class="fa-solid fa-o"></i>');
   let currentPlayer = player1;


   let score1 = 0;
   let score2 = 0;
   let score3 = 0;
   // player score function
   function plyerScore() {
      let isWinner = GameState.checkWinner(GameBoard.getBoard());;
      if (isWinner === player1.marker) {
          score1++;
          player1Score.textContent = score1;
      } else {
          score2++;
          player2Score.textContent = score2;
      } 
   }

   // isTie score function
   function isTieScore() {
      score3++;
      tieScore.textContent = score3;
   }


   // getCurrentPlayer Function
   function getCurrentPlayer() {
       return currentPlayer;
   }


   // reset turn Function
   function resetTurn() {
       currentPlayer = player1;
   }
 

   // switch turn function
   function switchTurns() {
      currentPlayer = currentPlayer === player1 ? player2 : player1;
      displayController.showMsg(`${currentPlayer.name}'s turn`);
   }


   // players turn function
   function playTurn(index) {
      const placeMaker = GameBoard.setBoardCell(index, currentPlayer.marker);
      if (!placeMaker) return;  // invalid move

      // check winner
      const isWinner = GameState.checkWinner(GameBoard.getBoard());
      if (isWinner) {
         displayController.showMsg(`${currentPlayer.name} wins!`);
         plyerScore();
         displayController.removeClick();
         restartGameButtonElement.style.display = 'block';
         return;
      }


      // check tie
      const isTie = GameState.checkTie(GameBoard.getBoard());
      if (isTie) {
         displayController.showMsg(`It's a tie!`);
         isTieScore();
         displayController.removeClick();
         restartGameButtonElement.style.display = 'block';
         return;T
      }

      switchTurns();
   }


   return { playTurn, getCurrentPlayer, resetTurn, player1, player2, score1, score2, score3 };

};




// IIFE for displayController
const displayController = (() => {
   let gameController = GameController();
   let gameOver = false  // flag to handle clicks
   let handlers = [];   // store references to listeners


   // render Function
   function renderBoard() {
      cellElement.forEach((cell, index) => {
         cell.innerHTML = GameBoard.getBoardCell(index)
      });
   }



   // resetCell
   function resetCell() {
      GameBoard.resetBoard();
      gameController.resetTurn();

      renderBoard();
      showMsg(`${gameController.getCurrentPlayer().name}'s turn`);
      gameOver = false;
   }


   // show message function
   function showMsg(msg) {
      displayGameMsg.textContent = msg;
   }


   // handle click function
   function handleClick(index) {
      if (gameOver) return // stop clicks if game is over
      gameController.playTurn(index);
      console.log(`Clicked cell index: ${index}`);
   }


   // remove click function
   function removeClick() {
      gameOver = true; 
   }


   // initialize board function
   function initializeBoard() {
      cellElement.forEach((cell, index) => {
         const handler = () => handleClick(index);
         handlers[index] = handler;
        cell.addEventListener('click', handler);
        console.log(handlers);
      });

      player1Name.textContent = `${gameController.player1.name}:`;
      player2Name.textContent = `${gameController.player2.name}:`;
      player1Score.textContent = 0;
      player2Score.textContent = 0;
      tieScore.textContent = 0;

      renderBoard();
      showMsg(`${gameController.getCurrentPlayer().name}'s turn`);

   }


   function clearBoardEvents() {
      cellElement.forEach((cell, index) => {
         if(handlers[index]) {
           cell.removeEventListener('click', handlers[index]) 
         }
      });

      handlers = []; // reset
   }


   function startGame(name1, name2) {
      clearBoardEvents();
      gameController = GameController(name1, name2);
      initializeBoard();
   }


   // handle restart game button
   restartGameButtonElement.addEventListener('click', () => {
      resetCell();
      restartGameButtonElement.style.display = 'none';
   });


   // reset the whole game
   resetGameElement.addEventListener('click', () => {
      clearBoardEvents();
      CreatePlayerForm();
      resetCell();

      player1Name.textContent = `${gameController.player1.name}:`;
      player2Name.textContent = `${gameController.player2.name}:`;
      player1Score.textContent = 0;
      player2Score.textContent = 0;
      tieScore.textContent = 0;

      restartGameButtonElement.style.display = 'none';
   });


   return { renderBoard, showMsg, removeClick, startGame };
   
})();

