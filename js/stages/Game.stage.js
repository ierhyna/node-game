import game from "../game";
import Client from "../client";

let cursors;
let previousPosition = {};
let position = {
    x: 0,
    y: 0
};

export const Game = {
    preload: function () {
        game.load.tilemap(
            "room",
            "assets/maps/tiles.json",
            null,
            Phaser.Tilemap.TILED_JSON
        );
        game.load.image("tileset", "assets/maps/tilea2.png");
        game.load.image("sprite", "assets/sprites/char.gif");
    },
    create: function () {
        game.stage.disableVisibilityChange = true;
        Game.playerMap = {};
        Game.tileMap = game.add.tilemap("room");
        Game.tileMap.addTilesetImage("tilea2", "tileset");
        Game.bgLayer = Game.tileMap.createLayer("layer_0");

        Client.addPlayer();
        cursors = game.input.keyboard.createCursorKeys();
    },
    update: function () {
        position.x = 0;
        position.y = 0;


        if (cursors.up.isDown) {
            position.y = -4;
        }
        if (cursors.down.isDown) {
            position.y = 4;
        }
        if (cursors.left.isDown) {
            position.x = -4;
        }
        if (cursors.right.isDown) {
            position.x = 4;
        }


        Client.updatePositions({
            id: Client.socket.id,
            x: position.x,
            y: position.y
        })


    },
    renderNewPlayer: function (id, x, y) {
        Game.playerMap[id] = game.add.sprite(x, y, "sprite");
        Game.playerMap[id].scale.setTo(0.25, 0.25);
        game.physics.arcade.enable(Game.playerMap[id]);
        Game.playerMap[id].body.enable = true;
        Game.playerMap[id].body.collideWorldBounds = true;
    },
    removePlayer: function (id) {
        Game.playerMap[id].destroy();
        delete Game.playerMap[id];
    },
    move: function (data) {
        console.log(data)
        Game.playerMap[data.id].y += data.y;
        Game.playerMap[data.id].x += data.x;
    }
};