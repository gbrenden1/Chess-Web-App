class Piece {
    constructor(color, position) {
        this.color = color;
        this.position = position;
    }
}

class Pawn extends Piece {
    constructor(color, position) {
        super(color, position);
    }

    getMoves(game) {
        let moves = [];
        const [row, col] = this.position;
        const rowDirection = this.color === 'w' ? 1 : -1;  // direction of movement indicates color of pawn

        // Non-capturing moves
        const moveCap = (rowDirection === 1 && row === 1 || rowDirection === -1 && row === 6) ? 2 : 1;  // check if pawn is in starting position
        for (let i = 1; i <= moveCap; i++) {
            const [targetRow, targetCol] = [row + i * rowDirection, col];
            const itemOnSquare = game.board.checkSquare(targetRow, targetCol);
            if (itemOnSquare === null) {
                if (targetRow === 7 || targetRow === 0) {
                    for (const piece of ['q', 'r', 'b', 'n']) {
                        moves.push(game.board.matrixToAlgebraic(row, col) + game.board.matrixToAlgebraic(targetRow, targetCol) + piece);  // add promotion move
                    }
                } else {
                    moves.push(game.board.matrixToAlgebraic(row, col) + game.board.matrixToAlgebraic(targetRow, targetCol));  // convert matrix coordinates to algebraic notation and add move
                }
            } else {
                break;  // stop if there is a piece in the way
            }
        }

        // Capturing moves
        const captureDirections = [1, -1];
        for (const colDir of captureDirections) {
            const [targetRow, targetCol] = [row + rowDirection, col + colDir];
            const itemOnSquare = game.board.checkSquare(targetRow, targetCol);
            if (itemOnSquare instanceof Piece && itemOnSquare.color !== this.color || game.enPassant === game.board.matrixToAlgebraic(targetRow, targetCol)) {
                if (targetRow === 7 || targetRow === 0) {
                    for (const piece of ['q', 'r', 'b', 'n']) {
                        moves.push(game.board.matrixToAlgebraic(row, col) + game.board.matrixToAlgebraic(targetRow, targetCol) + piece);  // add promotion move
                    }
                } else {
                    moves.push(game.board.matrixToAlgebraic(row, col) + game.board.matrixToAlgebraic(targetRow, targetCol));  // add capture move
                }
            }
        }

        return moves;
    }

    getAttackedSquares(game) {
        let squares = [];
        const [row, col] = this.position;
        const rowDir = this.color === 'w' ? 1 : -1;  // direction of movement indicates color of pawn
        const captureDirections = [1, -1];

        for (const colDir of captureDirections) {
            const [targetRow, targetCol] = [row + rowDir, col + colDir];
            const itemOnSquare = game.board.checkSquare(targetRow, targetCol);
            if (itemOnSquare !== undefined) {
                squares.push(game.board.matrixToAlgebraic(targetRow, targetCol));
            }
        }

        return squares;
    }
}

class Knight extends Piece {
    constructor(color, position) {
        super(color, position);
    }

    getMoves(game) {
        let moves = [];
        const [row, col] = this.position;
        const moveDirections = [[1, 2], [1, -2], [-1, 2], [-1, -2], [2, 1], [2, -1], [-2, 1], [-2, -1]];

        for (const [rowDir, colDir] of moveDirections) {
            const [targetRow, targetCol] = [row + rowDir, col + colDir];
            const itemOnSquare = game.board.checkSquare(targetRow, targetCol);
            if (itemOnSquare === null || itemOnSquare instanceof Piece && itemOnSquare.color !== this.color) {
                moves.push(game.board.matrixToAlgebraic(row, col) + game.board.matrixToAlgebraic(targetRow, targetCol));
            }

        }

        return moves;
    }

    getAttackedSquares(game) {
        let squares = [];
        const [row, col] = this.position;
        const moveDirections = [[1, 2], [1, -2], [-1, 2], [-1, -2], [2, 1], [2, -1], [-2, 1], [-2, -1]];

        for (const [rowDir, colDir] of moveDirections) {
            const [targetRow, targetCol] = [row + rowDir, col + colDir];
            const itemOnSquare = game.board.checkSquare(targetRow, targetCol);
            if (itemOnSquare !== undefined) {
                squares.push(game.board.matrixToAlgebraic(targetRow, targetCol));
            }
        }

        return squares;
    }
}

