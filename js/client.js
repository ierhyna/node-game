const Client = {};
Client.socket = io.connect('http://localhost:3001/');

Client.sendTest = () => {
  console.log('test sent');
  Client.socket.emit('test');
};

Client.socket.on('test', () => {
  console.log('test received');
});

export default Client;
