import * as GameCanvas from './gameCanvas.js';
import * as Board from './Board.js';
import Tile from './tiles.js';

let count = 0;

export default class Game {
  constructor() {
    this.canvas = new GameCanvas(canvasElement);
    this.board = new Board();
    this.initialize();
    this.draw();
    this.bindEvents();
  }

  initialize() {
    this.board.initializeBoard();
  }

  draw() {
    this.canvas.drawBoard(this.board.tiles);
  }

  bindEvents() {
    document.addEventListener('keydown', (event) => {
      if (event.code === 'ArrowUp') {
        this.board.move('up');
      } else if (event.code === 'ArrowDown') {
        this.board.move('down');
      } else if (event.code === 'ArrowLeft') {
        this.board.move('left');
      } else if (event.code === 'ArrowRight') {
        this.board.move('right');
      }
      this.draw();
    });

    document.getElementById('restartButton').addEventListener('click', () => {
      this.initialize();
      this.draw();
    });
  }
}

window.onload = () => {
  new Game();
};

// export const initGame = new Game();
