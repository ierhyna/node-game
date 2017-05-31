import game from "../game";
import Client from "../client";

let cursors;
let nameTag;
let velocity = {
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
        if (!Game.playerMap[Client.socket.id]) return;
        nameTag.x = Game.playerMap[Client.socket.id].x + Game.playerMap[Client.socket.id].width / 2;
        nameTag.y = Game.playerMap[Client.socket.id].y - 14;
        velocity.x = 0;
        velocity.y = 0;

        if (cursors.up.isDown) {
            velocity.y = -150;
        }
        if (cursors.down.isDown) {
            velocity.y = 150;
        }
        if (cursors.left.isDown) {
            velocity.x = -150;
        }
        if (cursors.right.isDown) {
            velocity.x = 150;
        }
        if (Game.playerMap[Client.socket.id]) {
            Game.playerMap[Client.socket.id].body.velocity.x = velocity.x;
            Game.playerMap[Client.socket.id].body.velocity.y = velocity.y;
        }

        Client.updatePositions({
            id: Client.socket.id,
            x: Game.playerMap[Client.socket.id].body.position.x,
            y: Game.playerMap[Client.socket.id].body.position.y
        })
    },
    renderNewPlayer: function (id, x, y) {
        Game.playerMap[id] = game.add.sprite(x, y, "sprite");
        const _p = Game.playerMap[id];
        _p.scale.setTo(0.25, 0.25);
        game.physics.arcade.enable(_p);
        _p.body.enable = true;
        _p.body.collideWorldBounds = true;
        if (!nameTag) {
            // we create name Tag only if it does not exist yet;
            nameTag = game.add.text(0, 0, (Client.socket.id).slice(0, 10), {
                font: "14px Arial",
                fill: "#fff",
                align: "center"
            });
            nameTag.anchor.setTo(0.5, 0.5);
        }
    },

    removePlayer: function (id) {
        Game.playerMap[id].destroy();
        delete Game.playerMap[id];
    },
    
    move: function (data) {
        Game.playerMap[data.id].y = data.y;
        Game.playerMap[data.id].x = data.x;
    }
};