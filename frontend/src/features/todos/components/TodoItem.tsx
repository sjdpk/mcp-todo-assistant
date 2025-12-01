import type { Todo } from '../../../types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <li className={`todo-item ${todo.is_completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        className="todo-checkbox"
        checked={todo.is_completed}
        onChange={() => onToggle(todo.id, todo.is_completed)}
      />
      <span className="todo-text">{todo.text}</span>
      <button className="btn-delete" onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </li>
  );
}
