import './styles/main.css';
import Game from './game.js';

const canvasElement = document.getElementById('canvas');
window.onload = () => {
  new Game(canvasElement);
};
