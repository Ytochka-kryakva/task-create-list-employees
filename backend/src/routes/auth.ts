import { Router } from 'express';
import bcrypt from 'bcryptjs';
import db from '../db/index.js';
import { signToken } from '../helpers/jwt.js';

const router = Router();

// Регистрация
router.post('/register', (req, res) => {
  try {
    const password = req.body.password;
    const email = String(req.body.email).trim().toLowerCase();

    // Валидация
    if (!email || !password) {
      res.status(400).json({ error: 'Email и пароль обязательны' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: 'Некорректный email' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Пароль должен содержать минимум 6 символов' });
      return;
    }

    // Проверка уникальности email
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email) as { id: number } | undefined;
    if (existingUser) {
      res.status(409).json({ error: 'Пользователь с таким email уже существует' });
      return;
    }

    // Хеширование пароля
    const passwordHash = bcrypt.hashSync(password, 10);

    // Создание пользователя
    const result = db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)').run(email, passwordHash);
    
    // Генерация токена
    const token = signToken(Number(result.lastInsertRowid), email);

    res.status(201).json({ token, email: email });
  } catch {
    res.status(500).json({ error: 'Ошибка при регистрации' });
  }
});

// Вход
router.post('/login', (req, res) => {
  try {
    const password = req.body.password;
    const email = String(req.body.email).trim().toLowerCase();

    // Валидация
    if (!email || !password) {
      res.status(400).json({ error: 'Email и пароль обязательны' });
      return;
    }

    // Поиск пользователя
    const user = db.prepare('SELECT id, email, password_hash FROM users WHERE email = ?').get(email) as {
      id: number;
      email: string;
      password_hash: string;
    } | undefined;

    if (!user) {
      res.status(401).json({ error: 'Неверный email или пароль' });
      return;
    }

    // Проверка пароля
    const passwordMatch = bcrypt.compareSync(password, user.password_hash);
    if (!passwordMatch) {
      res.status(401).json({ error: 'Неверный email или пароль' });
      return;
    }

    // Генерация токена
    const token = signToken(user.id, user.email);

    res.json({ token, email: user.email });
  } catch {
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

export default router;
