import { useState, useEffect, useCallback } from 'react';
import { getEmployees, addEmployee, type Employee } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { EmployeeForm } from '../components/EmployeeForm';
import '../styles/employees.css';

export function EmployeeList() {
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [addError, setAddError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { logout } = useAuth();

  const loadEmployees = useCallback(async () => {
    setIsLoading(true);
    setAddError('');
    try {
      const data = await getEmployees();
      setAllEmployees(data);
    } catch {
      setAddError('Невозможно загрузить список пользователей, попробуйте позже');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const handleAdd = async (full_name: string, position: string, department: string) => {
    setAddError('');
    setSuccessMessage('');
    try {
      await addEmployee(full_name, position, department);
      setSuccessMessage('Сотрудник добавлен');
      setShowForm(false);
      loadEmployees();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setAddError(err instanceof Error ? err.message : 'Ошибка');
    }
  };

  const departments = Array.from(new Set(allEmployees.map(e => e.department)));
  const filteredEmployees = allEmployees.filter(emp => {
    const matchSearch = !search || emp.full_name.toLowerCase().includes(search.toLowerCase());
    const matchDepartment = !department || emp.department === department;
    return matchSearch && matchDepartment;
  });

  return (
    <div className="employees-page">
      <header className="employees-header">
        <h1>Список сотрудников</h1>
        <div className="header-actions">
          <button type="button" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Отмена' : 'Добавить сотрудника'}
          </button>
          <button type="button" onClick={logout} className="logout-btn">Выйти</button>
        </div>
      </header>

      {successMessage && <div className="success-message">{successMessage}</div>}
      {addError && <div className="error-message">{addError}</div>}

      {showForm && (
        <EmployeeForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} />
      )}

      <div className="filters">
        <div className="filter-group">
          <label htmlFor="search">Поиск по ФИО</label>
          <input
            id="search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Введите ФИО..."
          />
        </div>

        <div className="filter-group">
          <label htmlFor="department-filter">Отдел</label>
          <select
            id="department-filter"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="">Все отделы</option>
            {departments.map(dep => (
              <option key={dep} value={dep}>{dep}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <p className="loading-text">Загрузка...</p>
      ) : filteredEmployees.length === 0 ? (
        <p className="empty-text">Сотрудники не найдены</p>
      ) : (
        <table className="employees-table">
          <thead>
            <tr>
              <th>ФИО</th>
              <th>Должность</th>
              <th>Отдел</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map(emp => (
              <tr key={emp.id}>
                <td>{emp.full_name}</td>
                <td>{emp.position}</td>
                <td>{emp.department}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
