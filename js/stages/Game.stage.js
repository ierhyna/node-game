import game from "../game";
import Client from "../client";

export const Game = {
    preload: function() {},
    create: function() {
        game.stage.disableVisibilityChange = true;
        //game.physics.enable(player, Phaser.Physics.ARCADE);
        Client.sendTest();
        console.log("ran");
    },
    update: function() {}
};
