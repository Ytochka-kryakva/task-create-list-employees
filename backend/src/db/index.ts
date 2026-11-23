import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '..', '..', 'data.db');
const db = new Database(dbPath);

// Включаем foreign keys
db.exec('PRAGMA foreign_keys = ON');

// Создаём таблицы
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    position TEXT NOT NULL,
    department TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

// Демо-сотрудники
const DEMO_EMPLOYEES = [
  { full_name: 'Иванов Иван Иванович', position: 'Разработчик', department: 'IT' },
  { full_name: 'Петрова Анна Сергеевна', position: 'Менеджер', department: 'Продажи' },
  { full_name: 'Сидоров Алексей Петрович', position: 'Дизайнер', department: 'Дизайн' },
  { full_name: 'Козлова Мария Ивановна', position: 'Бухгалтер', department: 'Финансы' },
  { full_name: 'Новиков Дмитрий Олегович', position: 'DevOps-инженер', department: 'IT' },
];

// Заполняем демо-данными, если таблица пуста
const countResult = db.prepare('SELECT COUNT(*) as cnt FROM employees').get() as { cnt: number };

if (countResult.cnt === 0) {
  const insert = db.prepare(
    'INSERT INTO employees (full_name, position, department) VALUES (?, ?, ?)'
  );
  const insertMany = db.transaction((employees: any) => {
    for (const emp of employees) {
      insert.run(emp.full_name, emp.position, emp.department);
    }
  });
  insertMany(DEMO_EMPLOYEES);
}

export default db;
