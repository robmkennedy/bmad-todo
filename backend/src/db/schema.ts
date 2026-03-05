import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

/**
 * Todos table schema
 *
 * Stores all todo items with their completion status.
 */
export const todos = sqliteTable('todos', {
  id: text('id').primaryKey(),
  text: text('text').notNull(),
  completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull(),
});

export type TodoRecord = typeof todos.$inferSelect;
export type NewTodoRecord = typeof todos.$inferInsert;

