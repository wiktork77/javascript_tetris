let gameBoard = [];

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

class GamePiece {
    constructor(piece) {
        this.matrix = piece.definition;
        this.color = piece.color;
        this.leftX = 1;
        this.topY = 20;
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

        for (let i = startIndexRow; i <= endIndexRow; i++) {
            for (let j = startIndexCol; j <= endIndexCol; j++) {
                gameBoard[i][j] = [this.matrix[i - startIndexRow][j - startIndexCol], this.color];
            }   
        }
        updateGameBoard();
    }
}


const currentPiece = gamePieces.lBlock;

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
    const testPiece = new GamePiece(currentPiece);
    testPiece.spawn();
}


// function populateGameBoard(matrix, color, leftX, topY) {
//     let startIndex = 20 - topY;
//     const endIndex = startIndex + matrix.length;
//     for (startIndex; )
// }

function updateGameBoard() {
    const gameBlocks = document.getElementsByClassName('gameBlock');
    let blockNum = 0;
    for (let i = 0; i < gameBoard.length; i++) {
        for (let j = 0; j < gameBoard[i].length; j++) {
            if (gameBoard[i][j][0] == 1) {
                gameBlocks[blockNum].style.backgroundColor = gameBoard[i][j][1];
            }
            blockNum++;
        }
    }
}



/* 

        const gameBlocks = document.getElementsByClassName('gameBlock');
        let factor = 0;
        if (this.leftX != 0) {
            factor = -1;
        }
        // 
        for (let i = 0; i < this.matrix.length; i++) {
            const heightFactor = (20 - this.topY + i) * 10;
            for (let j = 0; j < this.matrix[i].length; j ++) {
                if (this.matrix[i][j] == 1) {
                    console.log(heightFactor + this.leftX + j + factor);
                    const currentBlock = gameBlocks[heightFactor + this.leftX + j + factor];
                    currentBlock.style.backgroundColor = this.color; 
                }
            }
        }

*/