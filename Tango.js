class Tango {
    constructor() {
        console.log('Hello World!');
        this.board = Array(6).fill().map(() => Array(6).fill(0));
        this.fillBoardRandomly(this.board);
        console.log('fillBoardRandomly');
        console.log(this.board);
        this.addRandomRestrictions();
        console.log('addRandomRestrictions');
        this.printBoard();
        console.log('printBoard');
        this.removeDeductibles();
        console.log('removeDeductibles');
        this.printBoard();
    }

    fillBoardRandomly(board) {
        let success = false
        for (let r = 0; r < 6; r++) {
            for (let c = 0; c < 6; c++) {
                if (board[r][c] != 0) continue;
                let value = Math.round(Math.random());
                if (this.isValidPlacement(board, 1+value, r, c)) {
                    board[r][c] = 1+value;
                    success = this.fillBoardRandomly(board);
                    if (!success) board[r][c] = 0;
                }
                if (!success && this.isValidPlacement(board, 2-value, r, c)) {
                    board[r][c] = 2-value;
                    success = this.fillBoardRandomly(board);
                    if (!success) board[r][c] = 0;
                }
                return success;
            }
        }
        return true;
    }

    cloneBoard(board) {
        const clonedBoard = Array(board.length);
        for (let i = 0; i < board.length; i++) {
            clonedBoard[i] = board[i].slice();
        }
        return clonedBoard;
    }

    addRandomRestrictions(resQty = Math.floor(Math.random() * 10)) {
        const hRes = Array(6).fill().map(() => Array(5).fill());
        const vRes = Array(5).fill().map(() => Array(6).fill());
        for (let i = 0; i < resQty; i++) {
            let r = Math.floor(Math.random() * 5);
            let c = Math.floor(Math.random() * 5);
            console.log(r, c);
            let orientation = Math.random() > 0.5 ? hRes : vRes;
            console.log("restriction")
            console.log(orientation);
            console.log(orientation === hRes, orientation === vRes);
            console.log(this.board);
            console.log(r,c)
            console.log(this.board[r])
            let x = (orientation === hRes ? (this.board[r][c+1]) : (this.board[r+1][c]));
            if (this.board[r][c] == x) {
                orientation[r][c] = '=';
            } else {
                orientation[r][c] = 'x';
            };
        }
        this.horizontalRestrictions = hRes;
        this.verticalRestrictions = vRes;
    }

    removeDeductibles() {
        const cells = [];
        for (let r = 0; r < 6; r++) {
            for (let c = 0; c < 6; c++) {
                cells.push({r, c}); 
            }
        }
        let shuffled = cells
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value)
        for (let i = 0; i < shuffled.length; i++) {
            if (this.isDeductible(shuffled[i].r, shuffled[i].c)) {
                this.board[shuffled[i].r][shuffled[i].c] = 0;
            }
        }
    } 

    isValidPlacement(board, cell, r, c) {
        // First of 3 in a row
        if (c < 3 && board[r][c + 1] === cell && board[r][c + 2] === cell) return false;
        // Second of 3 in a row
        if (c > 0 && c < 5 && board[r][c - 1] === cell && board[r][c + 1] === cell) return false;
        // Third of 3 in a row
        if (c > 1 && board[r][c - 2] === cell && board[r][c - 1] === cell) return false;
        // First of 3 in a column
        if (r < 3 && board[r + 1][c] === cell && board[r + 2][c] === cell) return false;
        // Second of 3 in a column
        if (r > 0 && r < 5 && board[r - 1][c] === cell && board[r + 1][c] === cell) return false;
        // Third of 3 in a column
        if (r > 1 && board[r - 2][c] === cell && board[r - 1][c] === cell) return false;
        // Already 3 in that row
        if (board[r].filter(x => x == cell).length == 3) return false;
        // Already 3 in that column
        if (board.filter(x => x[c] == cell).length == 3) return false;
        return true;
    }

    isDeductible(r,c) {
        let value = this.board[r][c];
        let oposing = value == 1 ? 2 : 1;
        // Oposing can not be placed there
        if (!this.isValidPlacement(this.board, oposing, r, c)) return true;
        // Restriction bottom
        if (r < 5 && this.verticalRestrictions[r][c] != null && this.board[r+1][c] > 0) return true;
        // Restriction top
        if (r > 0 && this.verticalRestrictions[r-1][c] != null && this.board[r-1][c] > 0) return true;
        // Restriction right
        if (c < 5 && this.horizontalRestrictions[r][c] != null && this.board[r][c+1] > 0) return true;
        // Restriction left
        if (c > 0 && this.horizontalRestrictions[r][c-1] != null && this.board[r][c-1] > 0) return true;
        return false;
        //TODO Oposing forces 3 in a row

        //TODO Oposing forces 3 in a column

    }

    printBoard() {
        for (let i = 0; i < this.board.length; i++) {
            let str = '';
            for (let j = 0; j < this.board[i].length; j++) {
                str += this.board[i][j];
                if (j < this.board[i].length - 1)
                    str += this.horizontalRestrictions[i][j] ? this.horizontalRestrictions[i][j] : '|';
            }
            console.log(str);
            str = '';
            if (i < this.board.length - 1)
                for (let j = 0; j < this.board[i].length; j++) {
                    str += this.verticalRestrictions[i][j] ? this.verticalRestrictions[i][j] : '-';
                    if (j < this.board[i].length - 1)
                        str += '+';
                }
            console.log(str);
        }
    }
}

