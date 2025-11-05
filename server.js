import "dotenv/config";
import { createServer } from 'http';
import app from "./src/app.js";
import socketManager from './src/utils/socketManager.js';
import { logUrlConfig } from './src/utils/urlHelper.js';

const port = process.env.PORT || 3000;
const server = createServer(app);

// Inicializar WebSocket
socketManager.initialize(server);

server.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
  console.log(`🔌 WebSocket habilitado para tempo real`);
  logUrlConfig();
});