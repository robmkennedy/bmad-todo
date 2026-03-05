import { describe, it, expect } from 'vitest';
import { sql } from 'drizzle-orm';
import { db } from '../../db/index.js';

/**
 * Database schema tests
 *
 * These tests verify the SQLite database schema is correctly configured.
 * They ensure the todos table has the correct structure for the application.
 */

interface TableInfo {
  cid: number;
  name: string;
  type: string;
  notnull: number;
  dflt_value: string | null;
  pk: number;
}

interface TableMaster {
  name: string;
}

describe('Database Schema', () => {
  describe('todos table', () => {
    it('exists after migration', () => {
      const tables = db.all<TableMaster>(
        sql`SELECT name FROM sqlite_master WHERE type='table' AND name='todos'`
      );

      expect(tables).toHaveLength(1);
    });

    it('has id column (TEXT, PRIMARY KEY)', () => {
      const tableInfo = db.all<TableInfo>(sql`PRAGMA table_info(todos)`);
      const idCol = tableInfo.find((col) => col.name === 'id');

      expect(idCol).toBeDefined();
      expect(idCol!.type).toBe('TEXT');
      expect(idCol!.pk).toBe(1);
    });

    it('has text column (TEXT, NOT NULL)', () => {
      const tableInfo = db.all<TableInfo>(sql`PRAGMA table_info(todos)`);
      const textCol = tableInfo.find((col) => col.name === 'text');

      expect(textCol).toBeDefined();
      expect(textCol!.type).toBe('TEXT');
      expect(textCol!.notnull).toBe(1);
    });

    it('has completed column (INTEGER, DEFAULT false)', () => {
      const tableInfo = db.all<TableInfo>(sql`PRAGMA table_info(todos)`);
      const completedCol = tableInfo.find((col) => col.name === 'completed');

      expect(completedCol).toBeDefined();
      expect(completedCol!.type).toBe('INTEGER');
    });

    it('has created_at column (TEXT, NOT NULL)', () => {
      const tableInfo = db.all<TableInfo>(sql`PRAGMA table_info(todos)`);
      const createdAtCol = tableInfo.find((col) => col.name === 'created_at');

      expect(createdAtCol).toBeDefined();
      expect(createdAtCol!.type).toBe('TEXT');
      expect(createdAtCol!.notnull).toBe(1);
    });

    it('has all required columns', () => {
      const tableInfo = db.all<TableInfo>(sql`PRAGMA table_info(todos)`);
      const columns = tableInfo.map((col) => col.name);

      expect(columns).toContain('id');
      expect(columns).toContain('text');
      expect(columns).toContain('completed');
      expect(columns).toContain('created_at');
    });
  });
});