class Bishop extends Piece {
    constructor(color, position) {
        super(color, position);
    }

    getMoves(game) {
        let moves = [];
        const [row, col] = this.position;
        const moveDirections = [[1, 1], [1, -1], [-1, 1], [-1, -1]];

        for (const [rowDir, colDir] of moveDirections) {
            for (let i = 1; i <= 7; i++) {
                const [targetRow, targetCol] = [row + i * rowDir, col + i * colDir];
                const itemOnSquare = game.board.checkSquare(targetRow, targetCol);
                if (itemOnSquare === null) {
                    moves.push(game.board.matrixToAlgebraic(row, col) + game.board.matrixToAlgebraic(targetRow, targetCol));
                } else if (itemOnSquare instanceof Piece && itemOnSquare.color !== this.color) {
                    moves.push(game.board.matrixToAlgebraic(row, col) + game.board.matrixToAlgebraic(targetRow, targetCol));
                    break;
                } else {  // end of board or own piece
                    break;
                }
            }
        }

        return moves;
    }

    getAttackedSquares(game) {
        let squares = [];
        const [row, col] = this.position;
        const moveDirections = [[1, 1], [1, -1], [-1, 1], [-1, -1]];

        for (const [rowDir, colDir] of moveDirections) {
            for (let i = 1; i <= 7; i++) {
                const [targetRow, targetCol] = [row + i * rowDir, col + i * colDir];
                const itemOnSquare = game.board.checkSquare(targetRow, targetCol);
                if (itemOnSquare instanceof Piece) {
                    squares.push(game.board.matrixToAlgebraic(targetRow, targetCol));
                    break;
                } else if (itemOnSquare !== undefined) {
                    squares.push(game.board.matrixToAlgebraic(targetRow, targetCol));
                }
            }
        }

        return squares
    }
}

class Rook extends Piece {
    constructor(color, position) {
        super(color, position);
    }

    getMoves(game) {
        let moves = [];
        const [row, col] = this.position;
        const moveDirections = [[1, 0], [-1, 0], [0, 1], [0, -1]];

        for (const [rowDir, colDir] of moveDirections) {
            for (let i = 1; i <= 7; i++) {
                const [targetRow, targetCol] = [row + i * rowDir, col + i * colDir];
                const itemOnSquare = game.board.checkSquare(targetRow, targetCol);
                if (itemOnSquare === null) {
                    moves.push(game.board.matrixToAlgebraic(row, col) + game.board.matrixToAlgebraic(targetRow, targetCol));
                } else if (itemOnSquare instanceof Piece && itemOnSquare.color !== this.color) {
                    moves.push(game.board.matrixToAlgebraic(row, col) + game.board.matrixToAlgebraic(targetRow, targetCol));
                    break;
                } else {  // end of board or own piece
                    break;
                }
            }
        }

        return moves;
    }

    getAttackedSquares(game) {
        let squares = [];
        const [row, col] = this.position;
        const moveDirections = [[1, 0], [-1, 0], [0, 1], [0, -1]];

        for (const [rowDir, colDir] of moveDirections) {
            for (let i = 1; i <= 7; i++) {
                const [targetRow, targetCol] = [row + i * rowDir, col + i * colDir];
                const itemOnSquare = game.board.checkSquare(targetRow, targetCol);
                if (itemOnSquare instanceof Piece) {
                    squares.push(game.board.matrixToAlgebraic(targetRow, targetCol));
                    break;
                } else if (itemOnSquare !== undefined) {
                    squares.push(game.board.matrixToAlgebraic(targetRow, targetCol));
                }
            }
        }

        return squares;
    }
}

class Queen extends Piece {
    constructor(color, position) {
        super(color, position);
    }

