import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import Game from './chess/game.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const games = {}; // Store game states by game ID
const playerSockets = {}; // Map player sockets to game IDs

const isValidMove = (move, game) => {
  return game.getLegalMoves(game.turn).includes(move);
};

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('newGame', () => {
    const gameId = uuidv4();
    games[gameId] = { game: new Game(), players: [socket.id] };
    playerSockets[socket.id] = gameId;
    socket.emit('gameCreated', { gameId, player: 'white' });
  });

  socket.on('joinGame', (gameId) => {
    if (games[gameId] && games[gameId].players.length === 1) {
      games[gameId].players.push(socket.id);
      playerSockets[socket.id] = gameId;
      socket.emit('gameJoined', { gameId, player: 'black' });
      socket.to(games[gameId].players[0]).emit('gameStart', games[gameId].game.displayBoard());
    } else {
      socket.emit('error', 'Game not found or already full');
    }
  });

  socket.on('move', (move) => {
    const gameId = playerSockets[socket.id];
    if (gameId && games[gameId]) {
      if (isValidMove(move, games[gameId].game)) {
        // Update the game state with the move
        games[gameId].game.makeMove(move);
        // Broadcast the new game state to the other player
        const otherPlayerId = games[gameId].players.find(id => id !== socket.id);
        socket.to(otherPlayerId).emit('update', games[gameId].game.displayBoard());
    
      } else {
        // Notify the player that the move was invalid
        socket.emit('invalidMove', 'The move is invalid, please try again.');
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    const gameId = playerSockets[socket.id];
    if (gameId && games[gameId]) {
      const otherPlayerId = games[gameId].players.find(id => id !== socket.id);
      if (otherPlayerId) {
        io.to(otherPlayerId).emit('opponentDisconnected');
      }
      delete games[gameId];
    }
    delete playerSockets[socket.id];
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
