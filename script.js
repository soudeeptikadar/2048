const boardSize = 4;
let board = [];
let history = [];
let score = 0;

const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('start-button');
const undoButton = document.getElementById('undo-button');
const gameBoard = document.getElementById('game-board');
const gameOver = document.getElementById('game-over');

function initGame() {
    board = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));
    score = 0;
    scoreDisplay.textContent = score;
    addRandomTile();
    addRandomTile();
    renderBoard();
    gameOver.classList.add('hidden');
    undoButton.classList.add('hidden');
}

function addRandomTile() {
    const emptyCells = [];
    board.forEach((row, rIndex) => {
        row.forEach((cell, cIndex) => {
            if (cell === 0) emptyCells.push([rIndex, cIndex]);
        });
    });
    if (emptyCells.length === 0) return;
    const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[r][c] = Math.random() < 0.9 ? 2 : 4;
}

function renderBoard() {
    gameBoard.innerHTML = '';
    board.forEach(row => {
        row.forEach(cell => {
            const tile = document.createElement('div');
            tile.className = 'tile';
            if (cell !== 0) {
                tile.classList.add(`tile-${cell}`);
                tile.textContent = cell;
            }
            gameBoard.appendChild(tile);
        });
    });
}

function moveTiles(direction) {
    saveState();
    let moved = false;
    switch (direction) {
        case 'up':
            for (let col = 0; col < boardSize; col++) {
                moved |= moveColumn(col, 'up');
            }
            break;
        case 'down':
            for (let col = 0; col < boardSize; col++) {
                moved |= moveColumn(col, 'down');
            }
            break;
        case 'left':
            for (let row = 0; row < boardSize; row++) {
                moved |= moveRow(row, 'left');
            }
            break;
        case 'right':
            for (let row = 0; row < boardSize; row++) {
                moved |= moveRow(row, 'right');
            }
            break;
    }
    if (moved) {
        addRandomTile();
        renderBoard();
        checkGameOver();
    }
}

function moveRow(row, direction) {
    let moved = false;
    let newRow = Array(boardSize).fill(0);
    let mergePosition = -1;
    
    if (direction === 'left') {
        let position = 0;
        for (let col = 0; col < boardSize; col++) {
            if (board[row][col] !== 0) {
                if (newRow[position] === 0) {
                    newRow[position] = board[row][col];
                } else if (newRow[position] === board[row][col] && position > mergePosition) {
                    newRow[position] *= 2;
                    mergePosition = position;
                    score += newRow[position];
                } else {
                    position++;
                    newRow[position] = board[row][col];
                }
                moved = true;
            }
        }
    } else if (direction === 'right') {
        let position = boardSize - 1;
        for (let col = boardSize - 1; col >= 0; col--) {
            if (board[row][col] !== 0) {
                if (newRow[position] === 0) {
                    newRow[position] = board[row][col];
                } else if (newRow[position] === board[row][col] && position < mergePosition) {
                    newRow[position] *= 2;
                    mergePosition = position;
                    score += newRow[position];
                } else {
                    position--;
                    newRow[position] = board[row][col];
                }
                moved = true;
            }
        }
    }

    if (JSON.stringify(board[row]) !== JSON.stringify(newRow)) {
        board[row] = newRow;
        return true;
    }
    return false;
}

function moveColumn(col, direction) {
    let moved = false;
    let newCol = Array(boardSize).fill(0);
    let mergePosition = -1;

    if (direction === 'up') {
        let position = 0;
        for (let row = 0; row < boardSize; row++) {
            if (board[row][col] !== 0) {
                if (newCol[position] === 0) {
                    newCol[position] = board[row][col];
                } else if (newCol[position] === board[row][col] && position > mergePosition) {
                    newCol[position] *= 2;
                    mergePosition = position;
                    score += newCol[position];
                } else {
                    position++;
                    newCol[position] = board[row][col];
                }
                moved = true;
            }
        }
    } else if (direction === 'down') {
        let position = boardSize - 1;
        for (let row = boardSize - 1; row >= 0; row--) {
            if (board[row][col] !== 0) {
                if (newCol[position] === 0) {
                    newCol[position] = board[row][col];
                } else if (newCol[position] === board[row][col] && position < mergePosition) {
                    newCol[position] *= 2;
                    mergePosition = position;
                    score += newCol[position];
                } else {
                    position--;
                    newCol[position] = board[row][col];
                }
                moved = true;
            }
        }
    }

    for (let row = 0; row < boardSize; row++) {
        if (board[row][col] !== newCol[row]) {
            board[row][col] = newCol[row];
            moved = true;
        }
    }
    return moved;
}

function saveState() {
    history.push(JSON.parse(JSON.stringify(board)));
}

function undoMove() {
    if (history.length > 0) {
        board = history.pop();
        renderBoard();
        updateScore();
    }
}

function checkAchievements() {
    // Implement achievement logic if any
}

function checkGameOver() {
    if (board.flat().every(cell => cell !== 0)) {
        let gameOver = true;
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                if (row < boardSize - 1 && board[row][col] === board[row + 1][col]) {
                    gameOver = false;
                }
                if (col < boardSize - 1 && board[row][col] === board[row][col + 1]) {
                    gameOver = false;
                }
            }
        }
        if (gameOver) {
            gameOver.classList.remove('hidden');
            undoButton.classList.add('hidden');
        }
    }
}

function updateScore() {
    scoreDisplay.textContent = score;
}

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            moveTiles('up');
            break;
        case 'ArrowDown':
            moveTiles('down');
            break;
        case 'ArrowLeft':
            moveTiles('left');
            break;
        case 'ArrowRight':
            moveTiles('right');
            break;
    }
});

startButton.addEventListener('click', initGame);
undoButton.addEventListener('click', undoMove);

initGame();
