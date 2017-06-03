const express = require("express");
const fs = require('fs');
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
let name = "undef";
const stream = fs.createWriteStream("server.log");
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
let players = [];
let p;

io.on("connection", socket => {
    socket.on("newPlayer", () => {
        p = createPlayer(socket, name, 128, 128);        
        createPlayerList();
        console.log("Current players list: ", players);
        socket.emit("playersRerender", players);
        socket.broadcast.emit("newPlayerConnected", p.player);
        socket.on("disconnect", () => {
            console.log(players)
            players.splice(players.indexOf(players.find(e=>e.id === socket.id)), 1);
            console.log(players)
            io.emit("remove", p.id)
            console.log("player " + socket.id + " has gone offline");
        });
    });

    socket.on("updatePositions", data => {
        if(!p) return
        p.player.x = data.x;
        p.player.y = data.y;
        createPlayerList();        
        io.emit("renderMove", {
            id: data.id,
            velocityX: data.velocityX,
            velocityY: data.velocityY,
            players
        });
    });
});

function createPlayer(socket, name, x, y) {
    socket.player = {}
    socket.player.name = name;
    socket.player.x = x;
    socket.player.y = y;
    socket.player.id = socket.id;
    console.log(`New player ${name} has joined the game with an id: ${socket.id}`);
    return socket;
}

function createPlayerList() {
    players = [];
    Object.keys(io.sockets.connected).forEach(id => {
        io.sockets.connected[id].player && players.push({
            name: io.sockets.connected[id].player.name,
            x: io.sockets.connected[id].player.x,
            y: io.sockets.connected[id].player.y,
            id
        })
    })
}