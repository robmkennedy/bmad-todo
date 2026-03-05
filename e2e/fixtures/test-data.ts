/**
 * Test data fixtures for E2E tests
 */

export const validTasks = [
  { text: 'Buy groceries', description: 'Typical task' },
  { text: 'A', description: 'Minimum length (1 char)' },
  { text: 'a'.repeat(500), description: 'Maximum length (500 chars)' },
  { text: 'Task with émojis 🎉', description: 'Unicode support' },
  { text: 'Task with números 123', description: 'Alphanumeric' },
  { text: "Task with special chars !@#$%^&*()", description: 'Special characters' },
];

export const invalidTasks = [
  { text: '', description: 'Empty string', expectedError: 'Todo text is required' },
  { text: '   ', description: 'Whitespace only', expectedError: 'Todo text is required' },
  { text: 'a'.repeat(501), description: 'Over max length', expectedError: 'Todo text must be 500 characters or less' },
];

export const xssTasks = [
  { text: '<script>alert("xss")</script>', description: 'Script injection' },
  { text: '<img src="x" onerror="alert(1)">', description: 'Image onerror' },
  { text: 'javascript:alert(1)', description: 'JavaScript protocol' },
];

/**
 * Generate a task with specific character count
 */
export function generateTask(length: number): string {
  return 'a'.repeat(length);
}

/**
 * Seed data for tests that need pre-existing tasks
 */
export const seedTasks = [
  { text: 'First seeded task' },
  { text: 'Second seeded task' },
  { text: 'Third seeded task' },
];

