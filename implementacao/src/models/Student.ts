import { DatabaseManager } from '../database/DatabaseManager';

export interface IStudent {
  id: number;
  user_id: number;
  name: string;
  cpf: string;
  rg?: string;
  address?: string;
  institution_id: number;
  course?: string;
  created_at: string;
}

export class Student {
  private db = DatabaseManager.getInstance().getDb();

  public async create(studentData: Omit<IStudent, 'id' | 'created_at'>): Promise<IStudent> {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(`
        INSERT INTO students (user_id, name, cpf, rg, address, institution_id, course)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        studentData.user_id,
        studentData.name,
        studentData.cpf,
        studentData.rg,
        studentData.address,
        studentData.institution_id,
        studentData.course,
        function(err) {
          if (err) {
            reject(err);
          } else {
            const findStmt = this.db.prepare('SELECT * FROM students WHERE id = ?');
            findStmt.get(this.lastID, (err, row) => {
              if (err) {
                reject(err);
              } else {
                resolve(row as IStudent);
              }
            });
          }
        }
      );
    });
  }

  public findById(id: number): Promise<IStudent | null> {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(`
        SELECT s.*, u.email, i.name as institution_name
        FROM students s
        JOIN users u ON s.user_id = u.id
        JOIN institutions i ON s.institution_id = i.id
        WHERE s.id = ?
      `);
      stmt.get(id, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row as IStudent | null);
        }
      });
    });
  }

  public findByUserId(userId: number): Promise<IStudent | null> {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(`
        SELECT s.*, u.email, i.name as institution_name
        FROM students s
        JOIN users u ON s.user_id = u.id
        JOIN institutions i ON s.institution_id = i.id
        WHERE s.user_id = ?
      `);
      stmt.get(userId, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row as IStudent | null);
        }
      });
    });
  }

  public findByCpf(cpf: string): Promise<IStudent | null> {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare('SELECT * FROM students WHERE cpf = ?');
      stmt.get(cpf, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row as IStudent | null);
        }
      });
    });
  }

  public findAll(): Promise<IStudent[]> {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(`
        SELECT s.*, u.email, i.name as institution_name
        FROM students s
        JOIN users u ON s.user_id = u.id
        JOIN institutions i ON s.institution_id = i.id
        ORDER BY s.created_at DESC
      `);
      stmt.all((err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as IStudent[]);
        }
      });
    });
  }

  public update(id: number, studentData: Partial<IStudent>): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const fields = Object.keys(studentData).filter(key => key !== 'id' && key !== 'user_id');
      const setClause = fields.map(field => `${field} = ?`).join(', ');
      const values = fields.map(field => studentData[field as keyof IStudent]);

      const stmt = this.db.prepare(`UPDATE students SET ${setClause} WHERE id = ?`);
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
      const stmt = this.db.prepare('DELETE FROM students WHERE id = ?');
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