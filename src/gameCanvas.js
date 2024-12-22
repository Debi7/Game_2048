import Board from './board.js';

const canvasElement = document.getElementById('canvas');

export default class GameCanvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.board = new Board();

    this.isMoving = false;

    this.tileMargin = 10;
    this.canvas.width = 450;
    this.canvas.height = 450;

    this.boardSize = 4;
    this.tileSize =
      (this.canvas.width - (this.boardSize + 1) * this.tileMargin) /
      this.boardSize;

    this.canvas.width =
      this.tileSize * this.boardSize + (this.boardSize + 1) * this.tileMargin;
    this.canvas.height =
      this.tileSize * this.boardSize + (this.boardSize + 1) * this.tileMargin;

    this.startX = 0;
    this.startY = 0;
    this.endX = 0;
    this.endY = 0;

    this.board.initializeBoard();
    this.drawBoard(this.board.tiles);

    this.addEventListeners();
  }

  addEventListeners() {
    this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
    this.canvas.addEventListener('touchstart', this.onTouchStart.bind(this));
    this.canvas.addEventListener('touchend', this.onTouchEnd.bind(this));
  }

  onMouseDown(event) {
    this.startX = event.clientX;
    this.startY = event.clientY;
  }

  onMouseUp(event) {
    this.endX = event.clientX;
    this.endY = event.clientY;
    this.handleMove();
  }

  onTouchStart(event) {
    const touch = event.touches[0];
    this.startX = touch.clientX;
    this.startY = touch.clientY;
  }

  onTouchEnd(event) {
    const touch = event.changedTouches[0];
    this.endX = touch.clientX;
    this.endY = touch.clientY;
    this.handleMove();
  }

  handleMove() {
    const deltaX = this.endX - this.startX;
    const deltaY = this.endY - this.startY;

    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    const minDistance = 50;

    if (absDeltaX < minDistance && absDeltaY < minDistance) {
      return;
    }

    if (absDeltaX > absDeltaY) {
      this.onMove(deltaX > 0 ? 'right' : 'left');
    } else {
      this.onMove(deltaY > 0 ? 'down' : 'up');
    }
  }

  onMove(direction) {
    if (this.isMoving) return;

    this.isMoving = true;
    const moved = this.board.move(direction);

    if (moved) {
      this.drawBoard(this.board.tiles);
      this.updateScore(this.board.getScore());

      setTimeout(() => {
        this.isMoving = false;
      }, 100);
    } else {
      this.isMoving = false;
    }
  }

  drawTile(tile) {
    const colors = {
      2: '#eee4da',
      4: '#ede0c8',
      8: '#f2b179',
      16: '#f59563',
      32: '#f67c5f',
      64: '#f65e3b',
      128: '#edcf72',
      256: '#edcc61',
      512: '#edc850',
      1024: '#edc53f',
      2048: '#edc22e',
    };

    const tileColor = colors[tile.value] || '#cdc1b4';
    const textColor = tile.value <= 4 ? '#776e65' : '#f9f6f2';

    const x = tile.x * (this.tileSize + this.tileMargin) + this.tileMargin;
    const y = tile.y * (this.tileSize + this.tileMargin) + this.tileMargin;

    this.ctx.fillStyle = tileColor;
    this.ctx.beginPath();
    this.ctx.moveTo(x + 20, y);
    this.ctx.arcTo(
      x + this.tileSize,
      y,
      x + this.tileSize,
      y + this.tileSize,
      20
    );
    this.ctx.arcTo(
      x + this.tileSize,
      y + this.tileSize,
      x,
      y + this.tileSize,
      20
    );
    this.ctx.arcTo(x, y + this.tileSize, x, y, 20);
    this.ctx.arcTo(x, y, x + this.tileSize, y, 20);
    this.ctx.closePath();
    this.ctx.fill();

    if (tile.value) {
      this.ctx.fillStyle = textColor;
      this.ctx.font = 'bold 45px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(
        tile.value,
        x + this.tileSize / 2,
        y + this.tileSize / 2
      );
    }
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawBoard(tiles) {
    this.clear();
    this.ctx.fillStyle = '#dad3cb';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    tiles.forEach((tile) => {
      if (tile) {
        this.drawTile(tile);
      }
    });
  }

  updateScore(score) {
    const scoreElement = document.getElementById('score');

    if (scoreElement) {
      scoreElement.textContent = score;
    }
  }

  resetGame() {
    this.board.initializeBoard();
    this.drawBoard(this.board.tiles);
    this.updateScore(0);
  }
}

const gameCanvas = new GameCanvas(canvasElement);
gameCanvas.drawBoard(gameCanvas.board.tiles);
