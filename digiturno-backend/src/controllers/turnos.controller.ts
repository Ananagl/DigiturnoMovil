import { Request, Response } from 'express';
import { TurnoModel } from '../models/turnoModel';
import { TipoTurnoModel } from '../models/tipoTurnoModel';
import { ValidationError } from '../utils/validations';
import logger from '../utils/logger';

// Obtener tipos de turno
export const obtenerTiposTurno = async (_req: Request, res: Response) => {
  try {
    logger.info('Obteniendo tipos de turno');
    const tipos = await TipoTurnoModel.listarTipos();
    logger.info(`Tipos de turno obtenidos: ${tipos.length}`);
    res.json(tipos);
  } catch (err) {
    const error = err as Error;
    logger.error('Error al obtener tipos de turno:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener subtipos por ID de tipo
export const obtenerSubtiposPorTipo = async (req: Request, res: Response) => {
  try {
    const tipoTurnoId = parseInt(req.params.id);
    logger.info(`Obteniendo subtipos para tipo de turno ID: ${tipoTurnoId}`);
    const subtipos = await TipoTurnoModel.obtenerSubtipos(tipoTurnoId);
    logger.info(`Subtipos obtenidos: ${subtipos.length}`);
    res.json(subtipos);
  } catch (err) {
    const error = err as Error;
    logger.error('Error al obtener subtipos:', error);
    res.status(500).json({ error: error.message });
  }
};

// Registrar turno
export const registrarTurno = async (req: Request, res: Response) => {
  try {
    logger.info('Registrando nuevo turno:', req.body);
    const resultado = await TurnoModel.crear(req.body);
    logger.info('Turno registrado exitosamente:', resultado);
    res.status(201).json(resultado);
  } catch (err) {
    if (err instanceof ValidationError) {
      logger.warn('Error de validación al registrar turno:', err.message);
      res.status(400).json({ error: err.message });
    } else {
      const error = err as Error;
      logger.error('Error al registrar turno:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

// Verificar si ya existe un turno con el documento
export const verificarTurnoExistente = async (req: Request, res: Response) => {
  try {
    const numeroDocumento = req.params.documento;
    logger.info(`Verificando turno existente para documento: ${numeroDocumento}`);
    const resultado = await TurnoModel.verificarExistente(numeroDocumento);
    logger.info('Resultado de verificación:', resultado);
    res.json(resultado);
  } catch (err) {
    const error = err as Error;
    logger.error('Error al verificar turno existente:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los turnos asignados
export const obtenerTurnosAsignados = async (req: Request, res: Response) => {
  try {
    // Leer query param 'dias', o usar 14
    const dias = parseInt(req.query.dias as string, 10) || 14;
    logger.info(`Obteniendo turnos asignados de los últimos ${dias} días`);
    
    // Fecha límite = hoy - dias
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - dias);
    
    logger.info(`Fecha límite: ${fechaLimite.toISOString()}`);
    
    const turnos = await TurnoModel.listarTurnosPorFecha(fechaLimite);
    logger.info(`Turnos obtenidos: ${turnos.length}`);
    
    res.json(turnos);
  } catch (err) {
    const error = err as Error;
    logger.error('Error al obtener turnos asignados:', error);
    res.status(500).json({ error: error.message });
  }
};

// Nuevo endpoint Requerimiento doctora obtener datos de persona por documento
export const obtenerPersonaPorDocumento = async (req: Request, res: Response) => {
  try {
    const { tipo, numero } = req.params;
    logger.info(`Buscando persona con documento: ${tipo} ${numero}`);
    
    const persona = await TurnoModel.buscarPorDocumento(tipo, numero);
    if (persona) {
      logger.info('Persona encontrada:', persona);
      res.json(persona);
    } else {
      logger.info('Persona no encontrada');
      res.status(204).send(); // No Content si no se encuentra
    }
  } catch (err) {
    const error = err as Error;
    logger.error('Error al buscar persona por documento:', error);
    res.status(500).json({ error: error.message });
  }
};