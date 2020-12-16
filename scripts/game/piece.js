class Piece{
    id;
    position;
    white;
    model;
    isKing = false;

    setId(id) {
        this.id = id;
    }

    constructor(id, position, white, model) {
        this.id = id;
        this.position = position;
        this.white = white;
        this.model = model;
    }

    upgrade() {
        this.model.sy = 0.04;
        this.isKing = true;
    }

    canReverse() {
        return this.isKing;
    }
}