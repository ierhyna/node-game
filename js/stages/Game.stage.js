import game from "../game";
import Client from "../client";

let name, id;
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
        if (!Client.socket.id) return;

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
    },

    renderNewPlayer: function (player) {
        console.log("Creating new player: "+ player.id)           
        Game.playerMap[player.id] = game.add.sprite(player.x, player.y, "sprite");
        const _p = Game.playerMap[player.id];
        _p.scale.setTo(0.25, 0.25);
        game.physics.arcade.enable(_p);
        _p.body.enable = true;
        _p.name = player.name;        
        _p.body.collideWorldBounds = true;        
        // if (!_p.nameTag) {
        //     // we create name Tag only if it does not exist yet;
        //     _p.nameTag = game.add.text(0, 0, name, {
        //         font: "14px Arial",
        //         fill: "#fff",
        //         align: "center"
        //     });
        //     _p.nameTag.anchor.setTo(0.5, 0.5);
        //     console.log("added name tag " + name)
        // }
    },
        
    removePlayer: function (id) {
       // Game.playerMap[id].nameTag.destroy(); // nameTag should be destroyed on its own
       console.log("trying to remove" + id)
       console.log("and we have ", Game.playerMap)
        Game.playerMap[id].destroy();
        delete Game.playerMap[id];
    },

    move: function (data) {        
        if(!Game.playerMap[data.id]) return;
        console.log("trying to move " +data.id)
        Game.playerMap[data.id].body.velocity.x = data.velocityX;
        Game.playerMap[data.id].body.velocity.y = data.velocityY;
        // data.players.forEach(id => {
        //     if(id.name !== "undefined") {
        //     Game.playerMap[id.name].nameTag.x = Game.playerMap[id].x + Game.playerMap[id].width / 2;
        //     Game.playerMap[id.name].nameTag.y = Game.playerMap[id].y - 14;
        //     }
        // })

    }
};