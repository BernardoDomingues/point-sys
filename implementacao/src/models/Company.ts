import { DatabaseManager } from '../database/DatabaseManager';

export interface ICompany {
  id: number;
  user_id: number;
  name: string;
  cnpj: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export class Company {
  private db = DatabaseManager.getInstance().getDb();

  public async create(companyData: Omit<ICompany, 'id' | 'created_at' | 'updated_at'>): Promise<ICompany> {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(`
        INSERT INTO companies (user_id, name, cnpj, description, address, phone, email, website, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        companyData.user_id,
        companyData.name,
        companyData.cnpj,
        companyData.description,
        companyData.address,
        companyData.phone,
        companyData.email,
        companyData.website,
        companyData.is_active,
        function(err) {
          if (err) {
            reject(err);
          } else {
            const findStmt = this.db.prepare('SELECT * FROM companies WHERE id = ?');
            findStmt.get(this.lastID, (err, row) => {
              if (err) {
                reject(err);
              } else {
                resolve(row as ICompany);
              }
            });
          }
        }
      );
    });
  }

  public findById(id: number): Promise<ICompany | null> {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(`
        SELECT c.*, u.email as user_email
        FROM companies c
        JOIN users u ON c.user_id = u.id
        WHERE c.id = ?
      `);
      stmt.get(id, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row as ICompany | null);
        }
      });
    });
  }

  public findByUserId(userId: number): Promise<ICompany | null> {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(`
        SELECT c.*, u.email as user_email
        FROM companies c
        JOIN users u ON c.user_id = u.id
        WHERE c.user_id = ?
      `);
      stmt.get(userId, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row as ICompany | null);
        }
      });
    });
  }

  public findByCnpj(cnpj: string): Promise<ICompany | null> {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare('SELECT * FROM companies WHERE cnpj = ?');
      stmt.get(cnpj, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row as ICompany | null);
        }
      });
    });
  }

  public findAll(): Promise<ICompany[]> {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(`
        SELECT c.*, u.email as user_email
        FROM companies c
        JOIN users u ON c.user_id = u.id
        ORDER BY c.created_at DESC
      `);
      stmt.all((err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as ICompany[]);
        }
      });
    });
  }

  public findActive(): Promise<ICompany[]> {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(`
        SELECT c.*, u.email as user_email
        FROM companies c
        JOIN users u ON c.user_id = u.id
        WHERE c.is_active = 1
        ORDER BY c.created_at DESC
      `);
      stmt.all((err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as ICompany[]);
        }
      });
    });
  }

  public update(id: number, companyData: Partial<ICompany>): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const fields = Object.keys(companyData).filter(key => key !== 'id' && key !== 'user_id');
      const setClause = fields.map(field => `${field} = ?`).join(', ');
      const values = fields.map(field => companyData[field as keyof ICompany]);

      const stmt = this.db.prepare(`UPDATE companies SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`);
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
      const stmt = this.db.prepare('DELETE FROM companies WHERE id = ?');
      stmt.run(id, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }

  public toggleActive(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(`
        UPDATE companies 
        SET is_active = NOT is_active, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `);
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
