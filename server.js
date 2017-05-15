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
