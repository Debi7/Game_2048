import GameCanvas from './gameCanvas.js';
import Board from './board.js';

export default class Game {
  constructor(canvasElement) {
    this.canvas = new GameCanvas(canvasElement);
    this.board = new Board(4, canvasElement);

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
    this.board.move(direction);
    this.draw();
  }
}
