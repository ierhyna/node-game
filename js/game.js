import 'pixi';
import 'p2';
import Phaser from 'phaser';
import Client from './client.js';

const game = new Phaser.Game(16*32, 600, Phaser.AUTO, document.getElementById('game'));
game.state.add('Game', Game);
game.state.start('Game');

const Game = {};

Game.init = () => {
  game.stage.disableVisibilityChange = true;
};

Game.create = () => {
  game.physics.enable(player, Phaser.Physics.ARCADE);
  Client.sendTest();
};

export default Game;
