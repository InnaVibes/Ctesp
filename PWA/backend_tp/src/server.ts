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

app.use('/api', apiRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('join_room', (userId) => {
    socket.join(userId);
  });

  socket.on('send_message', (data) => {
    io.to(data.receiverId).emit('receive_message', data);
    io.to(data.receiverId).emit('notification', { type: 'toast', msg: 'New Message!' });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = 3000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📄 Swagger available at http://localhost:${PORT}/api-docs`);
});