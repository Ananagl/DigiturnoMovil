import { Request, Response } from 'express';
import db from '../config/db';

export const getAllUsers = (_req: Request, res: Response) => {
  db.query('SELECT * FROM usuarios', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};
