import { Request, Response } from 'express';
import { TurnoModel } from '../models/turnoModel';
import { TipoTurnoModel } from '../models/tipoTurnoModel';
import { ValidationError } from '../utils/validations';
import logger from '../utils/logger';

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

// Verificar si ya existe un turno con el documento??? adaptar este endopoint pra hacer llamados de legalapp o de otras formas?????
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

// Obtener todos los turnos asignados este seria para el de listar turnos????
export const obtenerTurnosAsignados = async (req: Request, res: Response) => {
  try {
    // Leer query param 'dias', o usar 14
    const dias = parseInt(req.query.dias as string, 10) || 14;
    // Fecha límite = hoy - dias
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - dias);

    const turnos = await TurnoModel.listarTurnosPorFecha(fechaLimite);
    res.json(turnos);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};



// Nuevo endpoint Requerimiento doctora obtener datos de persona por documento
export const obtenerPersonaPorDocumento = async (req: Request, res: Response) => {
  try {
    const { tipo, numero } = req.params;
    const persona = await TurnoModel.buscarPorDocumento(tipo, numero);
    if (persona) {
      res.json(persona);
    } else {
      res.status(204).send(); // No Content si no se encuentra
    }
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};