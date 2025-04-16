import { Router } from 'express';
import {
  obtenerTiposTurno,
  obtenerSubtiposPorTipo,
  registrarTurno
} from '../controllers/turnos.controller';

const router = Router();

router.get('/tipos', obtenerTiposTurno);
router.get('/subtipos/:id', obtenerSubtiposPorTipo);
router.post('/', registrarTurno);

export default router;
