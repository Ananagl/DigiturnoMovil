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
        'http://31.97.136.77:3004',
        'capacitor://localhost',
        'ionic://localhost'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Middleware para parsear JSON
app.use(express.json());

// Middleware para logging de requests - MEJORADO PARA DIAGNÓSTICO
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`🔍 ${new Date().toISOString()} - ${req.method} ${req.path}`);
    console.log(`📍 URL completa: ${req.protocol}://${req.get('host')}${req.originalUrl}`);
    console.log(`🌐 Origen: ${req.get('origin') || 'No especificado'}`);
    console.log(`📱 User-Agent: ${req.get('user-agent')}`);
    console.log(`📋 Headers:`, req.headers);
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
    console.log('✅ Health check accedido correctamente');
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Middleware para manejar rutas no encontradas - MEJORADO PARA DIAGNÓSTICO
app.use('*', (req: Request, res: Response) => {
    console.log('❌ RUTA NO ENCONTRADA:');
    console.log(`   Método: ${req.method}`);
    console.log(`   Ruta: ${req.path}`);
    console.log(`   URL completa: ${req.originalUrl}`);
    console.log(`   Origen: ${req.get('origin')}`);
    console.log(`   User-Agent: ${req.get('user-agent')}`);
    console.log(`   Headers completos:`, req.headers);
    
    res.status(404).json({ 
        error: 'Ruta no encontrada',
        details: {
            method: req.method,
            path: req.path,
            fullUrl: req.originalUrl,
            timestamp: new Date().toISOString()
        }
    });
});

// Middleware global de manejo de errores
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('❌ Error global:', err);
    console.error('📍 Ruta que causó el error:', req.originalUrl);
    res.status(err.status || 500).json({
        error: true,
        message: err.message || 'Error interno del servidor',
        path: req.originalUrl
    });
});

// Iniciar servidor
const PORT = process.env.PORT || 3004;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(Number(PORT), HOST, () => {
    console.log(`🚀 Servidor corriendo en http://${HOST}:${PORT}`);
    console.log(`📊 Health check: http://${HOST}:${PORT}/health`);
    console.log(`🔧 Rutas disponibles:`);
    console.log(`   - GET /health`);
    console.log(`   - GET /turnos/tipos-turno`);
    console.log(`   - GET /turnos/asignados`);
    console.log(`   - POST /turnos`);
    console.log(`   - GET /jornadas`);
});

export default app;
