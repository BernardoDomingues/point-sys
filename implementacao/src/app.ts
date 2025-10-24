import express from 'express';
import cors from 'cors';
import path from 'path';
import { DatabaseManager } from './database/DatabaseManager';

import authRoutes from './routes/auth';
import transactionRoutes from './routes/transactions';
import studentRoutes from './routes/students';
import companyRoutes from './routes/companies';

const app = express();
const PORT = process.env.PORT || 3000;

DatabaseManager.getInstance();

// Configuração do CORS - permitir origens específicas incluindo Live Server
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:5500',
        'http://127.0.0.1:5500',
        'http://localhost:8080',
        'http://127.0.0.1:8080'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware adicional para CORS com Live Server
app.use((req, res, next) => {
    const origin = req.headers.origin;
    console.log('Origin da requisição:', origin);
    
    // Permitir origens do Live Server e localhost
    if (origin && (
        origin.includes('localhost:5500') || 
        origin.includes('127.0.0.1:5500') ||
        origin.includes('localhost:3000') ||
        origin.includes('127.0.0.1:3000')
    )) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
    }
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    next();
});

app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/companies', companyRoutes);

app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Sistema de Mérito Acadêmico funcionando!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Endpoint de teste para CORS
app.options('/api/test-cors', (req, res) => {
  res.status(200).end();
});

app.get('/api/test-cors', (req, res) => {
  res.json({ 
    message: 'CORS funcionando!',
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
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
