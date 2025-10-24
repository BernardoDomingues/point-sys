# API Documentation - Sistema de Mérito Acadêmico

## Base URL
```
http://localhost:3000/api
```

## Autenticação
A maioria dos endpoints requer autenticação via Bearer Token no header:
```
Authorization: Bearer <token>
```

---

## 📚 CRUD de ALUNOS

### 1. Criar Aluno
**POST** `/api/students`

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123",
  "cpf": "12345678901",
  "rg": "123456789",
  "address": "Rua das Flores, 123",
  "institution_id": 1,
  "course": "Ciência da Computação"
}
```

**Resposta (201):**
```json
{
  "message": "Aluno criado com sucesso",
  "student": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@email.com",
    "cpf": "12345678901",
    "rg": "123456789",
    "address": "Rua das Flores, 123",
    "institution_id": 1,
    "course": "Ciência da Computação",
    "created_at": "2024-01-01T10:00:00.000Z"
  }
}
```

### 2. Listar Todos os Alunos
**GET** `/api/students`
*Requer autenticação*

**Resposta (200):**
```json
{
  "students": [
    {
      "id": 1,
      "user_id": 1,
      "name": "João Silva",
      "cpf": "12345678901",
      "rg": "123456789",
      "address": "Rua das Flores, 123",
      "institution_id": 1,
      "course": "Ciência da Computação",
      "created_at": "2024-01-01T10:00:00.000Z",
      "email": "joao@email.com",
      "institution_name": "Universidade Federal"
    }
  ]
}
```

### 3. Buscar Aluno por ID
**GET** `/api/students/:id`
*Requer autenticação*

**Resposta (200):**
```json
{
  "student": {
    "id": 1,
    "user_id": 1,
    "name": "João Silva",
    "cpf": "12345678901",
    "rg": "123456789",
    "address": "Rua das Flores, 123",
    "institution_id": 1,
    "course": "Ciência da Computação",
    "created_at": "2024-01-01T10:00:00.000Z",
    "email": "joao@email.com",
    "institution_name": "Universidade Federal"
  }
}
```

### 4. Buscar Aluno por CPF
**GET** `/api/students/cpf/:cpf`
*Requer autenticação*

**Resposta (200):**
```json
{
  "student": {
    "id": 1,
    "user_id": 1,
    "name": "João Silva",
    "cpf": "12345678901",
    "rg": "123456789",
    "address": "Rua das Flores, 123",
    "institution_id": 1,
    "course": "Ciência da Computação",
    "created_at": "2024-01-01T10:00:00.000Z"
  }
}
```

### 5. Buscar Alunos por Instituição
**GET** `/api/students/institution/:institutionId`
*Requer autenticação*

**Resposta (200):**
```json
{
  "students": [
    {
      "id": 1,
      "user_id": 1,
      "name": "João Silva",
      "cpf": "12345678901",
      "institution_id": 1,
      "course": "Ciência da Computação",
      "created_at": "2024-01-01T10:00:00.000Z"
    }
  ]
}
```

### 6. Atualizar Aluno
**PUT** `/api/students/:id`
*Requer autenticação*

**Body:**
```json
{
  "name": "João Silva Santos",
  "address": "Rua das Flores, 456",
  "course": "Engenharia de Software"
}
```

**Resposta (200):**
```json
{
  "message": "Aluno atualizado com sucesso",
  "student": {
    "id": 1,
    "user_id": 1,
    "name": "João Silva Santos",
    "cpf": "12345678901",
    "address": "Rua das Flores, 456",
    "institution_id": 1,
    "course": "Engenharia de Software",
    "created_at": "2024-01-01T10:00:00.000Z"
  }
}
```

### 7. Deletar Aluno
**DELETE** `/api/students/:id`
*Requer autenticação*

**Resposta (200):**
```json
{
  "message": "Aluno deletado com sucesso"
}
```

---

## 🏢 CRUD de EMPRESAS PARCEIRAS

### 1. Criar Empresa Parceira
**POST** `/api/companies`

**Body:**
```json
{
  "name": "Tech Solutions Ltda",
  "email": "contato@techsolutions.com",
  "password": "senha123",
  "cnpj": "12345678000195",
  "description": "Empresa de tecnologia especializada em soluções inovadoras",
  "address": "Av. Paulista, 1000",
  "phone": "(11) 99999-9999",
  "website": "https://techsolutions.com"
}
```

**Resposta (201):**
```json
{
  "message": "Empresa parceira criada com sucesso",
  "company": {
    "id": 1,
    "name": "Tech Solutions Ltda",
    "email": "contato@techsolutions.com",
    "cnpj": "12345678000195",
    "description": "Empresa de tecnologia especializada em soluções inovadoras",
    "address": "Av. Paulista, 1000",
    "phone": "(11) 99999-9999",
    "website": "https://techsolutions.com",
    "is_active": true,
    "created_at": "2024-01-01T10:00:00.000Z"
  }
}
```

### 2. Listar Todas as Empresas
**GET** `/api/companies`
*Requer autenticação*

**Resposta (200):**
```json
{
  "companies": [
    {
      "id": 1,
      "user_id": 1,
      "name": "Tech Solutions Ltda",
      "cnpj": "12345678000195",
      "description": "Empresa de tecnologia especializada em soluções inovadoras",
      "address": "Av. Paulista, 1000",
      "phone": "(11) 99999-9999",
      "email": "contato@techsolutions.com",
      "website": "https://techsolutions.com",
      "is_active": true,
      "created_at": "2024-01-01T10:00:00.000Z",
      "user_email": "contato@techsolutions.com"
    }
  ]
}
```

### 3. Listar Apenas Empresas Ativas
**GET** `/api/companies/active`
*Requer autenticação*

**Resposta (200):**
```json
{
  "companies": [
    {
      "id": 1,
      "user_id": 1,
      "name": "Tech Solutions Ltda",
      "cnpj": "12345678000195",
      "is_active": true,
      "created_at": "2024-01-01T10:00:00.000Z"
    }
  ]
}
```

### 4. Buscar Empresa por ID
**GET** `/api/companies/:id`
*Requer autenticação*

**Resposta (200):**
```json
{
  "company": {
    "id": 1,
    "user_id": 1,
    "name": "Tech Solutions Ltda",
    "cnpj": "12345678000195",
    "description": "Empresa de tecnologia especializada em soluções inovadoras",
    "address": "Av. Paulista, 1000",
    "phone": "(11) 99999-9999",
    "email": "contato@techsolutions.com",
    "website": "https://techsolutions.com",
    "is_active": true,
    "created_at": "2024-01-01T10:00:00.000Z",
    "user_email": "contato@techsolutions.com"
  }
}
```

### 5. Buscar Empresa por CNPJ
**GET** `/api/companies/cnpj/:cnpj`
*Requer autenticação*

**Resposta (200):**
```json
{
  "company": {
    "id": 1,
    "user_id": 1,
    "name": "Tech Solutions Ltda",
    "cnpj": "12345678000195",
    "is_active": true,
    "created_at": "2024-01-01T10:00:00.000Z"
  }
}
```

### 6. Buscar Empresas por Nome
**GET** `/api/companies/search?name=Tech`
*Requer autenticação*

**Resposta (200):**
```json
{
  "companies": [
    {
      "id": 1,
      "name": "Tech Solutions Ltda",
      "cnpj": "12345678000195",
      "is_active": true
    }
  ]
}
```

### 7. Atualizar Empresa
**PUT** `/api/companies/:id`
*Requer autenticação*

**Body:**
```json
{
  "name": "Tech Solutions Brasil Ltda",
  "description": "Empresa líder em tecnologia",
  "phone": "(11) 88888-8888"
}
```

**Resposta (200):**
```json
{
  "message": "Empresa atualizada com sucesso",
  "company": {
    "id": 1,
    "user_id": 1,
    "name": "Tech Solutions Brasil Ltda",
    "cnpj": "12345678000195",
    "description": "Empresa líder em tecnologia",
    "phone": "(11) 88888-8888",
    "is_active": true,
    "updated_at": "2024-01-01T11:00:00.000Z"
  }
}
```

### 8. Ativar/Desativar Empresa
**PATCH** `/api/companies/:id/toggle`
*Requer autenticação*

**Resposta (200):**
```json
{
  "message": "Empresa desativada com sucesso",
  "company": {
    "id": 1,
    "name": "Tech Solutions Ltda",
    "is_active": false,
    "updated_at": "2024-01-01T11:00:00.000Z"
  }
}
```

### 9. Deletar Empresa
**DELETE** `/api/companies/:id`
*Requer autenticação*

**Resposta (200):**
```json
{
  "message": "Empresa deletada com sucesso"
}
```

---

## 🔐 Endpoints de Autenticação

### Login
**POST** `/api/auth/login`

**Body:**
```json
{
  "email": "joao@email.com",
  "password": "senha123"
}
```

**Resposta (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "joao@email.com",
    "type": "student"
  }
}
```

