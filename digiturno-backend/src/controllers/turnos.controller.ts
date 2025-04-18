import { Request, Response } from 'express';
import db from '../config/db';

// Obtener tipos de turno
export const obtenerTiposTurno = (_req: Request, res: Response) => {
  db.query('SELECT * FROM tipos_turno', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Obtener subtipos por ID de tipo
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

// Registrar turno
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

// Verificar si ya existe un turno con el documento
export const verificarTurnoExistente = (req: Request, res: Response) => {
  const numero_documento = req.params.documento;

  db.query(
    'SELECT COUNT(*) AS total FROM turnos WHERE numero_documento = ?',
    [numero_documento],
    (err, results: any) => {
      if (err) return res.status(500).json({ error: err.message });
      const existe = results[0].total > 0;
      res.json({ existe });
    }
  );
};

// Obtener todos los turnos asignados
export const obtenerTurnosAsignados = (_req: Request, res: Response) => {
  const query = `
    SELECT 
      t.id,
      t.nombres,
      t.apellidos,
      t.tipo_documento,
      t.numero_documento,
      tt.nombre AS tipo_turno,
      st.nombre AS subtipo_turno,
      t.fecha_creacion,
      t.estado
    FROM turnos t
    JOIN tipos_turno tt ON t.tipo_turno_id = tt.id
    LEFT JOIN subtipos_turno st ON t.subtipo_turno_id = st.id
    ORDER BY t.fecha_creacion DESC
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Obtener cantidad de personas registradas por tipo de turno
export const obtenerEstadisticasTurnos = (_req: Request, res: Response) => {
  const query = `
    SELECT 
      tt.nombre AS tipo_turno,
      COUNT(t.id) AS cantidad
    FROM turnos t
    JOIN tipos_turno tt ON t.tipo_turno_id = tt.id
    GROUP BY tt.nombre
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};
