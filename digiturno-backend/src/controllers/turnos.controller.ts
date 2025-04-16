import { Request, Response } from 'express';
import db from '../config/db';

export const obtenerTiposTurno = (_req: Request, res: Response) => {
  db.query('SELECT * FROM tipos_turno', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

export const obtenerSubtiposPorTipo = (req: Request, res: Response) => {
  const tipoTurnoId = req.params.id;

  db.query(
    'SELECT * FROM subtipos_turno WHERE tipo_turno_id = ?',
    [tipoTurnoId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
};

export const registrarTurno = (req: Request, res: Response) => {
  const {
    nombres,
    apellidos,
    tipo_documento,
    numero_documento,
    tipo_turno_id,
    subtipo_turno_id // puede ser null si el tipo es GENERAL
  } = req.body;

  db.query(
    `INSERT INTO turnos 
    (nombres, apellidos, tipo_documento, numero_documento, tipo_turno_id, subtipo_turno_id) 
    VALUES (?, ?, ?, ?, ?, ?)`,
    [nombres, apellidos, tipo_documento, numero_documento, tipo_turno_id, subtipo_turno_id || null],
    (err, result: any) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId, message: 'Turno registrado correctamente' });
    }
  );
};
