const express    = require('express');
const http       = require('http');
const { Server } = require('socket.io');
const cors       = require('cors');
const cron       = require('node-cron');
const admin      = require('firebase-admin');

// ─── Firebase Admin Init ──────────────────────────────────
// On Render, set env var FIREBASE_SERVICE_ACCOUNT_JSON with
// the contents of your service account JSON file.
let db = null;

try {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'my-live-440119',
  });
  db = admin.firestore();
  console.log('✅ Firebase Admin connected');
} catch (err) {
  console.warn('⚠️  Firebase Admin not initialised (missing env var). Chat will use in-memory only.', err.message);
}

// ─── Express + Socket.io ──────────────────────────────────
const app    = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

// ─── Reverse Proxy ────────────────────────────────────────
// Strips X-Frame-Options + CSP frame-ancestors so iframes work
// from ANY device without browser blocking.
app.get('/proxy', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send('Missing ?url=');

  try {
    const upstream = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
        'Referer': url,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    const contentType = upstream.headers.get('content-type') || 'text/html';

    // Strip blocking headers — set permissive ones instead
    res.set({
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      // Explicitly DO NOT forward X-Frame-Options or CSP
    });

    if (contentType.includes('text/html')) {
      let html = await upstream.text();

      // Inject <base> so all relative URLs (CSS, JS, images) resolve correctly
      const baseTag = `<base href="${url}">`;
      if (html.includes('<head>'))      html = html.replace('<head>',  `<head>${baseTag}`);
      else if (html.includes('<HEAD>')) html = html.replace('<HEAD>',  `<head>${baseTag}`);
      else                              html = baseTag + html;

      // Remove any meta X-Frame-Options tags the page may include
      html = html.replace(/<meta[^>]+x-frame-options[^>]*>/gi, '');

      res.send(html);
    } else {
      // Binary assets (images, fonts, JS, CSS) — stream through
      const buffer = await upstream.arrayBuffer();
      res.send(Buffer.from(buffer));
    }
  } catch (err) {
    console.error('Proxy error:', err.message);
    res.status(502).send(`Proxy failed: ${err.message}`);
  }
});


const server = http.createServer(app);
const io     = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

let liveViewers = 0;

// In-memory fallback (also used as a cache so new socket
// connections get immediate messages without a DB read)
let chatHistory = [];
const MAX_HISTORY = 100;

// ─── Load latest messages from Firestore on startup ───────
async function loadHistory() {
  if (!db) return;
  try {
    const snap = await db
      .collection('messages')
      .orderBy('createdAt', 'asc')
      .limitToLast(MAX_HISTORY)
      .get();

    chatHistory = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    console.log(`📨 Loaded ${chatHistory.length} messages from Firestore`);
  } catch (err) {
    console.error('Error loading history:', err.message);
  }
}
loadHistory();

// ─── Save message to Firestore ────────────────────────────
async function saveMessage(msg) {
  if (!db) return;
  try {
    await db.collection('messages').doc(msg.id).set(msg);
  } catch (err) {
    console.error('Error saving message:', err.message);
  }
}

// ─── Delete all messages (called by cron) ────────────────
async function deleteAllMessages() {
  if (!db) return;
  try {
    const snap = await db.collection('messages').get();
    const batch = db.batch();
    snap.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
    chatHistory = []; // clear in-memory cache too
    io.emit('chat_cleared'); // notify all connected clients
    console.log(`🗑️  ${snap.size} messages deleted at midnight IST`);
  } catch (err) {
    console.error('Error deleting messages:', err.message);
  }
}

// ─── Cron: midnight IST = 18:30 UTC ──────────────────────
// IST is UTC+5:30, so 00:00 IST = 18:30 UTC (previous day)
cron.schedule('30 18 * * *', () => {
  console.log('⏰ Midnight IST — clearing chat messages...');
  deleteAllMessages();
}, { timezone: 'UTC' });

// ─── API ──────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.send('IPL Live Streaming API is Running!');
});

// ─── Socket.io ────────────────────────────────────────────
io.on('connection', (socket) => {
  liveViewers++;
  io.emit('viewer_count_update', liveViewers);

  // Send chat history to newly connected user
  socket.emit('chat_history', chatHistory);

  // Handle get_viewer_count request
  socket.on('get_viewer_count', () => {
    socket.emit('viewer_count_update', liveViewers);
  });

  // ── Receive & broadcast chat message ───────────────────
  socket.on('send_message', async (messageData) => {
    const msg = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      ...messageData,
      createdAt: messageData.createdAt || Date.now(),
    };

    // Add to in-memory cache
    chatHistory.push(msg);
    if (chatHistory.length > MAX_HISTORY) chatHistory.shift();

    // Persist to Firestore (non-blocking)
    saveMessage(msg);

    // Broadcast to everyone
    io.emit('receive_message', msg);
  });

  // ── Reactions ──────────────────────────────────────────
  socket.on('send_reaction', (reactionData) => {
    io.emit('receive_reaction', {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      ...reactionData,
    });
  });

  // ── Disconnect ─────────────────────────────────────────
  socket.on('disconnect', () => {
    liveViewers = Math.max(0, liveViewers - 1);
    io.emit('viewer_count_update', liveViewers);
  });
});

// ─── Start server ─────────────────────────────────────────
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