### Cadastro de Aluno
**POST** `/api/auth/register/student`

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123",
  "cpf": "12345678901",
  "institution_id": 1
}
```

---

## 📊 Códigos de Status HTTP

- **200**: Sucesso
- **201**: Criado com sucesso
- **400**: Dados inválidos
- **401**: Não autorizado
- **404**: Não encontrado
- **500**: Erro interno do servidor

---

## 🚨 Validações

### Aluno
- **name**: Obrigatório, string
- **email**: Obrigatório, formato de email válido, único
- **password**: Obrigatório, string
- **cpf**: Obrigatório, CPF válido, único
- **institution_id**: Obrigatório, número
- **rg**: Opcional, string
- **address**: Opcional, string
- **course**: Opcional, string

### Empresa
- **name**: Obrigatório, string
- **email**: Obrigatório, formato de email válido, único
- **password**: Obrigatório, string
- **cnpj**: Obrigatório, CNPJ válido, único
- **description**: Opcional, string
- **address**: Opcional, string
- **phone**: Opcional, string
- **website**: Opcional, string

---

## 🔧 Exemplos de Uso

### Criar um aluno:
```bash
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Silva",
    "email": "maria@email.com",
    "password": "senha123",
    "cpf": "98765432100",
    "institution_id": 1,
    "course": "Medicina"
  }'
```

### Listar empresas ativas:
```bash
curl -X GET http://localhost:3000/api/companies/active \
  -H "Authorization: Bearer <token>"
```

### Buscar empresa por nome:
```bash
curl -X GET "http://localhost:3000/api/companies/search?name=Tech" \
  -H "Authorization: Bearer <token>"
```
