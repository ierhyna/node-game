import {Game} from './stages/Game.stage';

const Client = {};
Client.socket = io.connect('http://localhost:8082/');

Client.addPlayer = () => {
  Client.socket.emit('newPlayer');
};

Client.socket.on('newPlayerConnected', (player) => {
  console.log(`Player ${player.id} connected`);
  Game.renderNewPlayer(player.id, player.x, player.y);
});

export default Client;
