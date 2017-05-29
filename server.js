const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const PORT = process.env.PORT || 3000;

app.use("/css", express.static(__dirname + "/css"));
app.use("/dist", express.static(__dirname + "/dist"));
app.use("/assets", express.static(__dirname + "/assets"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

server.listen(PORT, () => {
    console.log("Listening on " + server.address().port);
});

io.on("connection", socket => {
    socket.on("newPlayer", () => {
        socket.player = {
            id: socket.id,
            x: 128,
            y: 128
        };

        socket.emit("playersRerender", getAllPlayers());
        socket.broadcast.emit("newPlayerConnected", socket.player);

        socket.on("disconnect", () => {
            io.emit("remove", socket.player.id);
        });
    });

    socket.on("sendMove", data => {
        io.emit("receiveMove", { id: socket.player.id, x: data.x, y: data.y });
    });

    socket.on("updatePositions", data => {
        io.emit("renderMove", { id: socket.player.id, x: data.x, y: data.y });
    });
});

function hashBuild() {
    return String(Math.random()).slice(2, 6);
}

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

function getAllPlayers() {
    const players = [];
    Object.keys(io.sockets.connected).forEach(socketID => {
        const player = io.sockets.connected[socketID].player;
        if (player) players.push(player);
    });
    console.log(players);
    return players;
}
