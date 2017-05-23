import { Game } from "./stages/Game.stage";

const Client = {};
Client.socket = io.connect("http://localhost:8082/");

Client.addPlayer = () => {
    Client.socket.emit("newPlayer");
};

Client.socket.on("newPlayerConnected", player => {
    console.log(`Player ${player.id} connected`);
    Game.renderNewPlayer(player.id, player.x, player.y);
});

Client.socket.on("playersRerender", players => {
    players.forEach(player => {
        Game.renderNewPlayer(player.id, player.x, player.y);
    });
});

Client.socket.on("remove", id => {
    Game.removePlayer(id);
});

Client.socket.on("receiveMove", data => {
    console.log("client got ", data);
    Game.move(data);
});

Client.move = data => {
    console.log("randomizing");
    Client.socket.emit("sendMove", data);
};

export default Client;
