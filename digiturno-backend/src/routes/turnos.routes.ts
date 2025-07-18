import { Router } from 'express';
import { body } from 'express-validator';
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
router.post(
  '/',
  [
    body('nombres')
      .isString().withMessage('El nombre debe ser texto')
      .matches(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]{2,50}$/)
      .withMessage('El nombre solo debe contener letras y espacios (2-50 caracteres)'),
    body('apellidos')
      .isString().withMessage('El apellido debe ser texto')
      .matches(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]{2,50}$/)
      .withMessage('El apellido solo debe contener letras y espacios (2-50 caracteres)'),
    body('tipo_documento')
      .isString().notEmpty().withMessage('El tipo de documento es obligatorio'),
    body('numero_documento')
      .isString().matches(/^\d{1,15}$/)
      .withMessage('El documento solo debe contener números (máximo 15 dígitos)'),
    body('tipo_turno_id')
      .isInt({ min: 1 }).withMessage('El tipo de turno debe ser un número entero positivo'),
    body('subtipo_turno_id')
      .optional({ nullable: true })
      .isInt({ min: 1 }).withMessage('El subtipo de turno debe ser un número entero positivo'),
  ],
  registrarTurno
);
router.get('/turno-existe/:documento', verificarTurnoExistente); 

export default router;
