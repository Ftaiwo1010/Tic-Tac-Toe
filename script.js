const para = document.querySelector('.output');
const boards = document.querySelectorAll('.board');
const button = document.querySelector('button');



const gameBoard = {
   board: Array(9).fill(''),
};

const player1 = {name: 'Player 1', mark: 'X'};
const player2 = {name: 'Player 2', mark: 'O'};


const game = {
   currentPlayer: player1,

   playerTurns: function(index) {
      if (gameBoard.board[index] === '') {
         gameBoard.board[index] = this.currentPlayer.mark;
         this.renderBoard();

         const winner = this.checkWinner();
         if (winner) {
            this.displayMessage(`${winner} wins!`);
            this.disableBoard();
            this.displayButton();
            return;
         }

         if (!gameBoard.board.includes('')) {
             this.displayMessage('It\'s a tie!');
             this.displayButton();
             return;
         }

         this.switchTurns();
         
      } else {
          this.displayMessage(`Cell is already taken`);
      }
   },

   switchTurns: function() {
      this.currentPlayer = this.currentPlayer === player1 ? player2 : player1;
      this.displayMessage(`${this.currentPlayer.name}'s turn!`);
   },

  checkWinner: function() {
     const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],  //row combos
        [0, 3, 6], [1, 4, 7], [2, 5, 8],  //column combos
        [0, 4, 8], [2, 4, 6],             //diagonal combo
     ]

     for (const combos of winningCombos) {
        const [a, b, c] = combos;

        if (gameBoard.board[a] && 
            gameBoard.board[a] === gameBoard.board[b] &&
            gameBoard.board[a] === gameBoard.board[c]
        ) {
           return this.currentPlayer.name;
        }
     }

     return null;
  },


  renderBoard: function() {
    boards.forEach((board, index) => {
        board.textContent = gameBoard.board[index];
    });
  },

  displayMessage: function(message) {
     para.textContent = message;
  },

  disableBoard: function() {
    boards.forEach((board) => board.removeEventListener('click', handleBoardClick));
  },

  displayButton: function() {
    button.style.display = 'block';
    button.addEventListener('click', this.resetBoard.bind(this))
  },

  resetBoard: function () {
    //Reset the game board
    gameBoard.board = Array(9).fill('');
    this.currentPlayer = player1;

    //Clear the UI
    this.renderBoard();
    this.displayMessage(`${this.currentPlayer.name}'s turn!`);

    //Re-enable the board
    boards.forEach((board) => board.addEventListener('click', handleBoardClick));

    //Remove the reset button
    button.style.display = 'none';
  }

};




function handleBoardClick(e, index) {
    game.playerTurns(index);
    console.log(`Clicked cell index: ${index}`);

}


function initializeBoard() {
    boards.forEach((board, index) => {
        board.addEventListener('click', (e) => handleBoardClick(e, index));
    })

    game.renderBoard();
    game.displayMessage(`${game.currentPlayer.name}'s turn!`)
}


initializeBoard();

