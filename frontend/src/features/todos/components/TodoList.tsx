import type { Todo } from '../../../types';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
}

export default function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  // Safety check: ensure todos is an array
  if (!Array.isArray(todos)) {
    console.error('TodoList received non-array todos:', todos);
    return <div className="error">Invalid data format</div>;
  }

  const completedCount = todos.filter(todo => todo.is_completed).length;
  const totalCount = todos.length;

  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-state-text">No todos yet. Add one above!</p>
      </div>
    );
  }

  return (
    <>
      <ul className="todo-list">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))}
      </ul>

      <div className="todo-stats">
        <p><strong>{completedCount}</strong> of <strong>{totalCount}</strong> tasks completed, <strong>{totalCount - completedCount}</strong> remaining</p>
      </div>
    </>
  );
}
