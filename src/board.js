// управляет состоянием игры, включая позиции плиток и добавление новых плиток
// Ключевые методы:
// InitializeBoard(): Инициализирует доску двумя начальными плитками
// addTile(): добавляет новую плитку (2 или 4) в случайную пустую ячейку на доске
// getEmptyCells(): возвращает список пустых ячеек, в которые можно добавить новые плитки
// draw(ctx): очищает холст и рисует все плитки
// - методы движения плиток (вверх/вниз/влево/вправо) и их объединения в соответствии с правилами игры
// - Проверка окончания игры: checkGameOver(), чтобы определять, когда не осталось ходов =>
// это включает в себя проверку наличия пустых ячеек или возможности объединения соседних плиток.
// - Отслеживание очков: отслеживайте счет игрока и отображайте его на холсте

// - Проверка максим.значения в ячейках и использования функции gameOver(),
// чтобы отобразить выигрышный диалог, если максимальное значение достигает 2048,
// и проигрышный диалог, если ни одна ячейка НЕ пуста, а максимальное значение ячейки не достигло 2048

import Tile from './tiles.js';

export default class Board {
  constructor(size = 4) {
    this.size = size;
    this.tiles = [];
    this.board = this.createEmptyBoard();
    this.score = 0;
  }

  createEmptyBoard() {
    const board = [];
    for (let i = 0; i < this.size; i++) {
      board.push(new Array(this.size).fill(0));
    }
    return board;
  }

  initializeBoard() {
    this.tiles = [];
    this.board = this.createEmptyBoard();
    this.updateTiles();

    for (let i = 0; i < 2; i++) {
      this.addTile();
    }
  }

  addTile() {
    const emptyCells = this.getEmptyCells();
    if (emptyCells.length === 0) return;

    const randomCell =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const value = 2;
    this.tiles.push(new Tile(value, randomCell.x, randomCell.y));
    this.board[randomCell.y][randomCell.x] = value;
    this.updateTiles();
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
      let i = 0;

      while (i < nonZero.length) {
        if (i + 1 < nonZero.length && nonZero[i] === nonZero[i + 1]) {
          const combinedValue = nonZero[i] * 2;
          newRow.push(combinedValue);
          this.score += combinedValue;
          moved = true;
          i += 2;
        } else {
          newRow.push(nonZero[i]);
          i++;
        }
      }

      while (newRow.length < this.size) {
        newRow.push(0);
      }

      if (JSON.stringify(values) !== JSON.stringify(newRow)) {
        moved = true;
      }

      return newRow;
    };

    const processDirection = (isColumn) => {
      for (let i = 0; i < this.size; i++) {
        const line = isColumn
          ? [
              this.board[0][i],
              this.board[1][i],
              this.board[2][i],
              this.board[3][i],
            ]
          : this.board[i];
        const newLine = moveRowOrColumn(line, !isColumn);
        if (isColumn) {
          for (let j = 0; j < this.size; j++) {
            this.board[j][i] = newLine[j];
            this.updateTiles();
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

  getScore() {
    return this.score;
  }

  updateTiles() {
    this.tiles = this.board
      .flatMap((row, y) =>
        row.map((value, x) => (value !== 0 ? new Tile(value, x, y) : null))
      )
      .filter((tile) => tile !== null);
  }
}
