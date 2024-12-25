const express = require('express');
const http = require('http');
const keep_alive = require('./keep_alive.js')

const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const users = {}; // In-memory user storage: { username: password }

// Signup endpoint
app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    if (users[username]) {
        return res.status(400).json({ error: 'User already exists' });
    }
    users[username] = password;
    return res.status(201).json({ message: 'Signup successful' });
});

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (users[username] && users[username] === password) {
        return res.status(200).json({ message: 'Login successful' });
    }
    return res.status(400).json({ error: 'Invalid login credentials' });
});

// WebSocket events
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join', (username) => {
        socket.username = username;
        console.log(`${username} joined the chat`);
    });

    socket.on('chat message', (data) => {
        const timestamp = new Date().toLocaleTimeString();
        io.emit('chat message', { username: data.username, message: data.message, time: timestamp });
    });

    socket.on('disconnect', () => {
        console.log(`${socket.username} disconnected`);
    });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

client.login(process.env.TOKEN); //login bot using token
