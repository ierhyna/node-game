const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use('/css', express.static(__dirname + '/css'));
app.use('/dist', express.static(__dirname + '/dist'));
app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

server.listen(8082, () => {
  console.log('Listening on ' + server.address().port);
});

io.on('connection', socket => {
  socket.on('newPlayer', () => {
    socket.player = {
      id: generateRandomId(),
      x: randomInt(50, 200),
      y: randomInt(50, 200),
    };

    socket.emit('playersRerender', getAllPlayers());
    socket.broadcast.emit('newPlayerConnected', socket.player);

    socket.on('disconnect', () => {
      io.emit('remove', socket.player.id);
    });
  });
});

function generateRandomId(){
    return `${hashBuild()}-${hashBuild()}-${hashBuild()}-${hashBuild()}`
}

function hashBuild() {
    return String(Math.random()).slice(2,6);
}

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

function getAllPlayers() {
    const players = [];
    Object.keys(io.sockets.connected).forEach((socketID) => {
        const player = io.sockets.connected[socketID].player;
        if (player) players.push(player);
    });
    console.log(players)
    return players;
}
