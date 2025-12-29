import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import apiRoutes from './routes/api.routes';
import { connectDB } from './config/database';
import * as swaggerDocument from '../swagger.json'; 

const app = express();
const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());

connectDB();

// Prefixo global '/api'
app.use('/api', apiRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

io.on('connection', (socket) => {
  console.log(`Utilizador ligado: ${socket.id}`);

  socket.on('join_room', (userId) => {
    socket.join(userId);
  });

  socket.on('send_message', (data) => {
    // Envia mensagem em tempo real e notificação
    io.to(data.receiverId).emit('receive_message', data);
    io.to(data.receiverId).emit('notification', { type: 'toast', msg: 'Nova Mensagem!' });
  });

  socket.on('disconnect', () => {
    console.log('Utilizador desligado');
  });
});

const PORT = 3000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Servidor a correr em http://localhost:${PORT}`);
  console.log(`📄 Swagger disponível em http://localhost:${PORT}/api-docs`);
});