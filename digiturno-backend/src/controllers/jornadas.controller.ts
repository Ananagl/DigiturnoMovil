import { Request, Response } from 'express';
import { JornadaModel } from '../models/jornadaModel';

export const obtenerJornadaActiva = async (_req: Request, res: Response) => {
  try {
    const jornada = await JornadaModel.obtenerJornadaActiva();
    if (!jornada) {
      return res.status(404).json({ message: 'No hay jornada activa' });
    }
    res.json(jornada);
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
};

export const crearJornada = async (_req: Request, res: Response) => {
  try {
    const jornada = await JornadaModel.crearJornada();
    res.status(201).json(jornada);
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
};

export const finalizarJornada = async (req: Request, res: Response) => {
  try {
    const jornadaId = parseInt(req.params.id);
    await JornadaModel.finalizarJornada(jornadaId);
    res.json({ message: 'Jornada finalizada correctamente' });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
};

export const obtenerTurnosJornada = async (req: Request, res: Response) => {
  try {
    const jornadaId = parseInt(req.params.id);
    const turnos = await JornadaModel.obtenerTurnosPorJornada(jornadaId);
    res.json(turnos);
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
}; 