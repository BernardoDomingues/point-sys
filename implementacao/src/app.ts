import express from 'express';
import cors from 'cors';
import path from 'path';
import { DatabaseManager } from './database/DatabaseManager';

import authRoutes from './routes/auth';
import transactionRoutes from './routes/transactions';

const app = express();
const PORT = process.env.PORT || 3000;

DatabaseManager.getInstance();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Sistema de Mérito Acadêmico funcionando!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erro:', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

app.listen(PORT, () => {
  console.log('Servidor rodando na porta', PORT);
  console.log('Banco SQLite em memória inicializado');
  console.log('Acesse: http://localhost:' + PORT);
});

export default app;
