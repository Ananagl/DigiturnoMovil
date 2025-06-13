import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import turnosRoutes from './routes/turnos.routes';
import jornadasRoutes from './routes/jornadas.routes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/turnos', turnosRoutes);
app.use('/jornadas', jornadasRoutes);

app.use(cors({
    origin: ['http://192.168.1.12:8100', 'http://localhost:8100', 'http://localhost:4200'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para parsear JSON
app.use(express.json());

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendoooooi en http://192.168.1.12:${PORT}`);
});

export default app;
