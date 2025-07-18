import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import turnosRoutes from './routes/turnos.routes';
import jornadasRoutes from './routes/jornadas.routes';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();

// Configuración de CORS
app.use(cors({
    origin: [
        'http://192.168.1.12:8100', 
        'http://localhost:8100', 
        'http://localhost:4200', 
        'http://localhost:22',
        'http://31.97.136.77:8100',
        'http://31.97.136.77:4200',
        'http://31.97.136.77:22',
        'capacitor://localhost',
        'ionic://localhost'
    ],
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

// Middleware de seguridad HTTP headers
app.use(helmet());

// Rate limiting para evitar abuso
app.use(rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minuto
    max: 10, // máximo 10 requests por minuto por IP
    message: { error: 'Demasiadas solicitudes, intenta más tarde.' }
}));

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

// Middleware global de manejo de errores
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Error global:', err);
    res.status(err.status || 500).json({
        error: true,
        message: err.message || 'Error interno del servidor'
    });
});

// Iniciar servidor
const PORT = process.env.PORT || 22;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(Number(PORT), HOST, () => {
    console.log(`🚀 Servidor corriendo en http://${HOST}:${PORT}`);
    console.log(`📊 Health check: http://${HOST}:${PORT}/health`);
});

export default app;
