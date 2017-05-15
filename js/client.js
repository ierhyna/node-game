const Client = {};
Client.socket = io.connect('http://localhost:8082/');

Client.sendTest = () => {
  console.log('test sent');
  Client.socket.emit('test');
};

Client.socket.on('id', (id) => {
  console.log('Welcome, player ' + id);
});

export default Client;
