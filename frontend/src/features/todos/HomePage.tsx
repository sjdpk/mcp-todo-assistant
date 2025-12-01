import { useEffect } from 'react';
import './HomePage.css';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchTodos, addTodo, toggleTodo, removeTodo } from './store/todoSlice';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { todos, loading, error } = useAppSelector((state) => state.todos);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const handleAddTodo = (text: string) => {
    dispatch(addTodo(text));
  };

  const handleToggleTodo = (id: string, currentStatus: boolean) => {
    dispatch(toggleTodo({ id, isCompleted: !currentStatus }));
  };

  const handleDeleteTodo = (id: string) => {
    dispatch(removeTodo(id));
  };

  if (loading) {
    return <div className="loading">Loading todos...</div>;
  }

  return (
    <div className="app">
      {error && (
        <div className="error">
          ⚠️ {error}
        </div>
      )}

      <TodoForm onSubmit={handleAddTodo} />
      <TodoList 
        todos={todos} 
        onToggle={handleToggleTodo} 
        onDelete={handleDeleteTodo} 
      />

      {/* Floating Action Button */}
      <button 
        className="fab" 
        onClick={() => navigate('/chat')}
        aria-label="Open chat"
      >
        ✮⋆
      </button>
    </div>
  );
}
