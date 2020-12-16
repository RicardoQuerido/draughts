PIECE_MODEL = "aa";

class Board {
    size;
    pieces = {
        white: [],
        black: [],
    };
    isWhiteTurn = true;

    constructor(size) {
        this.size = size;

        if (size < 6) {
            return null;
        }
        
        const generate = (s, w) => {
            var set = [];
            const boardSize = s * s - 1
            const maxPlayerPieces = s * 3 / 2;

            for (var i = -2; i <= (s-2); i+=2) {
                for (var j = 0; j <= 2; j++) {
                    let position = i + j * (s + 1);
                    let id = Math.floor(position / 2)

                    if (i + j >= 0 && i + j < s) {

                        if (!w) {
                            position = boardSize - position;
                            id = (maxPlayerPieces * 2 - 1) - id;
                        }

                        set.push(new Piece(id, position, w, PIECE_MODEL));
                    }
                }
            }
            return set.sort((a, b) => a.id <= b.id ? -1 : 1);
        }

        this.pieces.white = generate(size, true);
        this.pieces.black = generate(size, false)
    }

    get isWhiteTurn() {
        return this.isWhiteTurn;
    }

    set isWhiteTurn(bool) {
        this.isWhiteTurn = bool;
    }

    getPieceById(id) {
        if (id < this.size * 1.5 ) {
            return this.pieces.white.find(_ => _.id === id);
        } else {
            return this.pieces.black.find(_ => _.id === id);
        }
    }

    resolveMove(p, w, isKing, xDir, yDir, eating = false, moves = 0) {
        const self = w ? this.pieces.white : this.pieces.black;
        const enemy = w ? this.pieces.black : this.pieces.white;

        const maxMovesDir = {
            up: this.size - Math.floor(p / this.size) + 1,
            down: Math.floor(p / this.size),
            left: p % 8,
            right: this.size - p % 8 - 1
        }

        let ret = {
            position: p,
            maxMoves: moves,
        };             

        if (
            (yDir > 0 && maxMovesDir.up < 1) ||
            (yDir < 0 && maxMovesDir.down < 1) ||
            (xDir > 0 && maxMovesDir.right < 1) ||
            (xDir < 0 && maxMovesDir.left < 1)
        ) return ret;

        const newPos = p + (this.size * yDir) + xDir;

        const occupied = {
            self: self.find(_ => _.position === newPos),
            enemy: enemy.find(_ => _.position === newPos)
        }

        if (occupied.self) return ret;

        else if (occupied.enemy) {
            if (eating) return ret;
            else {
                const tryEat = this.resolveMove(newPos, w, isKing, xDir, yDir, true, moves + 1);
                if (tryEat.position != newPos) return ({...tryEat, ate: occupied.enemy});
                else return ret;
            }
        }

        else if (eating) {
            ret.position = newPos;
            ret.maxMoves = moves + 1;

            return ret; 
        }

        else {
            if (!isKing) {
                ret.position = newPos;
                ret.maxMoves = moves + 1;

                return ret;
            }

            return this.resolveMove(newPos, w, isKing, xDir, yDir, eating, moves + 1);
        }
    }

    getMoveOpts(id) {
        const { position, isKing, white } = this.getPieceById(id);

        const noMoves = { position, maxMoves: 0, startPos: position }
        const maxMovesDir = {
            northwest: (!white && isKing) || white ? {startPos: position, ...this.resolveMove(position, white, isKing, -1, 1)} : noMoves,
            northeast: (!white && isKing) || white ? {startPos: position, ...this.resolveMove(position, white, isKing, 1, 1)} : noMoves,
            southwest: (white && isKing) || !white ? {startPos: position, ...this.resolveMove(position, white, isKing, -1, -1)} : noMoves,
            southeast: (white && isKing) || !white ? {startPos: position, ...this.resolveMove(position, white, isKing, 1, -1)} : noMoves 
        }

        return maxMovesDir;
    }

    resolveFinalPosition(direction, moves, distance) {
        return {
            northwest: (d, m) => m['northwest'].startPos + (this.size * -1 * d) +  1 * d,
            northeast: (d, m) => m['northeast'].startPos + (this.size *  1 * d) +  1 * d,
            southwest: (d, m) => m['southwest'].startPos + (this.size * -1 * d) + -1 * d,
            southeast: (d, m) => m['southeast'].startPos + (this.size *  1 * d) + -1 * d,
        }[direction](distance, moves);
    }

    removePiece(id) {
        const maxPlayerPieces = this.size * 3 / 2;

        if (id < maxPlayerPieces) {
            this.pieces.white.splice(id, 1);
            this.pieces.white.forEach((p, i) => p.id = i);
        } else {
            this.pieces.black.splice(id - maxPlayerPieces, 1);
            this.pieces.black.forEach((p, i) => p.id = (i + maxPlayerPieces));
        }

    }

    move(id, direction, distance) {
        const move = this.getMoveOpts(id)[direction];
        const newPos = distance === move.maxMoves ? move.position : this.resolveFinalPosition(direction, moves, distance);
        const piece = this.getPieceById(id)
        const { isKing, white } = piece;


        piece.position = newPos;

        if (move.ate && move.maxMoves === distance) {
            this.removePiece(move.ate.id);
        }

        if (
            !isKing &&
            ((white && this.size - Math.floor(newPos / this.size) - 1 === 0) ||
            (!white && Math.floor(newPos / this.size) === 0))
        ) {
            piece.upgrade();
        }
    }
}