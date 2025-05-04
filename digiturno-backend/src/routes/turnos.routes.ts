import { Router } from 'express';
import {
  obtenerTiposTurno,
  obtenerSubtiposPorTipo,
  registrarTurno,
  verificarTurnoExistente,
  obtenerTurnosAsignados,
  obtenerEstadisticasTurnos
} from '../controllers/turnos.controller';

const router = Router();

router.get('/tipos', obtenerTiposTurno);
router.get('/subtipos/:id', obtenerSubtiposPorTipo);
router.get('/asignados', obtenerTurnosAsignados);
router.get('/estadisticas', obtenerEstadisticasTurnos);
router.post('/', registrarTurno);
router.get('/turno-existe/:documento', verificarTurnoExistente);

export default router;
