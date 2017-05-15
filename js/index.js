import "pixi";
import "p2";
import Phaser from "phaser";

const game = new Phaser.Game(16*32, 600, Phaser.AUTO, document.getElementById('game'));
game.state.add('Game', Game);
game.state.start('Game');

const Game = {};
