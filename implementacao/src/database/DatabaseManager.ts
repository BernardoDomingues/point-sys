import sqlite3 from 'sqlite3';
import path from 'path';

export class DatabaseManager {
  private db: sqlite3.Database;
  private static instance: DatabaseManager;

  private constructor() {
    this.db = new sqlite3.Database(':memory:');
    this.initTables();
    this.seedData();
  }

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  private initTables(): void {
    console.log('Inicializando tabelas do banco de dados...');

    this.db.serialize(() => {
      this.db.exec(`
      CREATE TABLE IF NOT EXISTS institutions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        address TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('student', 'professor', 'company', 'admin')),
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        cpf TEXT UNIQUE NOT NULL,
        rg TEXT,
        address TEXT,
        institution_id INTEGER NOT NULL REFERENCES institutions(id),
        course TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS professors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        cpf TEXT UNIQUE NOT NULL,
        department TEXT,
        institution_id INTEGER NOT NULL REFERENCES institutions(id),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS companies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        cnpj TEXT UNIQUE NOT NULL,
        address TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        from_user_id INTEGER REFERENCES users(id),
        to_user_id INTEGER NOT NULL REFERENCES users(id),
        amount INTEGER NOT NULL,
        reason TEXT,
        transaction_type TEXT NOT NULL CHECK (transaction_type IN ('transfer', 'semester_credit', 'redemption')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS advantages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT,
        cost_coins INTEGER NOT NULL,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS redemptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        advantage_id INTEGER NOT NULL REFERENCES advantages(id) ON DELETE CASCADE,
        transaction_id INTEGER NOT NULL REFERENCES transactions(id),
        redemption_code TEXT UNIQUE NOT NULL,
        status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      `);

      console.log('Tabelas criadas com sucesso!');
    });
  }

  private seedData(): void {
    console.log('Inserindo dados iniciais...');

    this.db.serialize(() => {
      this.db.exec(`
        INSERT OR IGNORE INTO institutions (name, address) VALUES 
        ('Universidade Federal de Tecnologia', 'Rua da Universidade, 123'),
        ('Instituto Tecnológico Nacional', 'Av. Tecnologia, 456'),
        ('Faculdade de Ciências Aplicadas', 'Rua das Ciências, 789');
      `);

      this.db.exec(`
        INSERT OR IGNORE INTO users (email, password, type) VALUES 
        ('admin@test.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');
      `);

      console.log('Dados iniciais inseridos!');
    });
  }

  public getDb(): sqlite3.Database {
    return this.db;
  }

  public close(): void {
    this.db.close();
  }
}
