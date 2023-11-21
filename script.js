let gameBoard = [];
let currentPiece = null;
let currentPieceInterval = null;



document.onkeydown = (e) => {
    e = e || window.event
    if (e.keyCode === 39) {
        currentPiece.moveRight();
    } else if (e.keyCode === 37) {
        currentPiece.moveLeft();
    } else if (e.keyCode === 40) {
        currentPiece.moveDown();
    }
    else if (e.keyCode === 27) {
        clearInterval(currentPieceInterval);
    }    
}

function displaySimpleGameBoard() {
    let displayString = ""
    for (let i = 0; i < 20; i ++) {
        for (let j = 0; j < 10; j ++) {
            displayString  += gameBoard[i][j][0]
        }
        displayString += "\n"; 
    }
    console.log(displayString);
}


class Piece {
    constructor(matrix, color) {
        this.pieceDefinition = matrix
        this.color = color
    }
    get definition() {
        return this.pieceDefinition
    }
    get pieceColor() {
        return this.color
    }
}


// const pieceStates = {
//     placed: -1,
//     empty: 0,
//     active: 1
// }

const gamePieces = {
    lBlock: new Piece([[1, 1, 1, 1]], "aqua"),
    jBlock: new Piece([[1, 0, 0],
                       [1, 1, 1]], "blue"),
    LBlock: new Piece([[0, 0, 1],
                       [1, 1, 1]], "orange"),
    oBlock: new Piece([[1, 1],
                       [1, 1]], "yellow"),
    sBlock: new Piece([[0, 1, 1],
                       [1, 1, 0]], "lime"),
    tBlock: new Piece([[0, 1, 0],
                       [1, 1, 1]], "purple"),
    zBlock: new Piece([[1, 1, 0],
                       [0, 1, 1],], "red")
}
const pieces = Object.values(gamePieces);
function getRandomPiece() {
    return pieces[Math.floor(Math.random() * pieces.length)];
}


class GamePiece {
    constructor(piece) {
        this.matrix = piece.definition;
        this.color = piece.color;
        this.leftX = 0;
        this.topY = 0;
        this.lastPosition = null;
    }

    get piece() {
        return this.piece;
    }
    get height() {
        return this.matrix.length;
    }
    get width() {
        return this.matrix[0].length;
    }

    setLastPostion() {
        this.lastPosition = {
            leftX: this.leftX,
            topY: this.topY,
            matrix: this.matrix
        }
    }

    spawn() {
        this.leftX = 5 - Math.ceil(this.width / 2)
        this.setLastPostion();
        this.updatePosition()
        displaySimpleGameBoard();
    }

    updatePosition() {
        this.clearPreviousPosition();
        insertGameBlock(gameBoard, this)
        updateGameBoard()
        this.setLastPostion();
    }

    moveRight() {
        if (this.leftX + this.width - 1 < 9) {
            this.leftX ++;
            this.updatePosition();
        }
    }

    moveLeft() {
        if (this.leftX > 0) {
            this.leftX --;
            this.updatePosition();
        }
    }

    moveDown() {
        if (this.topY + this.height - 1 == 19) {
            this.place();
            return;
        }
        if (this.isBlockedFromBottom()) {
            this.place();
            return;
        }
        
        if (this.topY + this.height - 1 < 19) {
            this.topY ++;
            this.updatePosition();
        }
        displaySimpleGameBoard();
    }

    printCoordinates() {
        console.log("topY: " + this.topY);
        console.log("height: " + this.height);
        console.log("leftX: " + this.leftX);
        console.log("width: " + this.width);

        // => next bottom = topY + height
        // => next left = leftX - 1
        // => next right = leftX + width
    }


    isBlockedFromBottom() {
        for (let i = 0; i < this.matrix.length; i ++) {
            for (let j = 0; j < this.matrix[0].length; j ++) {
                if (this.matrix[i][j] == 1 && gameBoard[this.topY + i + 1][this.leftX + j][0] == -1) {
                    return true;
                }
            }
        }
        return false;
    }

    clearPreviousPosition() {
        for (let i = 0; i < this.height; i ++) {
            for (let j = 0; j < this.width; j ++) {
                if (this.lastPosition.matrix[i][j] == 1) {
                    gameBoard[this.lastPosition.topY + i][this.lastPosition.leftX + j] = [0, "white"];
                }
            }
        }
    }


    place() {
        this.updatePosition();
        console.log(gameBoard);
        clearInterval(currentPieceInterval);
        applyStaticBlocks();
        generateGameBlock();
    }
}

function generateGameBoard() {
    const rows = 20;
    const cols = 10;
    var gameBoardRef = document.getElementById("game");
    for (var i = 0; i < rows; i ++) {
        let gameRow = [];
        for (var j = 0; j < cols; j ++) {
            const block = `<div class='gameBlock' id='row${i + 1}_col${j + 1}'></div>`
            gameBoardRef.innerHTML += block;
            gameRow.push([0, "white"]);
        }
        gameBoard.push(gameRow);
    }
}


function startGame() {
    generateGameBoard();
    displaySimpleGameBoard();
    generateGameBlock();
}

function generateGameBlock() {
    currentPiece = new GamePiece(getRandomPiece());
    currentPiece.spawn();
    currentPieceInterval = setInterval(() => {
        currentPiece.moveDown()
    }, 1000);
}

function updateGameBoard() {
    const gameBlocks = document.getElementsByClassName('gameBlock');
    let blockNum = 0;
    for (let i = 0; i < gameBoard.length; i++) {
        for (let j = 0; j < gameBoard[i].length; j++) {
            if (gameBoard[i][j][0] == 1) {
                gameBlocks[blockNum].style.backgroundColor = gameBoard[i][j][1];
            } else if (gameBoard[i][j][0] == 0){
                gameBlocks[blockNum].style.backgroundColor = "white";
            }
            // jeśli coś jest położone - nie ruszaj tego.
            blockNum++;
        }
    }
}

function insertGameBlock(board, block) {
    for (let i = 0; i < block.height; i ++) {
        for (let j = 0; j < block.width; j ++) {
            if (board[block.topY + i][block.leftX + j][0] == 0) {
                board[block.topY + i][block.leftX + j] = [block.matrix[i][j], block.color]
            }
            
        }
    }
}

function applyStaticBlocks() {
    for (let i = 0; i < gameBoard.length; i ++) {
        for (let j = 0; j < gameBoard[i].length; j ++) {
            if (gameBoard[i][j][0] == 1) {
                gameBoard[i][j][0] = -1;
            }
        }
    }
}