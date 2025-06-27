import { Router } from 'express';
import {
  obtenerPersonaPorDocumento,
  registrarTurno,
  verificarTurnoExistente,
  obtenerTurnosAsignados,
  obtenerTiposTurno,
  obtenerSubtiposPorTipo,
} from '../controllers/turnos.controller';

const router = Router();

// Rutas para tipos de turno
router.get('/tipos-turno', obtenerTiposTurno);
router.get('/tipos-turno/:id/subtipos', obtenerSubtiposPorTipo);

// Rutas para turnos
router.get('/asignados', obtenerTurnosAsignados);
router.get('/datos/:tipo/:numero', obtenerPersonaPorDocumento); //solicitado por la doc
router.post('/', registrarTurno);
router.get('/turno-existe/:documento', verificarTurnoExistente); 

export default router;
