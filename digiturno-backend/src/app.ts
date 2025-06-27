import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import turnosRoutes from './routes/turnos.routes';
import jornadasRoutes from './routes/jornadas.routes';

dotenv.config();

const app = express();

// Configuración de CORS
app.use(cors({
    origin: ['http://192.168.1.12:8100', 'http://localhost:8100', 'http://localhost:4200', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Middleware para parsear JSON
app.use(express.json());

// Middleware para logging de requests
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Rutas
app.use('/turnos', turnosRoutes);
app.use('/jornadas', jornadasRoutes);

// Ruta de prueba
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Middleware para manejar rutas no encontradas
app.use('*', (req: Request, res: Response) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(Number(PORT), HOST, () => {
    console.log(`🚀 Servidor corriendo en http://${HOST}:${PORT}`);
    console.log(`📊 Health check: http://${HOST}:${PORT}/health`);
});

export default app;
