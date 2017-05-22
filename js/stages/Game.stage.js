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
    addNewPlayer: function (id, x, y) {
        game.playerMap[id] = game.add.sprite(x, y, 'sprite');
   }
};
