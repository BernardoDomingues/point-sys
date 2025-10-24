import { Request, Response } from 'express';
import { Company } from '../models/Company';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import { CNPJ } from 'cpf-cnpj-validator';

export class CompanyController {
  private companyModel = new Company();
  private userModel = new User();

  // CREATE - Criar nova empresa parceira
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const { 
        name, 
        email, 
        password, 
        cnpj, 
        description, 
        address, 
        phone, 
        website 
      } = req.body;

      // Validações
      if (!name || !email || !password || !cnpj) {
        res.status(400).json({ error: 'Campos obrigatórios: name, email, password, cnpj' });
        return;
      }

      // Validar CNPJ
      if (!CNPJ.isValid(cnpj)) {
        res.status(400).json({ error: 'CNPJ inválido' });
        return;
      }

      // Verificar se email já existe
      const existingUser = await this.userModel.findByEmail(email);
      if (existingUser) {
        res.status(400).json({ error: 'Email já cadastrado' });
        return;
      }

      // Verificar se CNPJ já existe
      const existingCompany = await this.companyModel.findByCnpj(cnpj);
      if (existingCompany) {
        res.status(400).json({ error: 'CNPJ já cadastrado' });
        return;
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);

      // Criar usuário
      const userData = {
        email,
        password: hashedPassword,
        type: 'company' as const,
        is_active: true
      };

      const user = await this.userModel.create(userData);

      // Criar empresa
      const companyData = {
        user_id: user.id,
        name,
        cnpj,
        description,
        address,
        phone,
        email,
        website,
        is_active: true
      };

      const company = await this.companyModel.create(companyData);

      res.status(201).json({
        message: 'Empresa parceira criada com sucesso',
        company: {
          id: company.id,
          name: company.name,
          email: user.email,
          cnpj: company.cnpj,
          description: company.description,
          address: company.address,
          phone: company.phone,
          website: company.website,
          is_active: company.is_active,
          created_at: company.created_at
        }
      });
    } catch (error) {
      console.error('Erro ao criar empresa:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // READ - Listar todas as empresas
  public async findAll(req: Request, res: Response): Promise<void> {
    try {
      const companies = await this.companyModel.findAll();
      res.json({ companies });
    } catch (error) {
      console.error('Erro ao listar empresas:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // READ - Listar apenas empresas ativas
  public async findActive(req: Request, res: Response): Promise<void> {
    try {
      const companies = await this.companyModel.findActive();
      res.json({ companies });
    } catch (error) {
      console.error('Erro ao listar empresas ativas:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // READ - Buscar empresa por ID
  public async findById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const companyId = parseInt(id);

      if (isNaN(companyId)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
      }

      const company = await this.companyModel.findById(companyId);
      if (!company) {
        res.status(404).json({ error: 'Empresa não encontrada' });
        return;
      }

      res.json({ company });
    } catch (error) {
      console.error('Erro ao buscar empresa:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // READ - Buscar empresa por CNPJ
  public async findByCnpj(req: Request, res: Response): Promise<void> {
    try {
      const { cnpj } = req.params;

      if (!CNPJ.isValid(cnpj)) {
        res.status(400).json({ error: 'CNPJ inválido' });
        return;
      }

      const company = await this.companyModel.findByCnpj(cnpj);
      if (!company) {
        res.status(404).json({ error: 'Empresa não encontrada' });
        return;
      }

      res.json({ company });
    } catch (error) {
      console.error('Erro ao buscar empresa por CNPJ:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // UPDATE - Atualizar empresa
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const companyId = parseInt(id);
      const updateData = req.body;

      if (isNaN(companyId)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
      }

      // Verificar se empresa existe
      const existingCompany = await this.companyModel.findById(companyId);
      if (!existingCompany) {
        res.status(404).json({ error: 'Empresa não encontrada' });
        return;
      }

      // Validar CNPJ se fornecido
      if (updateData.cnpj && !CNPJ.isValid(updateData.cnpj)) {
        res.status(400).json({ error: 'CNPJ inválido' });
        return;
      }

      // Verificar se CNPJ já existe (se diferente do atual)
      if (updateData.cnpj && updateData.cnpj !== existingCompany.cnpj) {
        const cnpjExists = await this.companyModel.findByCnpj(updateData.cnpj);
        if (cnpjExists) {
          res.status(400).json({ error: 'CNPJ já cadastrado' });
          return;
        }
      }

      const success = await this.companyModel.update(companyId, updateData);
      if (!success) {
        res.status(400).json({ error: 'Erro ao atualizar empresa' });
        return;
      }

      // Buscar empresa atualizada
      const updatedCompany = await this.companyModel.findById(companyId);
      res.json({
        message: 'Empresa atualizada com sucesso',
        company: updatedCompany
      });
    } catch (error) {
      console.error('Erro ao atualizar empresa:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // DELETE - Deletar empresa
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const companyId = parseInt(id);

      if (isNaN(companyId)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
      }

      // Verificar se empresa existe
      const existingCompany = await this.companyModel.findById(companyId);
      if (!existingCompany) {
        res.status(404).json({ error: 'Empresa não encontrada' });
        return;
      }

      const success = await this.companyModel.delete(companyId);
      if (!success) {
        res.status(400).json({ error: 'Erro ao deletar empresa' });
        return;
      }

      res.json({ message: 'Empresa deletada com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar empresa:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // TOGGLE - Ativar/Desativar empresa
  public async toggleActive(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const companyId = parseInt(id);

      if (isNaN(companyId)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
      }

      // Verificar se empresa existe
      const existingCompany = await this.companyModel.findById(companyId);
      if (!existingCompany) {
        res.status(404).json({ error: 'Empresa não encontrada' });
        return;
      }

      const success = await this.companyModel.toggleActive(companyId);
      if (!success) {
        res.status(400).json({ error: 'Erro ao alterar status da empresa' });
        return;
      }

      // Buscar empresa atualizada
      const updatedCompany = await this.companyModel.findById(companyId);
      res.json({
        message: `Empresa ${updatedCompany.is_active ? 'ativada' : 'desativada'} com sucesso`,
        company: updatedCompany
      });
    } catch (error) {
      console.error('Erro ao alterar status da empresa:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Buscar empresas por nome (busca parcial)
  public async searchByName(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.query;
      
      if (!name || typeof name !== 'string') {
        res.status(400).json({ error: 'Parâmetro name é obrigatório' });
        return;
      }

      const companies = await this.companyModel.findAll();
      const filteredCompanies = companies.filter(company => 
        company.name.toLowerCase().includes(name.toLowerCase())
      );

      res.json({ companies: filteredCompanies });
    } catch (error) {
      console.error('Erro ao buscar empresas por nome:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}
