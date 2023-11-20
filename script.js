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
}

function displaySimpleGameBoard() {
    let gb = []
    for (let i = 0; i < 20; i++) {
        gb.push([]);
    }
    for (let i = 0; i < 20; i ++) {
        for (let j = 0; j < 10; j ++) {
            gb[i][j] = gameBoard[i][j][0]
        } 
    }
    console.log(gb);
}



// most left, most top
function getAllPositionCoordinates(leftX, topY, matrix) {
    return {
        leftX: leftX,
        rightX: getRightX(leftX, matrix),
        topY: topY,
        bottomY: topY + 1 - matrix.length
    }
}

function getRightX(leftX, matrix) {
    let mostRight = 0;
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] == 1 && j > mostRight) {
                mostRight = j;
            }
        }
    }
    return leftX + mostRight;
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

class GamePiece {
    constructor(piece) {
        this.matrix = piece.definition;
        this.color = piece.color;
        this.leftX = 1;
        this.topY = 20;
        this.lastPosition = null;
    }

    get piece() {
        return this.piece;
    }

    spawn() {
        let wide = this.matrix[0].length
        this.leftX = 6 - Math.ceil(wide/2)
        this.updatePosition()
    }

    updatePosition() {
        let startIndexRow = 20 - this.topY;
        let endIndexRow = startIndexRow + this.matrix.length - 1;
        let startIndexCol = this.leftX - 1;
        let endIndexCol = startIndexCol + this.matrix[0].length - 1;

        if (this.lastPosition != null) {
            this.clearPreviousPosition();
        }

        for (let i = startIndexRow; i <= endIndexRow; i++) {
            for (let j = startIndexCol; j <= endIndexCol; j++) {
                gameBoard[i][j] = [this.matrix[i - startIndexRow][j - startIndexCol], this.color];
            }   
        }
        this.lastPosition = {
            leftX: this.leftX,
            topY: this.topY,
            matrix: this.matrix
        }
        updateGameBoard();
        displaySimpleGameBoard();
    }

    moveRight() {
        if (this.leftX + this.matrix[0].length <= 10) {
            this.leftX ++;
            this.updatePosition();
        }
    }

    moveLeft() {
        if (this.leftX > 1) {
            this.leftX --;
            this.updatePosition();
        }
    }

    moveDown() {
        // ? Pomyslec nad tym
        // if (this.isBlockedFromBottom()) {
        //     this.place();
        // }
        if (this.topY - this.matrix.length - 1 >= 0) {
            this.topY --;
            console.log("moving down");
            this.updatePosition();
        } else {
            this.place();
            return;
        }
    }

    // sprawdzic na zasadzie pokrywania się jedynek 

    isBlockedFromBottom() {
        const bottomGameboardPosition = (20 - this.topY) + this.matrix.length + 1;
        if (bottomGameboardPosition >= 20) {
            return true;
        }
        const xStart = this.leftX - 1;
        const xEnd = xStart + this.matrix[0].length - 1;
        console.log(bottomGameboardPosition);
        for (let i = xStart; i <= xEnd; i++) {
            if (gameBoard[bottomGameboardPosition][i][0] == 1 && this.matrix[this.matrix.length - 1][i - xStart] == 1) {
                return true;
            }
        }
        return false;
    }

    clearPreviousPosition() {
        let startIndexRow = 20 - this.lastPosition.topY;
        let endIndexRow = startIndexRow + this.matrix.length - 1;
        let startIndexCol = this.lastPosition.leftX - 1;
        let endIndexCol = startIndexCol + this.matrix[0].length - 1;
        for (let i = startIndexRow; i <= endIndexRow; i++) {
            for (let j = startIndexCol; j <= endIndexCol; j++) {
                if (this.lastPosition.matrix[i-startIndexRow][j-startIndexCol] == 1) {
                    gameBoard[i][j] = [0, null];
                }
                
            }   
        }
        updateGameBoard();
    }

    place() {
        clearInterval(currentPieceInterval);
        updateGameBoard();
        generateGameBlock();
        console.log("placing block");
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
            gameRow.push([0, null]);
        }
        gameBoard.push(gameRow);
    }
}


function startGame() {
    generateGameBoard();
    generateGameBlock();
}

function generateGameBlock() {
    const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
    currentPiece = new GamePiece(randomPiece);
    currentPiece.spawn();
    currentPieceInterval = setInterval(() => {currentPiece.moveDown()}, 750);
}


function updateGameBoard() {
    const gameBlocks = document.getElementsByClassName('gameBlock');
    let blockNum = 0;
    for (let i = 0; i < gameBoard.length; i++) {
        for (let j = 0; j < gameBoard[i].length; j++) {
            if (gameBoard[i][j][0] == 1) {
                gameBlocks[blockNum].style.backgroundColor = gameBoard[i][j][1];
            } else {
                gameBlocks[blockNum].style.backgroundColor = "white";
            }
            blockNum++;
        }
    }
}

function checkIfMatricesOverlap(mainMatrix, subMatrix, leftX, topY) {
    // check if you substitute subMatrix into mainMatrix, with positioning leftX, topY, are there are gonna be any overlapping ones.
}