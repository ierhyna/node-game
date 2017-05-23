import game from "../game";
import Client from "../client";

let cursors;
let velocity = {
    x: 0,
    y: 0
};

export const Game = {
    preload: function() {
        game.load.image("sprite", "assets/sprites/invader.jpg");
    },
    create: function() {
        game.stage.disableVisibilityChange = true;
        Game.playerMap = {};
        Client.addPlayer();
        cursors = game.input.keyboard.createCursorKeys();
    },
    update: function() {
        velocity.x = 0;
        velocity.y = 0;

        if (cursors.up.isDown) {
            velocity.y = -4;
        }
        if (cursors.down.isDown) {
            velocity.y = 4;
        }
        if (cursors.left.isDown) {
            velocity.x = -4;
        }
        if (cursors.right.isDown) {
            velocity.x = 4;
        }
        (velocity.x || velocity.y) &&
        Client.move({
            x: velocity.x,
            y: velocity.y
        });
    },
    renderNewPlayer: function(id, x, y) {
        Game.playerMap[id] = game.add.sprite(x, y, "sprite");
        Game.playerMap[id].scale.setTo(0.5, 0.5);
        game.physics.arcade.enable(Game.playerMap[id]);
        Game.playerMap[id].body.collideWorldBounds = true;
    },
    removePlayer: function(id) {
        Game.playerMap[id].destroy();
        delete Game.playerMap[id];
    },
    move: function(data) {
        console.log("attempt to move ", data.id);
        Game.playerMap[data.id].y += data.y;
        Game.playerMap[data.id].x += data.x;
    }
};
