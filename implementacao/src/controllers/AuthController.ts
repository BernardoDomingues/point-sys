import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { Student } from '../models/Student';

export class AuthController {
  private userModel = new User();
  private studentModel = new Student();
  private jwtSecret = process.env.JWT_SECRET || 'academic-merit-secret-key';

  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: 'Email e senha são obrigatórios' });
        return;
      }

      const user = await this.userModel.findByEmail(email);
      if (!user) {
        res.status(401).json({ error: 'Credenciais inválidas' });
        return;
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        res.status(401).json({ error: 'Credenciais inválidas' });
        return;
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, type: user.type },
        this.jwtSecret,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Login realizado com sucesso',
        token,
        user: {
          id: user.id,
          email: user.email,
          type: user.type
        }
      });
    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  public async registerStudent(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, name, cpf, rg, address, institution_id, course } = req.body;

      if (!email || !password || !name || !cpf || !institution_id) {
        res.status(400).json({ error: 'Campos obrigatórios: email, senha, nome, CPF e instituição' });
        return;
      }

      const existingUser = await this.userModel.findByEmail(email);
      if (existingUser) {
        res.status(400).json({ error: 'Email já cadastrado' });
        return;
      }

      const existingStudent = await this.studentModel.findByCpf(cpf);
      if (existingStudent) {
        res.status(400).json({ error: 'CPF já cadastrado' });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.userModel.create({
        email,
        password: hashedPassword,
        type: 'student',
        is_active: true
      });

      const student = await this.studentModel.create({
        user_id: user.id,
        name,
        cpf,
        rg,
        address,
        institution_id,
        course
      });

      res.status(201).json({
        message: 'Aluno cadastrado com sucesso',
        student: {
          id: student.id,
          name: student.name,
          email: user.email
        }
      });
    } catch (error) {
      console.error('Erro no cadastro:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  public async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const userType = (req as any).user.type;

      let profile = null;

      if (userType === 'student') {
        profile = await this.studentModel.findByUserId(userId);
      }

      if (!profile) {
        res.status(404).json({ error: 'Perfil não encontrado' });
        return;
      }

      res.json({ profile });
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}
