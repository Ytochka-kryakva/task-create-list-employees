import { Router, Request, Response } from 'express';
import db from '../db/index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Все роуты защищены авторизацией
router.use(authMiddleware);

// Получить список сотрудников
router.get('/', (_req: Request, res: Response) => {
  try {
    const employees = db.prepare('SELECT * FROM employees').all() as Array<{
      id: number;
      full_name: string;
      position: string;
      department: string;
      created_at: string;
    }>;

    res.json(employees);
  } catch {
    res.status(500).json({ error: 'Ошибка получения списка сотрудников' });
  }
});

// Добавить сотрудника
router.post('/', (req: Request, res: Response) => {
  try {
    const { full_name, position, department } = req.body;

    // Валидация — все поля обязательны
    if (!full_name || !position || !department) {
      res.status(400).json({ error: 'Поля full_name, position и department обязательны' });
      return;
    }

    // Проверка на пустые строки (только пробелы)
    if (!full_name.trim() || !position.trim() || !department.trim()) {
      res.status(400).json({ error: 'Поля не могут состоять только из пробелов' });
      return;
    }

    const result = db.prepare(
      'INSERT INTO employees (full_name, position, department) VALUES (?, ?, ?)'
    ).run(full_name.trim(), position.trim(), department.trim());

    const employee = db.prepare(
      'SELECT * FROM employees WHERE id = ?'
    ).get(result.lastInsertRowid) as {
      id: number;
      full_name: string;
      position: string;
      department: string;
      created_at: string;
    };

    res.status(201).json(employee);
  } catch {
    res.status(500).json({ error: 'Ошибка добавления нового сотрудника' });
  }
});

export default router;
