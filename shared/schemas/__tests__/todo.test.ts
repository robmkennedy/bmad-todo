import { describe, it, expect } from 'vitest';
import { createTodoSchema, updateTodoSchema } from '../todo';

/**
 * Todo validation schema tests
 *
 * These tests verify the Zod validation schemas work correctly.
 */

describe('createTodoSchema', () => {
  describe('valid input', () => {
    it('accepts valid text', () => {
      const result = createTodoSchema.safeParse({ text: 'Buy milk' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.text).toBe('Buy milk');
      }
    });

    it('accepts minimum length text (1 char)', () => {
      const result = createTodoSchema.safeParse({ text: 'A' });
      expect(result.success).toBe(true);
    });

    it('accepts maximum length text (500 chars)', () => {
      const result = createTodoSchema.safeParse({ text: 'a'.repeat(500) });
      expect(result.success).toBe(true);
    });

    it('accepts text with Unicode characters', () => {
      const result = createTodoSchema.safeParse({ text: 'Tâche à faire' });
      expect(result.success).toBe(true);
    });

    it('accepts text with emojis', () => {
      const result = createTodoSchema.safeParse({ text: 'Buy groceries 🛒' });
      expect(result.success).toBe(true);
    });

    it('trims whitespace from text', () => {
      const result = createTodoSchema.safeParse({ text: '  Buy milk  ' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.text).toBe('Buy milk');
      }
    });
  });

  describe('invalid input', () => {
    it('rejects empty string', () => {
      const result = createTodoSchema.safeParse({ text: '' });
      expect(result.success).toBe(false);
    });

    it('rejects whitespace-only string', () => {
      const result = createTodoSchema.safeParse({ text: '   ' });
      expect(result.success).toBe(false);
    });

    it('rejects text > 500 characters', () => {
      const result = createTodoSchema.safeParse({ text: 'a'.repeat(501) });
      expect(result.success).toBe(false);
    });

    it('rejects missing text field', () => {
      const result = createTodoSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it('rejects null text', () => {
      const result = createTodoSchema.safeParse({ text: null });
      expect(result.success).toBe(false);
    });

    it('rejects non-string text', () => {
      const result = createTodoSchema.safeParse({ text: 123 });
      expect(result.success).toBe(false);
    });
  });

  describe('error messages', () => {
    it('returns correct error for empty text', () => {
      const result = createTodoSchema.safeParse({ text: '' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('empty');
      }
    });

    it('returns correct error for text too long', () => {
      const result = createTodoSchema.safeParse({ text: 'a'.repeat(501) });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('500');
      }
    });
  });
});

describe('updateTodoSchema', () => {
  describe('valid input', () => {
    it('accepts text update', () => {
      const result = updateTodoSchema.safeParse({ text: 'Updated text' });
      expect(result.success).toBe(true);
    });

    it('accepts completed update', () => {
      const result = updateTodoSchema.safeParse({ completed: true });
      expect(result.success).toBe(true);
    });

    it('accepts both text and completed update', () => {
      const result = updateTodoSchema.safeParse({ text: 'Updated', completed: true });
      expect(result.success).toBe(true);
    });

    it('accepts empty object (no updates)', () => {
      const result = updateTodoSchema.safeParse({});
      expect(result.success).toBe(true);
    });
  });

  describe('invalid input', () => {
    it('rejects empty text', () => {
      const result = updateTodoSchema.safeParse({ text: '' });
      expect(result.success).toBe(false);
    });

    it('rejects text > 500 characters', () => {
      const result = updateTodoSchema.safeParse({ text: 'a'.repeat(501) });
      expect(result.success).toBe(false);
    });

    it('rejects non-boolean completed', () => {
      const result = updateTodoSchema.safeParse({ completed: 'yes' });
      expect(result.success).toBe(false);
    });
  });
});

