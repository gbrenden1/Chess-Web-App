import chessPieces from './pieces.js';
const { Piece, Pawn, Knight, Bishop, Rook, Queen, King } = chessPieces;
import readline from 'readline';

class Board {
    constructor(board = null) {
        if (board === null) {
            this.board = Array(8).fill(null).map(() => Array(8).fill(null));

            // Initialize white pieces
            this.board[0][0] = new Rook('w', [0, 0]);
            this.board[0][1] = new Knight('w', [0, 1]);
            this.board[0][2] = new Bishop('w', [0, 2]);
            this.board[0][3] = new Queen('w', [0, 3]);
            this.board[0][4] = new King('w', [0, 4]);
            this.board[0][5] = new Bishop('w', [0, 5]);
            this.board[0][6] = new Knight('w', [0, 6]);
            this.board[0][7] = new Rook('w', [0, 7]);
            this.board[1][0] = new Pawn('w', [1, 0]);
            this.board[1][1] = new Pawn('w', [1, 1]);
            this.board[1][2] = new Pawn('w', [1, 2]);
            this.board[1][3] = new Pawn('w', [1, 3]);
            this.board[1][4] = new Pawn('w', [1, 4]);
            this.board[1][5] = new Pawn('w', [1, 5]);
            this.board[1][6] = new Pawn('w', [1, 6]);
            this.board[1][7] = new Pawn('w', [1, 7]);

            // Initialize black pieces
            this.board[7][0] = new Rook('b', [7, 0]);
            this.board[7][1] = new Knight('b', [7, 1]);
            this.board[7][2] = new Bishop('b', [7, 2]);
            this.board[7][3] = new Queen('b', [7, 3]);
            this.board[7][4] = new King('b', [7, 4]);
            this.board[7][5] = new Bishop('b', [7, 5]);
            this.board[7][6] = new Knight('b', [7, 6]);
            this.board[7][7] = new Rook('b', [7, 7]);
            this.board[6][0] = new Pawn('b', [6, 0]);
            this.board[6][1] = new Pawn('b', [6, 1]);
            this.board[6][2] = new Pawn('b', [6, 2]);
            this.board[6][3] = new Pawn('b', [6, 3]);
            this.board[6][4] = new Pawn('b', [6, 4]);
            this.board[6][5] = new Pawn('b', [6, 5]);
            this.board[6][6] = new Pawn('b', [6, 6]);
            this.board[6][7] = new Pawn('b', [6, 7]);
        } else {
            this.board = Array(8).fill(null).map(() => Array(8).fill(null));

            const rows = board.split("/");
            for (let row = 0; row < 8; row++) {
                let col = 0;
                for (let char of rows[row]) {
                    if (char.match(/[1-8]/)) {
                        col += parseInt(char);
                    } else {
                        switch (char) {
                            case 'p':
                                this.board[row][col] = new Pawn('b', [row, col]);
                                break;
                            case 'n':
                                this.board[row][col] = new Knight('b', [row, col]);
                                break;
                            case 'b':
                                this.board[row][col] = new Bishop('b', [row, col]);
                                break;
                            case 'r':
                                this.board[row][col] = new Rook('b', [row, col]);
                                break;
                            case 'q':
                                this.board[row][col] = new Queen('b', [row, col]);
                                break;
                            case 'k':
                                this.board[row][col] = new King('b', [row, col]);
                                break;
                            case 'P':
                                this.board[row][col] = new Pawn('w', [row, col]);
                                break;
                            case 'N':
                                this.board[row][col] = new Knight('w', [row, col]);
                                break;
                            case 'B':
                                this.board[row][col] = new Bishop('w', [row, col]);
                                break;
                            case 'R':
                                this.board[row][col] = new Rook('w', [row, col]);
                                break;
                            case 'Q':
                                this.board[row][col] = new Queen('w', [row, col]);
                                break;
                            case 'K':
                                this.board[row][col] = new King('w', [row, col]);
                                break;
                        }
                        col++;
                    }
                }
            }
        }
    }

    checkSquare(row, col) {
        if (row < 0 || row > 7 || col < 0 || col > 7) {
            return undefined;
        } else {
            return this.board[row][col];  // null for empty square, Piece object for occupied square
        }
    }

    matrixToAlgebraic(row, col) {
        return String.fromCharCode(97 + col) + (row + 1);
    }

