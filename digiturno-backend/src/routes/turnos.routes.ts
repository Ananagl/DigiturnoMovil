import { Router } from 'express';
import {
  obtenerPersonaPorDocumento,
  registrarTurno,
  verificarTurnoExistente,
  obtenerTurnosAsignados,
} from '../controllers/turnos.controller';

const router = Router();



router.get('/asignados', obtenerTurnosAsignados);
router.get('/datos/:tipo/:numero', obtenerPersonaPorDocumento); //solicitado por la doc
router.post('/', registrarTurno);
router.get('/turno-existe/:documento', verificarTurnoExistente); //googogogog este endpoint seria para que en teoria?

export default router;
