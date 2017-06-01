import game from "../game";
import Client from "../client";

let cursors;
let throttle = 0;
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
        throttle++;
        if (throttle === 3) {
            Client.updatePositions({
                id: Client.socket.id,
                x: Game.playerMap[Client.socket.id].body.position.x,
                y: Game.playerMap[Client.socket.id].body.position.y,
                velocityX: velocity.x,
                velocityY: velocity.y,
            })
            throttle = 0;
        }
        if (!(cursors.up.isDown || cursors.down.isDown || cursors.left.isDown || cursors.right.isDown)) {
            velocity.x = 0;
            velocity.y = 0;
        }
    },

    renderNewPlayer: function (id, x, y, name) {
        Game.playerMap[id] = game.add.sprite(x, y, "sprite");
        const _p = Game.playerMap[id];
        _p.scale.setTo(0.25, 0.25);
        game.physics.arcade.enable(_p);
        _p.body.enable = true;
        _p.body.collideWorldBounds = true;
        if (!_p.nameTag) {
            // we create name Tag only if it does not exist yet;
            _p.nameTag = game.add.text(0, 0, name, {
                font: "14px Arial",
                fill: "#fff",
                align: "center"
            });
            _p.nameTag.anchor.setTo(0.5, 0.5);
            console.log("added name tag " + name)
        }
    },

    removePlayer: function (id) {
        Game.playerMap[id].nameTag.destroy(); // nameTag should be destroyed on its own
        Game.playerMap[id].destroy();
        delete Game.playerMap[id];
    },

    move: function (data) {
        Game.playerMap[data.id].body.velocity.x = data.velocityX;
        Game.playerMap[data.id].body.velocity.y = data.velocityY;
        data.playerList.forEach(id => {
            Game.playerMap[id].nameTag.x = Game.playerMap[id].x + Game.playerMap[id].width / 2;
            Game.playerMap[id].nameTag.y = Game.playerMap[id].y - 14;
        })

    }
};