    getMoves(game) {
        let moves = [];
        const [row, col] = this.position;
        const moveDirections = [[1, 1], [1, -1], [-1, 1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]];

        for (const [rowDir, colDir] of moveDirections) {
            for (let i = 1; i <= 7; i++) {
                const [targetRow, targetCol] = [row + i * rowDir, col + i * colDir];
                const itemOnSquare = game.board.checkSquare(targetRow, targetCol);
                if (itemOnSquare === null) {
                    moves.push(game.board.matrixToAlgebraic(row, col) + game.board.matrixToAlgebraic(targetRow, targetCol));
                } else if (itemOnSquare instanceof Piece && itemOnSquare.color !== this.color) {
                    moves.push(game.board.matrixToAlgebraic(row, col) + game.board.matrixToAlgebraic(targetRow, targetCol));
                    break;
                } else {  // end of board or own piece
                    break;
                }
            }
        }

        return moves;
    }

    getAttackedSquares(game) {
        let squares = [];
        const [row, col] = this.position;
        const moveDirections = [[1, 1], [1, -1], [-1, 1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]];

        for (const [rowDir, colDir] of moveDirections) {
            for (let i = 1; i <= 7; i++) {
                const [targetRow, targetCol] = [row + i * rowDir, col + i * colDir];
                const itemOnSquare = game.board.checkSquare(targetRow, targetCol);
                if (itemOnSquare instanceof Piece) {
                    squares.push(game.board.matrixToAlgebraic(targetRow, targetCol));
                    break;
                } else if (itemOnSquare !== undefined) {
                    squares.push(game.board.matrixToAlgebraic(targetRow, targetCol));
                }
            }
        }

        return squares;
    }
}

class King extends Piece {
    constructor(color, position) {
        super(color, position);
    }

    getMoves(game) {
        let moves = [];
        const [row, col] = this.position;
        const moveDirections = [[1, 1], [1, -1], [-1, 1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]];
        const attackedSquares = game.getAttackedSquares(this.color === 'w' ? 'b' : 'w');

        // Regular moves
        for (const [rowDir, colDir] of moveDirections) {
            const [targetRow, targetCol] = [row + rowDir, col + colDir];
            const itemOnSquare = game.board.checkSquare(targetRow, targetCol);
            if (itemOnSquare === null || itemOnSquare instanceof Piece && itemOnSquare.color !== this.color) {
                moves.push(game.board.matrixToAlgebraic(row, col) + game.board.matrixToAlgebraic(targetRow, targetCol));
            }
        }

        if (!attackedSquares.includes(game.board.matrixToAlgebraic(row, col))) {
            // Castling: Queenside
            if (game.castling.includes(this.color === 'w' ? 'Q' : 'q')) {
                for (let i = 1; i <= 3; i++) {
                    const itemOnSquare = game.board.checkSquare(row, i);
                    if (itemOnSquare !== null || attackedSquares.includes(game.board.matrixToAlgebraic(row, i))) {
                        break;
                    }
                    if (i === 3) {
                        moves.push(game.board.matrixToAlgebraic(row, col) + game.board.matrixToAlgebraic(row, 2));
                    }
                }
            }

            // Castling: Kingside
            if (game.castling.includes(this.color === 'w' ? 'K' : 'k')) {
                for (let i = 5; i <= 6; i++) {
                    const itemOnSquare = game.board.checkSquare(row, i);
                    if (itemOnSquare !== null || attackedSquares.includes(game.board.matrixToAlgebraic(row, i))) {
                        break;
                    }
                    if (i === 6) {
                        moves.push(game.board.matrixToAlgebraic(row, col) + game.board.matrixToAlgebraic(row, 6));
                    }
                }
            }
        }

        return moves;
    }

    getAttackedSquares(game) {
        let squares = [];
        const [row, col] = this.position;
        const moveDirections = [[1, 1], [1, -1], [-1, 1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]];

        for (const [rowDir, colDir] of moveDirections) {
            const [targetRow, targetCol] = [row + rowDir, col + colDir];
            const itemOnSquare = game.board.checkSquare(targetRow, targetCol);
            if (itemOnSquare instanceof Piece) {
                squares.push(game.board.matrixToAlgebraic(targetRow, targetCol));
            } else if (itemOnSquare !== undefined) {
                squares.push(game.board.matrixToAlgebraic(targetRow, targetCol));
            }
        }

        return squares;
    }
}

export default {
    Piece,
    Pawn,
    Knight,
    Bishop,
    Rook,
    Queen,
    King
};