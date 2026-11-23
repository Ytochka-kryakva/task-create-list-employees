import { useState } from 'react';

interface EmployeeFormProps {
  onSubmit: (full_name: string, position: string, department: string) => void;
  onCancel: () => void;
}

export function EmployeeForm({ onSubmit, onCancel }: EmployeeFormProps) {
  const [fullName, setFullName] = useState('');
  const [position, setPosition] = useState('');
  const [department, setDepartment] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'ФИО обязательно';
    }
    if (!position.trim()) {
      newErrors.position = 'Должность обязательна';
    }
    if (!department.trim()) {
      newErrors.department = 'Отдел обязателен';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(fullName.trim(), position.trim(), department.trim());
    }
  };

  return (
    <form className="employee-form" onSubmit={handleSubmit}>
      <h3>Добавить сотрудника</h3>

      <div className="form-group">
        <label htmlFor="emp-fullname">ФИО</label>
        <input
          id="emp-fullname"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Иванов Иван Иванович"
        />
        {errors.fullName && <span className="field-error">{errors.fullName}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="emp-position">Должность</label>
        <input
          id="emp-position"
          type="text"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          placeholder="Разработчик"
        />
        {errors.position && <span className="field-error">{errors.position}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="emp-department">Отдел</label>
        <input
          id="emp-department"
          type="text"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          placeholder="IT"
        />
        {errors.department && <span className="field-error">{errors.department}</span>}
      </div>

      <div className="form-actions">
        <button type="submit">Добавить</button>
        <button type="button" onClick={onCancel} className="btn-cancel">Отмена</button>
      </div>
    </form>
  );
}
