// api/server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const {
  validateRegisterBody,
  checkRegisterUniqueness,
  validateLoginBody,
  checkUserCredentials,
} = require('../middleware/registerMiddleware');

const server = express();

server.use(cors());
server.use(express.json());

// bcrypt salt rounds (env'den al, yoksa 8)
const saltRounds = Number(process.env.SALT_ROUNDS) || 8;

// In-memory users
// { id, username, email, password }  // password = HASH
const users = [];

// Health check
server.get('/', (req, res) => {
  res.status(200).send('API is running');
});

// GET /api/kullanicilar
// (best practice: password'u response'tan çıkar)
server.get('/api/kullanicilar', (req, res) => {
  const safeUsers = users.map(({ password, ...rest }) => rest);
  res.status(200).json(safeUsers);
});

// POST /api/kayitol
server.post(
  '/api/kayitol',
  validateRegisterBody,
  checkRegisterUniqueness(users),
  (req, res) => {
    const { username, email, password } = req.body;

    const passwordHash = bcrypt.hashSync(password, saltRounds);

    const newUser = {
      id: users.length + 1,
      username,
      email,
      password: passwordHash,
    };

    users.push(newUser);

    // response'ta password dönme
    const { password: _, ...safeUser } = newUser;
    res.status(201).json(safeUser);
  }
);

// POST /api/giris
server.post(
  '/api/giris',
  validateLoginBody,
  checkUserCredentials(users), // middleware bcrypt.compareSync kullanmalı
  (req, res) => {
    res.status(200).json({
      message: `Hosgeldin ${req.user.username}`,
    });
  }
);

const path = require('path');

if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'client', 'dist');
  server.use(express.static(distPath));

  server.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

module.exports = server;
