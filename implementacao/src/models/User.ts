import { DatabaseManager } from '../database/DatabaseManager';

export interface IUser {
  id: number;
  email: string;
  password: string;
  type: 'student' | 'professor' | 'company' | 'admin';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export class User {
  private db = DatabaseManager.getInstance().getDb();

  public async create(userData: Omit<IUser, 'id' | 'created_at' | 'updated_at'>): Promise<IUser> {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(`
        INSERT INTO users (email, password, type, is_active)
        VALUES (?, ?, ?, ?)
      `);

      stmt.run(userData.email, userData.password, userData.type, userData.is_active, function(err) {
        if (err) {
          reject(err);
        } else {
          const findStmt = this.db.prepare('SELECT * FROM users WHERE id = ?');
          findStmt.get(this.lastID, (err, row) => {
            if (err) {
              reject(err);
            } else {
              resolve(row as IUser);
            }
          });
        }
      });
    });
  }

  public findById(id: number): Promise<IUser | null> {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare('SELECT * FROM users WHERE id = ?');
      stmt.get(id, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row as IUser | null);
        }
      });
    });
  }

  public findByEmail(email: string): Promise<IUser | null> {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare('SELECT * FROM users WHERE email = ?');
      stmt.get(email, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row as IUser | null);
        }
      });
    });
  }

  public findAll(): Promise<IUser[]> {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare('SELECT * FROM users ORDER BY created_at DESC');
      stmt.all((err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as IUser[]);
        }
      });
    });
  }

  public update(id: number, userData: Partial<IUser>): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const fields = Object.keys(userData).filter(key => key !== 'id');
      const setClause = fields.map(field => `${field} = ?`).join(', ');
      const values = fields.map(field => userData[field as keyof IUser]);

      const stmt = this.db.prepare(`UPDATE users SET ${setClause} WHERE id = ?`);
      stmt.run(...values, id, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }

  public delete(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare('DELETE FROM users WHERE id = ?');
      stmt.run(id, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }
}