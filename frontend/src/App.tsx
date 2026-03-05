import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TaskInput } from './components/TaskInput';
import './styles/global.css';

/**
 * React Query client configuration
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      retry: 1,
    },
  },
});

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

/**
 * Fetch all todos from API
 */
async function fetchTodos(): Promise<Todo[]> {
  const response = await fetch('/api/todos');
  if (!response.ok) {
    throw new Error('Failed to fetch todos');
  }
  return response.json();
}

/**
 * Create a new todo via API
 */
async function createTodo(text: string): Promise<Todo> {
  const response = await fetch('/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!response.ok) {
    throw new Error('Failed to create todo');
  }
  return response.json();
}

/**
 * Todo list content component
 */
function TodoContent() {
  const queryClient = useQueryClient();

  const { data: todos = [], isLoading, error } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });

  const mutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const handleSubmit = async (text: string) => {
    await mutation.mutateAsync(text);
  };

  return (
    <>
      <TaskInput onSubmit={handleSubmit} isLoading={mutation.isPending} />

      {isLoading && <p>Loading todos...</p>}

      {error && <p>Error loading todos. Please try again.</p>}

      {!isLoading && !error && todos.length === 0 && (
        <p style={{ marginTop: 'var(--spacing-lg)', color: 'var(--color-text-secondary)' }}>
          No tasks yet. Add one above!
        </p>
      )}

      {todos.length > 0 && (
        <ul style={{ marginTop: 'var(--spacing-lg)' }}>
          {todos.map((todo) => (
            <li
              key={todo.id}
              style={{
                padding: 'var(--spacing-md)',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              {todo.text}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

/**
 * Main App component
 *
 * This is the root component of the application.
 */
export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
        <header>
          <div className="container">
            <h1>BMad Todo</h1>
          </div>
        </header>
        <main>
          <div className="container">
            <TodoContent />
          </div>
        </main>
      </div>
    </QueryClientProvider>
  );
}

