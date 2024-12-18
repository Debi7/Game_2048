import Tile from './tiles.js';

export const initialBoard = [
  [0, 2, 0, 0],
  [0, 0, 2, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const board = initialBoard.flat();

export default class Board {
  constructor() {
    this.tiles = [];
    this.board = board;
    this.initializeBoard();
  }

  initializeBoard() {
    for (let i = 0; i < 2; i++) {
      this.addTile();
    }
  }

  addTile() {
    const emptyCells = this.getEmptyCells();
    if (emptyCells.length === 0) return;

    const randomCell =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const value = Math.random() < 0.9 ? 2 : 4;
    this.tiles.push(new Tile(value, randomCell.x, randomCell.y));
    this.board[randomCell.y][randomCell.x] = value;
  }

  getEmptyCells() {
    const emptyCells = [];
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        if (this.board[y][x] === 0) {
          emptyCells.push({ x, y });
        }
      }
    }
    return emptyCells;
  }

  move(direction) {
    const moved = this.moveTiles(direction);
    if (moved) {
      this.addTile();
    }
  }

  moveTiles(direction) {
    let moved = false;

    const moveRowOrColumn = (values) => {
      const nonZero = values.filter((value) => value !== 0);
      const newRow = [];

      for (let i = 0; i < nonZero.length; i++) {
        if (nonZero[i] === nonZero[i + 1]) {
          newRow.push(nonZero[i] * 2);
          moved = true;
          i++;
        } else {
          newRow.push(nonZero[i]);
        }
      }

      while (newRow.length < 4) {
        newRow.push(0);
      }

      return newRow;
    };

    const processDirection = (isColumn) => {
      for (let i = 0; i < 4; i++) {
        const line = isColumn
          ? [
              this.board[0][i],
              this.board[1][i],
              this.board[2][i],
              this.board[3][i],
            ]
          : this.board[i];
        const newLine = moveRowOrColumn(line);
        if (JSON.stringify(line) !== JSON.stringify(newLine)) {
          moved = true;
        }
        if (isColumn) {
          for (let j = 0; j < 4; j++) {
            this.board[j][i] = newLine[j];
          }
        } else {
          this.board[i] = newLine;
        }
      }
    };

    if (direction === 'left' || direction === 'right') {
      processDirection(false);
    } else {
      processDirection(true);
    }

    this.updateTiles();

    return moved;
  }

  updateTiles() {
    this.tiles = this.board
      .flatMap((row, y) =>
        row.map((value, x) => (value !== 0 ? new Tile(value, x, y) : null))
      )
      .filter((tile) => tile !== null);
  }
}
