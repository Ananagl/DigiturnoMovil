import { Router } from 'express';
import {
  obtenerTiposTurno,
  obtenerSubtiposPorTipo,
  registrarTurno,
  verificarTurnoExistente
} from '../controllers/turnos.controller';

const router = Router();

router.get('/tipos', obtenerTiposTurno);
router.get('/subtipos/:id', obtenerSubtiposPorTipo);
router.post('/', registrarTurno);
router.get('/turno-existe/:documento', verificarTurnoExistente); //googogogog

export default router;
