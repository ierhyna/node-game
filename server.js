const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
let player = {};
let players = [];

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
  player = {
    id: generateRandomId(),
    x: randomInt(50, 200),
    y: randomInt(50, 200),
  };
  socket.on('newPlayer', () => {
    console.log('Creating player session ' + player.id);
    io.emit('newPlayerConnected', player);

    players.push(player);
    io.emit('playersRerender', players);
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