    algebraicToMatrix(algebraic) {
        return [parseInt(algebraic[1]) - 1, algebraic.charCodeAt(0) - 97];
    }

}

class Game {
    constructor(fenString = null, moves = null) {
        if (fenString === null) {
            this.board = new Board();
            this.turn = 'w';
            this.castling = "KQkq"
            this.enPassant = "-";
            this.halfMove = 0;
            this.fullMove = 0;
        } else {
            const [board, turn, castling, enPassant, halfMove, fullMove] = fenString.split(" ")
            this.board = new Board(board)
            this.turn = turn;
            this.castling = castling;
            this.enPassant = enPassant;
            this.halfMove = halfMove;
            this.fullMove = fullMove;
        }
        this.moves = moves === null ? [] : moves;
    }

    generateFen() {
        let fenString = "";
        for (let row of this.board.board) {
            let emptySquares = 0;
            for (let square of row) {
                if (square === null) {
                    emptySquares++;
                } else {
                    if (emptySquares > 0) {
                        fenString += emptySquares;
                        emptySquares = 0;
                    }
                    if (square.constructor.name === "Knight") {
                        fenString += square.color === 'w' ? "N" : "n";
                    } else {
                        fenString += square.color === 'w' ? square.constructor.name[0].toUpperCase() : square.constructor.name[0].toLowerCase();
                    }
                }
            }
            if (emptySquares > 0) {
                fenString += emptySquares;
            }
            fenString += "/";
        }
        fenString = fenString.slice(0, -1) + " " + this.turn + " " + this.castling + " " + this.enPassant + " " + this.halfMove + " " + this.fullMove;
        return fenString;
    }

    copy() {
        return new Game(this.generateFen(), [...this.moves]);
    }

    displayBoard() {
        let boardString = "";
        let rowNum = 1;
        for (let row of this.board.board) {
            let rowString = "";
            for (let square of row) {
                if (square === null) {
                    rowString += ". ";
                } else {
                    if (square.constructor.name === "Knight") {
                        rowString += square.color === 'w' ? "N " : "n ";
                    } else {
                        rowString += ((square.color === 'w' ? square.constructor.name[0].toUpperCase() : square.constructor.name[0].toLowerCase()) + " ");
                    }
                }
            }
            rowString += " " + rowNum++;
            boardString += "\n" + rowString + "\n";
        }
        boardString += "\na b c d e f g h";
        boardString = boardString.split("\n").reverse().join("\n");
        return boardString;
    }

    getLegalMoves(player) {
        let moves = [];

        // Get all pseudo-legal moves
        for (let piece of this.board.board.flat().filter(square => square instanceof Piece && square.color === player)) {
            moves.push(...piece.getMoves(this));
        }

        // Filter out illegal moves
        moves = moves.filter(move => {
            const gameCopy = this.copy();
            gameCopy.makeMove(move);
            return !gameCopy.inCheck(player);
        });

        return moves;
    }

    getAttackedSquares(player) {
        let squares = [];
        for (let piece of this.board.board.flat().filter(square => square instanceof Piece && square.color === player)) {
            squares.push(...piece.getAttackedSquares(this));
        }

        return squares;
    }

    inCheck(player) {
        const king = this.board.board.flat().find(square => square instanceof King && square.color === player);
        return this.getAttackedSquares(player === 'w' ? 'b' : 'w').includes(this.board.matrixToAlgebraic(...king.position));
    }

