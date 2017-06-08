import game from "../game";
import Client from "../client";

let name, id;
let cursors;
let throttle = 0;
let velocity = {
    x: 0,
    y: 0,
    oldx: 0,
    oldy: 0
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
        Game.bgLayer = Game.tileMap.createLayer("background");
        Game.blockersLayer = Game.tileMap.createLayer("blockers");
        Game.tileMap.setCollisionBetween(1, 100000, true, "blockers");

        Client.addPlayer();
        cursors = game.input.keyboard.createCursorKeys();
        console.log('Create: ')
        console.log(Game.playerMap)
    },

    update: function () {
        if (Client.socket.id && Game.playerMap[Client.socket.id]) {

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

            if (!(cursors.up.isDown || cursors.down.isDown || cursors.left.isDown || cursors.right.isDown)) {
                velocity.x = 0;
                velocity.y = 0;
            }
            if (throttle === 3 && Game.playerMap[Client.socket.id]) {
                try {
                    if (velocity.oldx !== velocity.x || velocity.oldy !== velocity.y) {
                        velocity.oldx = velocity.x;
                        velocity.oldy = velocity.y;
                        Client.updatePositions({
                            id: Client.socket.id,
                            x: Game.playerMap[Client.socket.id].body.position.x,
                            y: Game.playerMap[Client.socket.id].body.position.y,
                            velocityX: velocity.x,
                            velocityY: velocity.y,
                        })
                    }
                } catch (e) {
                    console.log("error with " + Client.socket.id)
                }
                throttle = 0;
            }
            this.updateTags();
        }
    },

    renderNewPlayer: function (player) {
        console.log("Creating new player: " + player.id)
        Game.playerMap[player.id] = game.add.sprite(player.x, player.y, "sprite");
        const NEW_PLAYER = Game.playerMap[player.id];
        NEW_PLAYER.scale.setTo(0.25, 0.25);
        game.physics.arcade.enable(NEW_PLAYER);
        NEW_PLAYER.body.enable = true;
        NEW_PLAYER.name = player.name;
        NEW_PLAYER.body.collideWorldBounds = true;
        // we create name Tag only if it does not exist yet;
        NEW_PLAYER.nameTag = game.add.text(0, 0, player.name, {
            font: "14px Arial",
            fill: "#fff",
            align: "center"
        });
        NEW_PLAYER.nameTag.anchor.setTo(0.5, 0.5);
        console.log("added name tag " + player.name)
    },

    removePlayer: function (id) {
        console.log(`Removing ${id} from the game`);
        Game.playerMap[id].nameTag.destroy(); // nameTag should be destroyed on its own
        Game.playerMap[id].destroy();
        delete Game.playerMap[id];
    },

    move: function (data) {
        if (!(Game && Game.playerMap && Game.playerMap[data.id])) {
            console.log(`Attempted to move ${data.id} but player is not ready yet. Rejecting`);
            return
        };
        const PLAYER = Game.playerMap[data.id]
        PLAYER.body.velocity.x = data.velocityX;
        PLAYER.body.velocity.y = data.velocityY;

    },
    updateTags: function () {
        Object.keys(Game.playerMap).forEach(id => {
            Game.playerMap[id].nameTag.y = Game.playerMap[id].y - 14;
            Game.playerMap[id].nameTag.x = Game.playerMap[id].body.x + Game.playerMap[id].body.width / 2;
        });
    }
};
