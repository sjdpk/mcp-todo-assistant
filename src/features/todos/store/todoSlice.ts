import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { todoService } from '../services/todoService';
import type { Todo } from '../../../types';

interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
}

const initialState: TodoState = {
  todos: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const response = await todoService.getAll();
  console.log('Fetched todos:', response); // Debug log
  return Array.isArray(response) ? response : [];
});

export const addTodo = createAsyncThunk('todos/addTodo', async (text: string) => {
  return await todoService.create(text);
});

export const toggleTodo = createAsyncThunk(
  'todos/toggleTodo',
  async ({ id, isCompleted }: { id: string; isCompleted: boolean }) => {
    return await todoService.update(id, isCompleted);
  }
);

export const removeTodo = createAsyncThunk('todos/removeTodo', async (id: string) => {
  await todoService.delete(id);
  return id;
});

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch todos
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action: PayloadAction<Todo[]>) => {
        state.loading = false;
        state.todos = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch todos';
      })
      // Add todo
      .addCase(addTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
        state.todos.unshift(action.payload);
      })
      // Toggle todo
      .addCase(toggleTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
        const index = state.todos.findIndex((todo) => todo.id === action.payload.id);
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
      })
      // Remove todo
      .addCase(removeTodo.fulfilled, (state, action: PayloadAction<string>) => {
        state.todos = state.todos.filter((todo) => todo.id !== action.payload);
      });
  },
});

export const { clearError } = todoSlice.actions;
export default todoSlice.reducer;
