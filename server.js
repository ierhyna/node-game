const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const mongoose = require("mongoose");
const MONGODB_URI = process.env.MONGODB_URI || require("./db.local");
const PORT = process.env.PORT || 3000;

mongoose.Promise = global.Promise;
mongoose.connect(MONGODB_URI);
mongoose.connection.on('error', console.error.bind(console, 'DB connection error:'));
mongoose.connection.once('open', () => {
    console.info('Got DB connection');
});

app.use("/css", express.static(__dirname + "/css"));
app.use("/dist", express.static(__dirname + "/dist"));
app.use("/assets", express.static(__dirname + "/assets"));

app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));

server.listen(PORT, () => console.log("Listening on " + server.address().port));

io.on("connection", socket => {
    socket.on("newPlayer", () => {
        socket.player = {
            id: socket.id,
            x: 128,
            y: 128
        };

        socket.emit("playersRerender", getAllPlayers());
        socket.broadcast.emit("newPlayerConnected", socket.player);
        socket.on("disconnect", () => io.emit("remove", socket.player.id));
    });

    socket.on("updatePositions", data => {
        socket.player.x = data.x;
        socket.player.y = data.y;
        io.emit("renderMove", {
            id: data.id,
            x: data.x,
            y: data.y
        });
    });
});

function getAllPlayers() {
    const players = [];
    Object.keys(io.sockets.connected).forEach(socketID => {
        const player = io.sockets.connected[socketID].player;
        player && players.push(player);
    });
    return players;
}
