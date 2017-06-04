import {
    Game
} from "./stages/Game.stage";

const Client = {};
Client.socket = io.connect("/");

Client.addPlayer = () => Client.socket.emit("newPlayer");

Client.socket.on("newPlayerConnected", player => Game.renderNewPlayer(player));
Client.socket.on("playersRerender", players => {
    Object.keys(players).forEach(key => {
        Game.renderNewPlayer(players[key]);
    });
});

Client.socket.on("remove", id => Game.removePlayer(id));
Client.socket.on("renderMove", data => {
    Game.move(data);
});

Client.updatePositions = data => {
    Client.socket.emit("updatePositions", data)
};

export default Client;
