import {
    Game
} from "./stages/Game.stage";

const Client = {};
Client.socket = io.connect("/");

Client.addPlayer = () => Client.socket.emit("newPlayer");

Client.socket.on("newPlayerConnected", player => Game.renderNewPlayer(player, self));
Client.socket.on("playersRerender", players => {
    players.forEach(player => {
        Game.renderNewPlayer(player);
        console.log("creating ", player.id)
    })

});
Client.socket.on("remove", id => Game.removePlayer(id));
Client.socket.on("renderMove", data => {
  Game.move(data)
});

Client.updatePositions = data => {
    Client.socket.emit("updatePositions", data)
};

export default Client;
