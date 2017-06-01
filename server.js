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
let name;

mongoose.Promise = global.Promise;
mongoose.connect(MONGODB_URI);
mongoose.connection.on('error', console.error.bind(console, 'DB connection error:'));
mongoose.connection.once('open', () => {
    console.info('Got DB connection');
});

app.use(cookieParser());
app.use(session());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/css", express.static(__dirname + "/css"));
app.use("/dist", express.static(__dirname + "/dist"));
app.use("/assets", express.static(__dirname + "/assets"));

app.get("/", isLogged, (req, res) => {
    name = req.session.username;
    res.sendFile(__dirname + "/index.html")});

app.use("/register", routeRegister);
app.use("/login", routeLogin);
app.use("/logout", routeLogout);

server.listen(PORT, () => console.log("Listening on " + server.address().port));
const playerList = [];
io.on("connection", socket => {
    socket.on("newPlayer", () => {
        playerList.push(socket.id);
        socket.player = {
            id: socket.id,
            x: 128,
            y: 128,
            name
        };

        socket.emit("playersRerender", getAllPlayers());
        socket.broadcast.emit("newPlayerConnected", socket.player);
        socket.on("disconnect", () => {
            console.log("removing player ", socket.id);
            playerList.splice(playerList.indexOf(socket.id), 1); // remove player from the list wiping all the relevant data
            io.emit("remove", socket.player.id);
        });
    });

    socket.on("updatePositions", data => {
        socket.player.x = data.x;
        socket.player.y = data.y;
        io.emit("renderMove", {
            id: data.id,
            x: data.x,
            y: data.y,
            velocityX: data.velocityX,
            velocityY: data.velocityY,
            playerList
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
