require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Route de base
app.get('/', (req, res) => {
  res.json({
    message: 'API en production',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Route de statut pour les health checks
app.get('/status', (req, res) => {
  res.json({ status: 'ok' });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT} en mode ${process.env.NODE_ENV || 'development'}`);
});