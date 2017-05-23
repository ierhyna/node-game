import game from "../game";
import Client from "../client";

let cursors;

export const Game = {
    preload: function() {},
    create: function() {
        game.stage.disableVisibilityChange = true;
        Game.playerMap = {};
        Client.addPlayer();
        cursors = game.input.keyboard.createCursorKeys();
    },
    update: function() {
        if (cursors.up.isDown) {
            Client.move({x:0, y:4});
        }
        if (cursors.down.isDown) {
            Client.move({x:0, y:-4});
        }
        if (cursors.left.isDown) {
            Client.move({x:-4, y:0});
        }
        if (cursors.right.isDown) {
            Client.move({x:4, y:0});
        }
    },
    renderNewPlayer: function(id, x, y) {
        Game.playerMap[id] = game.add.sprite(x, y, 'sprite');
    },
    removePlayer: function(id) {
        Game.playerMap[id].destroy();
        delete Game.playerMap[id];
    },
    move: function(data) {
        console.log('attempt to move ', data.id);
        Game.playerMap[data.id].y += data.y;
        Game.playerMap[data.id].x += data.x;
    }
};
