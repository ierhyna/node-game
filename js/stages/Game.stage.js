import game from "../game";
import Client from "../client";

export const Game = {
    preload: function() {},
    create: function() {
      game.stage.disableVisibilityChange = true;
      //game.physics.enable(player, Phaser.Physics.ARCADE);
      Game.playerMap = {};
      Client.addPlayer();
    },
    update: function() {},
    renderNewPlayer: function (id, x, y) {
      Game.playerMap[id] = game.add.sprite(x, y, 'sprite');
    },
    removePlayer: function(id) {
      Game.playerMap[id].destroy();
      delete Game.playerMap[id];
    },
};
