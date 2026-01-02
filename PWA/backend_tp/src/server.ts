import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import apiRoutes from './routes/api.routes';
import { createDefaultAdmin } from './utils/createDefaultAdmin';

const app = express();

app.use(cors());
app.use(express.json({ limit: '150mb' }));
app.use(express.urlencoded({ limit: '150mb', extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api', apiRoutes);

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pt_platform';
const PORT = process.env.PORT || 3000;

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('MongoDB conectado');
    
    await createDefaultAdmin();
    
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Erro ao conectar ao MongoDB:', err);
    process.exit(1);
  });