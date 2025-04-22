import { Request, Response } from 'express';
import { TurnoModel } from '../models/turnoModel';
import { TipoTurnoModel } from '../models/tipoTurnoModel';
import { ValidationError } from '../utils/validations';

// Obtener tipos de turno
export const obtenerTiposTurno = async (_req: Request, res: Response) => {
  try {
    const tipos = await TipoTurnoModel.listarTipos();
    res.json(tipos);
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
};

// Obtener subtipos por ID de tipo
export const obtenerSubtiposPorTipo = async (req: Request, res: Response) => {
  try {
    const tipoTurnoId = parseInt(req.params.id);
    const subtipos = await TipoTurnoModel.obtenerSubtipos(tipoTurnoId);
    res.json(subtipos);
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
};

// Registrar turno
export const registrarTurno = async (req: Request, res: Response) => {
  try {
    const resultado = await TurnoModel.crear(req.body);
    res.status(201).json(resultado);
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message });
    } else {
      const error = err as Error;
      res.status(500).json({ error: error.message });
    }
  }
};

// Verificar si ya existe un turno con el documento
export const verificarTurnoExistente = async (req: Request, res: Response) => {
  try {
    const numeroDocumento = req.params.documento;
    const resultado = await TurnoModel.verificarExistente(numeroDocumento);
    res.json(resultado);
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los turnos asignados
export const obtenerTurnosAsignados = async (_req: Request, res: Response) => {
  try {
    const turnos = await TurnoModel.listarTurnosAsignados();
    res.json(turnos);
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
};

// Obtener cantidad de personas registradas por tipo de turno
export const obtenerEstadisticasTurnos = async (_req: Request, res: Response) => {
  try {
    const estadisticas = await TurnoModel.obtenerEstadisticas();
    res.json(estadisticas);
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
};