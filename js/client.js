import {Game} from './stages/Game.stage';

const Client = {};
Client.socket = io.connect('http://localhost:8082/');

Client.addPlayer = () => {
  Client.socket.emit('newPlayer');
};

Client.socket.on('newPlayerConnected', (id) => {
  console.log(`Player ${id} connected`);
  console.log(Game)
  Game.renderNewPlayer(id, 50, 50);
});

export default Client;
