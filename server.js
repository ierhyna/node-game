const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const server = require("http").Server(app);
const io = require("socket.io")(server);
const mongoose = require("mongoose");
const MONGODB_URI = process.env.MONGODB_URI || require("./db.local");
const PORT = process.env.PORT || 3000;

const session = require('./config/session');
const cookieParser = require('cookie-parser');

const isLogged = require("./middleware/auth");
const routeRegister = require("./routes/register");
const routeLogin = require("./routes/login");
const routeLogout = require("./routes/logout");

const Users = require('./models/userModel');
mongoose.Promise = global.Promise;
mongoose.connect(MONGODB_URI);
mongoose.connection.on('error', console.error.bind(console, 'DB connection error:'));
mongoose.connection.once('open', () => {
    console.info('Got DB connection');
});

app.use(cookieParser());
app.use(session());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use("/css", express.static(__dirname + "/css"));
app.use("/dist", express.static(__dirname + "/dist"));
app.use("/assets", express.static(__dirname + "/assets"));

app.get("/", isLogged, (req, res) => {
    name = req.session.username;
    res.sendFile(__dirname + "/index.html")
});

app.use("/register", routeRegister);
app.use("/login", routeLogin);
app.use("/logout", routeLogout);

server.listen(PORT, () => console.log("Listening on " + server.address().port));

let playerMap = {};

io.on("connection", socket => {
    socket.on("newPlayer", () => {
        const player = {
            id: socket.id,
            name: name,
            x: 128,
            y: 128
        }
        socket.player = player;
        createPlayerList();
        console.log("Current players list: ", playerMap);
        socket.emit("playersRerender", playerMap);
        socket.broadcast.emit("newPlayerConnected", player);
        socket.on("disconnect", () => {
            delete playerMap[socket.id];
            io.emit("remove", player.id)
            console.log("player " + player.id + " has gone offline");
        });
    });

    socket.on("updatePositions", data => {
        if (!socket.player) return
        socket.player.x = data.x;
        socket.player.y = data.y;
        playerMap = Object.assign(playerMap, {
            [socket.id]: socket.player
        });
        io.emit("renderMove", {
            id: data.id,
            velocityX: data.velocityX,
            velocityY: data.velocityY
        });
    });
});

function createPlayerList() {
    Object.keys(io.sockets.connected).forEach(id => {
        if (io.sockets.connected[id].player) playerMap[id] = io.sockets.connected[id].player;
    });
}