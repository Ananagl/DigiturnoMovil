import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import turnosRoutes from './routes/turnos.routes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/turnos', turnosRoutes);

export default app;
