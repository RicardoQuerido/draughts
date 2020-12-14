class Piece{
    id;
    position;
    white;
    model;
    isKing = false;

    constructor(id, position, white, model) {
        this.id = id;
        this.position = position;
        this.white = white;
        this.model = model;
    }

    upgrade() {
        this.isKing = true;
    }

    canReverse() {
        return this.isKing;
    }
}