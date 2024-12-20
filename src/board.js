import Game from './game';
import Tile from './tiles.js';

export default class Board {
  constructor(size = 4, canvasElement) {
    this.size = size;
    this.tiles = [];
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.gameInitialized = false;
    this.canvasElement = canvasElement;
  }

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  initializeBoard() {
    this.tiles = [];
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.updateTiles();

    for (let i = 0; i < 2; i++) {
      this.addTileWithValue(2);
    }

    this.gameInitialized = true;
  }

  addTileWithValue(value) {
    const emptyCells = this.getEmptyCells();
    if (emptyCells.length === 0) return;

    const randomCell =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    this.tiles.push(new Tile(value, randomCell.x, randomCell.y));
    this.board[randomCell.y][randomCell.x] = value;
    this.updateTiles();
  }

  addTile() {
    let value;
    if (!this.gameInitialized) {
      value = 2;
    } else {
      value = Math.random() < 0.9 ? 2 : 4;
    }
    this.addTileWithValue(value);
  }

  getEmptyCells() {
    const emptyCells = [];
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        if (this.board[y][x] === 0) {
          emptyCells.push({ x, y });
        }
      }
    }
    return emptyCells;
  }

  move(direction) {
    const initialScore = this.score;
    const moved = this.moveTiles(direction);

    if (moved) {
      this.addTile();
    }

    setTimeout(() => {
      if (this.checkWin()) {
        alert('Уровень пройден');
        new Game(this.canvasElement);
      } else if (this.checkGameOver()) {
        alert('Нельзя сделать ход');
        new Game(this.canvasElement);
      }
    }, 0);

    return this.score > initialScore;
  }

  moveTiles(direction) {
    let moved = false;

    const moveRowOrColumn = (values) => {
      const nonZero = values.filter((value) => value !== 0);
      const newRow = [];
      let i = 0;

      while (i < nonZero.length) {
        if (i + 1 < nonZero.length && nonZero[i] === nonZero[i + 1]) {
          const combinedValue = nonZero[i] * 2;
          newRow.push(combinedValue);
          this.score += combinedValue;
          i += 2;
          moved = true;
        } else {
          newRow.push(nonZero[i]);
          i++;
        }
      }

      while (newRow.length < this.size) {
        newRow.push(0);
      }

      return newRow;
    };

    const rotateClockwise = (matrix) =>
      matrix[0].map((_, colIndex) =>
        matrix.map((row) => row[colIndex]).reverse()
      );

    const rotateCounterClockwise = (matrix) =>
      matrix[0]
        .map((_, colIndex) => matrix.map((row) => row[colIndex]))
        .reverse();

    if (direction === 'up') {
      this.board = rotateClockwise(this.board);
    } else if (direction === 'down') {
      this.board = rotateCounterClockwise(this.board);
    } else if (direction === 'right') {
      this.board = this.board.map((row) => row.reverse());
    }

    for (let i = 0; i < this.size; i++) {
      const newRow = moveRowOrColumn(this.board[i]);
      if (JSON.stringify(this.board[i]) !== JSON.stringify(newRow)) {
        moved = true;
      }
      this.board[i] = newRow;
    }

    if (direction === 'up') {
      this.board = rotateCounterClockwise(this.board);
    } else if (direction === 'down') {
      this.board = rotateClockwise(this.board);
    } else if (direction === 'right') {
      this.board = this.board.map((row) => row.reverse());
    }

    this.updateTiles();
    return moved;
  }

  checkWin() {
    return this.board.flat().includes(2048);
  }

  checkGameOver() {
    if (this.getEmptyCells().length > 0) return false;

    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        const currentValue = this.board[y][x];
        if (
          (x + 1 < this.size && currentValue === this.board[y][x + 1]) ||
          (y + 1 < this.size && currentValue === this.board[y + 1][x])
        ) {
          return false;
        }
      }
    }
    return true;
  }

  updateTiles() {
    this.tiles = this.board
      .flatMap((row, y) =>
        row.map((value, x) => (value !== 0 ? new Tile(value, x, y) : null))
      )
      .filter((tile) => tile !== null);
  }

  getScore() {
    return this.score;
  }
}
