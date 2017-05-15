import 'pixi';
import 'p2';
import Phaser from 'phaser';
import Client from './client.js';

const Game = {
  preload: function() {},
  create: function() {
    game.stage.disableVisibilityChange = true;
    // game.physics.enable(player, Phaser.Physics.ARCADE);
    Client.sendTest();
    console.log("ran")
  },
  update: function() {}
};

const game = new Phaser.Game(16*32, 600, Phaser.AUTO, document.getElementById('game'));
game.state.add('Game', Game);
game.state.start('Game');

export default Game;
