import GameCanvas from './gameCanvas.js';
import Board from './board.js';

export default class Game {
  constructor(canvasElement) {
    this.board = new Board(4);
    this.canvas = new GameCanvas(canvasElement);
    this.canvas.board = this.board;

    this.initialize();
    this.draw();

    this.canvas.onMove = this.handleMove.bind(this);
  }

  initialize() {
    this.board.initializeBoard();
  }

  draw() {
    this.canvas.drawBoard(this.board.tiles);
  }

  handleMove(direction) {
    const moved = this.board.move(direction);

    if (moved) {
      this.draw();
      this.canvas.updateScore(this.board.getScore());
    }

    if (this.board.checkWin()) {
      this.canvas.resetGame();
      alert('Уровень пройден');
    } else if (this.board.checkGameOver()) {
      this.canvas.resetGame();
      alert('Нельзя сделать ход');
    }
  }
}
