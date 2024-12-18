import * as Board from './Board.js';
import { initialBoard } from './Board.js';

const canvasElement = document.getElementById('canvas');

export default class GameCanvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.tileSize = 100;
    this.canvas.width = this.tileSize * 4;
    this.canvas.height = this.tileSize * 4;
    this.board = new Board();
  }

  drawTile(tile) {
    const colors = {
      2: '#eee4da',
      4: '#ede0c8',
      8: '#f2b179',
      16: '#f59563',
      32: '#f67c5f',
      64: '#f67c5f',
      128: '#f9f86e',
      256: '#f9f86e',
      512: '#e7c86c',
      1024: '#e7c86c',
      2048: '#edc22e',
    };
    this.ctx.fillStyle = colors[tile.value] || '#cdc1b4';
    this.ctx.fillRect(
      tile.x * this.tileSize,
      tile.y * this.tileSize,
      this.tileSize,
      this.tileSize
    );
    this.ctx.fillStyle = '#776e65';
    this.ctx.font = 'bold 45px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(
      tile.value,
      tile.x * this.tileSize + this.tileSize / 2,
      tile.y * this.tileSize + this.tileSize / 2
    );
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawBoard(tiles) {
    this.clear();
    tiles.forEach((tile) => {
      if (tile) {
        this.drawTile(tile);
      }
    });
  }
}

const gameCanvas = new GameCanvas(canvasElement);
gameCanvas.drawBoard(initialBoard);
