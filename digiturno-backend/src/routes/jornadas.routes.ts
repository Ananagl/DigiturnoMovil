import { Router } from 'express';
import {
  obtenerJornadaActiva,
  crearJornada,
  finalizarJornada,
  obtenerTurnosJornada
} from '../controllers/jornadas.controller';

const router = Router();

router.get('/activa', obtenerJornadaActiva);
router.post('/', crearJornada);
router.put('/:id/finalizar', finalizarJornada);
router.get('/:id/turnos', obtenerTurnosJornada);

export default router; 