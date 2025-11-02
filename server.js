import "dotenv/config";
import { createServer } from 'http';
import app from "./src/app.js";
import socketManager from './src/utils/socketManager.js';

const port = process.env.PORT || 3000;
const server = createServer(app);

// Inicializar WebSocket
socketManager.initialize(server);

server.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
  console.log(`WebSocket habilitado para tempo real`);
});