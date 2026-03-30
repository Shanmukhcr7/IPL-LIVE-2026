const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors({ origin: '*' })); // Match frontend domain for production if needed

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

let liveViewers = 0;
// Basic in-memory chat history (optional, to send latest to new users)
const chatHistory = [];
const MAX_HISTORY = 50;

app.get('/', (req, res) => {
  res.send('Live IPL Streaming API is Running!');
});

io.on('connection', (socket) => {
  // Increase viewer count
  liveViewers++;
  io.emit('viewer_count_update', liveViewers);

  // Send latest history to new user
  socket.emit('chat_history', chatHistory);

  // Allow clients to request current count (in case they missed the initial broadcast)
  socket.on('get_viewer_count', () => {
    socket.emit('viewer_count_update', liveViewers);
  });

  // Listen for chat messages
  socket.on('send_message', (messageData) => {
    // messageData: { text, uid, displayName, photoURL, isAdmin, createdAt }
    const msg = {
      id: Date.now() + Math.random().toString(),
      ...messageData,
      createdAt: messageData.createdAt || Date.now()
    };
    
    // Save to memory
    chatHistory.push(msg);
    if (chatHistory.length > MAX_HISTORY) {
      chatHistory.shift(); // Remove oldest
    }
    
    // Broadcast message to everyone
    io.emit('receive_message', msg);
  });

  // Listen for reactions
  socket.on('send_reaction', (reactionData) => {
    // reactionData: { emoji, uid }
    io.emit('receive_reaction', {
      id: Date.now() + Math.random().toString(),
      ...reactionData
    });
  });

  // Disconnect
  socket.on('disconnect', () => {
    liveViewers = Math.max(0, liveViewers - 1);
    io.emit('viewer_count_update', liveViewers);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
