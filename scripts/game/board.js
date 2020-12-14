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
            for (var i = 0; i < s; i++) {
                if (w) {
                    set.push(new Piece(i, i, true, PIECE_MODEL), new Piece(s + i, i + s, true, PIECE_MODEL));
                } else {
                    set.push(new Piece(s * 2 + i, s * (s-2) + i, false, PIECE_MODEL), new Piece(s * 3 + i, s * (s-1) + i, false, PIECE_MODEL));
                }
            }
            return set;
        }

        this.pieces.white = generate(size, true);
        this.pieces.black = generate(size, false)
    }

    getPieceById(id) {
        if (id < this.size * 2 ) {
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

        const noMoves = { position, maxMoves: 0 }
        const maxMovesDir = {
            northwest: (!white && isKing) || white ? this.resolveMove(position, white, isKing, -1, 1) : noMoves,
            northeast: (!white && isKing) || white ? this.resolveMove(position, white, isKing, 1, 1) : noMoves,
            southwest: (white && isKing) || !white ? this.resolveMove(position, white, isKing, -1, -1) : noMoves,
            southeast: (white && isKing) || !white ? this.resolveMove(position, white, isKing, 1, -1) : noMoves 
        }

        return maxMovesDir;
    }

    move(id, opt) {
        return null;
    }
}