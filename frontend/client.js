import { io } from 'socket.io-client';
import readline from 'readline';

const socket = io('http://localhost:3000');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

socket.on('connect', () => {
  console.log('Connected to the server');
  rl.question('Enter "new" to start a new game or "join [gameId]" to join an existing game: ', (command) => {
    const [action, gameId] = command.split(' ');
    if (action === 'new') {
      socket.emit('newGame');
    } else if (action === 'join' && gameId) {
      socket.emit('joinGame', gameId);
    } else {
      console.log('Invalid command');
      rl.close();
    }
  });
});

socket.on('gameCreated', ({ gameId, player }) => {
  console.log(`Game created. Your game ID is ${gameId}. You are playing as ${player}.`);
});

socket.on('gameJoined', ({ gameId, player }) => {
  console.log(`Joined game ${gameId}. You are playing as ${player}.`);
});

socket.on('gameStart', (gameState) => {
  console.log('Game started:');
  console.log(gameState);
  promptMove();
});

socket.on('update', (gameState) => {
  console.log('\nGame State Updated:');
    console.log(gameState);
  promptMove();
});

socket.on('invalidMove', (message) => {
  console.log(message);
  promptMove();
});

socket.on('opponentDisconnected', () => {
  console.log('Your opponent has disconnected. The game is over.');
  rl.close();
});

socket.on('error', (message) => {
  console.log('Error:', message);
  rl.close();
});

const promptMove = () => {
  rl.question('Enter your move: ', (move) => {
    socket.emit('move', move);
  });
};
