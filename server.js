const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io').listen(server);

app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

server.listen(8082, () => {
  console.log('Listening on ' + server.address().port);
});