    makeMove(move) {
        const [start, end] = [this.board.algebraicToMatrix(move.slice(0, 2)), this.board.algebraicToMatrix(move.slice(2, 4))];
        const piece = this.board.board[start[0]][start[1]];
        
        // Handle pawn promotion
        if (move.endsWith('q') || move.endsWith('r') || move.endsWith('b') || move.endsWith('n')) {
            const promotedPieceType = move.charAt(4);
            const pieceConstructor = { 'q': Queen, 'r': Rook, 'b': Bishop, 'n': Knight }[promotedPieceType];
            this.board.board[end[0]][end[1]] = new pieceConstructor(this.turn, end);
            this.board.board[start[0]][start[1]] = null;
            this.enPassant = "-";
            this.halfMove = 0;
        } else {
            // Handle en passant
            if (piece instanceof Pawn && move.endsWith(this.enPassant)) {
                const capturedPawnRow = this.turn === 'w' ? end[0] - 1 : end[0] + 1;
                this.board.board[end[0]][end[1]] = piece;
                this.board.board[end[0]][end[1]].position = end;
                this.board.board[start[0]][start[1]] = null;
                this.board.board[capturedPawnRow][end[1]] = null;
                this.enPassant = "-";
                this.halfMove = 0;
            }
            // Handle castling
            else if (piece instanceof King && Math.abs(start[1] - end[1]) === 2) {
                const rookStart = end[1] === 6 ? [end[0], 7] : [end[0], 0];
                const rookEnd = end[1] === 6 ? [end[0], end[1] - 1] : [end[0], end[1] + 1];
                this.board.board[end[0]][end[1]] = piece;
                this.board.board[end[0]][end[1]].position = end;
                this.board.board[start[0]][start[1]] = null;
                this.board.board[rookEnd[0]][rookEnd[1]] = this.board.board[rookStart[0]][rookStart[1]];
                this.board.board[rookEnd[0]][rookEnd[1]].position = rookEnd;
                this.board.board[rookStart[0]][rookStart[1]] = null;
                this.castling = this.castling.replace(this.turn === 'w' ? /KQ/ : /kq/, '');
                this.halfMove++;
                this.enPassant = "-";
            }
            // Handle regular moves
            else {
                if (piece instanceof Pawn) {
                    this.halfMove = 0;
                    if (Math.abs(start[0] - end[0]) === 2) {
                        this.enPassant = this.board.matrixToAlgebraic((start[0] + end[0]) / 2, start[1]);
                    } else {
                        this.enPassant = "-";
                    }
                } else if (piece instanceof King) {
                    this.castling = this.castling.replace(this.turn === 'w' ? /K/ : /k/, '').replace(this.turn === 'w' ? /Q/ : /q/, '');
                    this.enPassant = "-";
                    this.halfMove++;
                } else if (piece instanceof Rook) {
                    if (start[1] === 0) {
                        this.castling = this.castling.replace(this.turn === 'w' ? /Q/ : /q/, '');
                    } else if (start[1] === 7) {
                        this.castling = this.castling.replace(this.turn === 'w' ? /K/ : /k/, '');
                    }
                    this.halfMove++;
                    this.enPassant = "-";
                } else {
                    this.enPassant = "-";
                    this.halfMove++;
                }

                if (this.board.board[end[0]][end[1]] !== null) {
                    if (this.board.board[end[0]][end[1]] instanceof Rook) { // update opponent's castling rights
                        if (end[0] == 0) { // white rook captured
                            if (end[1] == 0) { // queenside white rook captured
                                this.castling = this.castling.replace(/Q/, '');
                            } else if (end[1] == 7) { // kingside white rook captured
                                this.castling = this.castling.replace(/K/, '');
                            }
                        } else if (end[0] == 7) { // black rook captured
                            if (end[1] == 0) { // queenside black rook captured
                                this.castling = this.castling.replace(/q/, '');
                            } else if (end[1] == 7) { // kingside black rook captured
                                this.castling = this.castling.replace(/k/, '');
                            }
                        }
                    }
                    this.halfMove = 0;
                }

                this.board.board[end[0]][end[1]] = piece;
                this.board.board[end[0]][end[1]].position = end;
                this.board.board[start[0]][start[1]] = null;
            }
        }
    
        this.turn = this.turn === 'w' ? 'b' : 'w';
        this.fullMove += this.turn === 'w' ? 1 : 0;
        this.moves.push(move);
    }

    playGame() {
        const loop = () => {
            this.displayBoard();
            const moves = this.getLegalMoves(this.turn);
            if (moves.length === 0) {
                if (this.inCheck(this.turn)) {
                    console.log(this.turn === 'w' ? "Black wins!" : "White wins!");
                } else {
                    console.log("Stalemate!");
                }
                return;
            }
            if (this.halfMove === 100) {
                console.log("Draw by 50-move rule!");
                return;
            }
            /* RANDOM MOVE GENERATION
            const move = moves[Math.floor(Math.random() * moves.length)];
            console.log("Move:", move);
            this.makeMove(move);
            loop();
            */
            
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            rl.question("Enter your move: ", move => {
                if (!moves.includes(move)) {
                    console.log("\nIllegal move!\n\n");
                    rl.close();
                    loop();
                    return;
                }
                rl.close();
                console.log("\n")
                this.makeMove(move);
                loop();
            });
            
        };

        loop();
    }
}

// TODO: Add draw by insufficient material and draw by threefold repetition

export default Game;