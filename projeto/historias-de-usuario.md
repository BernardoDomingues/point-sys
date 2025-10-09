# Histórias de Usuário — Sistema de Mérito Acadêmico

## Visão Geral
O sistema de mérito acadêmico permite que **professores** reconheçam alunos através da distribuição de moedas virtuais, que podem ser trocadas por **vantagens** oferecidas por **empresas parceiras**. O sistema contempla autenticação, cadastro, gerenciamento de transações e notificações por email.

---

## Histórias de Usuário — Aluno

### 1. Cadastro de Aluno
**Como** aluno,  
**quero** me cadastrar informando meus dados pessoais (nome, email, CPF, RG, endereço, instituição e curso),  
**para** poder participar do sistema de mérito e receber moedas dos professores.  

**Critérios de Aceitação:**
- O aluno deve escolher uma instituição previamente cadastrada.  
- Todos os campos obrigatórios devem ser validados.  
- Após o cadastro, o aluno deve receber um email de confirmação.

---

### 2. Login e Autenticação
**Como** aluno,  
**quero** fazer login com meu email e senha,  
**para** acessar minha conta e visualizar minhas moedas e transações.

**Critérios de Aceitação:**
- Autenticação deve validar credenciais.  
- Acesso negado em caso de dados incorretos.  

---

### 3. Receber Moedas
**Como** aluno,  
**quero** receber moedas de professores,  
**para** ser reconhecido por meu bom desempenho acadêmico.  

**Critérios de Aceitação:**
- Recebimento deve aumentar o saldo do aluno.  
- O aluno deve receber um email de notificação com o motivo do reconhecimento.  

---

### 4. Consultar Extrato
**Como** aluno,  
**quero** visualizar meu extrato de transações,  
**para** saber quantas moedas tenho e o histórico de recebimentos e trocas.

**Critérios de Aceitação:**
- O extrato deve exibir todas as transações ordenadas por data.  
- Deve mostrar saldo atual e descrição das operações.  

---

### 5. Trocar Moedas por Vantagens
**Como** aluno,  
**quero** resgatar vantagens cadastradas no sistema,  
**para** usufruir dos benefícios oferecidos pelas empresas parceiras.  

**Critérios de Aceitação:**
- O sistema deve verificar se o aluno possui saldo suficiente.  
- Após o resgate, o saldo deve ser atualizado.  
- O aluno deve receber um email com o cupom e código da transação.  
- O parceiro deve receber um email de confirmação da troca.  

---

## Histórias de Usuário — Professor

### 6. Professor Pré-Cadastrado
**Como** professor,  
**quero** estar previamente cadastrado pela minha instituição,  
**para** poder acessar o sistema sem precisar realizar o cadastro manualmente.  

**Critérios de Aceitação:**
- Cada professor deve estar vinculado a uma instituição.  
- Dados obrigatórios: nome, CPF e departamento.  

---

### 7. Login e Autenticação
**Como** professor,  
**quero** realizar login com meu email e senha,  
**para** acessar minhas funcionalidades no sistema.  

**Critérios de Aceitação:**
- Autenticação deve validar credenciais.  
- Acesso negado se dados estiverem incorretos.  

---

### 8. Receber Moedas Semestrais
**Como** professor,  
**quero** receber automaticamente 1.000 moedas a cada semestre,  
**para** poder distribuir aos alunos em reconhecimento ao mérito.  

**Critérios de Aceitação:**
- O saldo é acumulável entre semestres.  
- O sistema deve adicionar 1.000 moedas no início de cada semestre.  

---

### 9. Enviar Moedas a Aluno
**Como** professor,  
**quero** enviar moedas a um aluno, informando o valor e o motivo,  
**para** reconhecer seu bom comportamento ou desempenho.  

**Critérios de Aceitação:**
- O professor deve ter saldo suficiente.  
- O motivo do envio é obrigatório.  
- O saldo do professor é atualizado após a transação.  
- O aluno deve receber um email de notificação.  

---

### 10. Consultar Extrato
**Como** professor,  
**quero** consultar meu extrato de transações,  
**para** acompanhar o saldo atual e as moedas distribuídas.  

**Critérios de Aceitação:**
- Deve listar todas as transações de envio com data, aluno e motivo.  
- Exibir saldo atual de moedas.  

---

## Histórias de Usuário — Empresa Parceira

### 11. Cadastro de Empresa
**Como** empresa parceira,  
**quero** me cadastrar no sistema informando meus dados e login,  
**para** poder oferecer vantagens aos alunos.  

**Critérios de Aceitação:**
- Campos obrigatórios: nome da empresa, email, CNPJ, endereço e senha.  
- O sistema deve validar CNPJ e email.  

---

### 12. Cadastrar Vantagem
**Como** empresa parceira,  
**quero** cadastrar vantagens com descrição, foto e custo em moedas,  
**para** disponibilizá-las aos alunos para troca.  

**Critérios de Aceitação:**
- O campo de descrição e imagem são obrigatórios.  
- Deve ser possível editar ou remover vantagens.  

---

### 13. Receber Notificação de Troca
**Como** empresa parceira,  
**quero** receber um email sempre que um aluno resgatar uma vantagem,  
**para** validar o cupom e entregar o benefício corretamente.  

**Critérios de Aceitação:**
- O email deve conter o código da transação e os dados do aluno.  

---

## Histórias de Sistema / Administração

### 14. Cadastro de Instituições
**Como** administrador,  
**quero** cadastrar instituições de ensino,  
**para** que os alunos e professores possam estar vinculados a elas.  

---

### 15. Autenticação Unificada
**Como** sistema,  
**quero** autenticar todos os usuários (alunos, professores e empresas) por login e senha,  
**para** garantir segurança e controle de acesso.  

---

### 16. Envio de Notificações Automáticas
**Como** sistema,  
**quero** enviar notificações automáticas por email em eventos (recebimento de moedas, troca de vantagens, etc.),  
**para** manter os usuários informados.  

---

### 17. Geração de Código de Troca
**Como** sistema,  
**quero** gerar automaticamente um código único para cada troca de vantagem,  
**para** facilitar a conferência entre aluno e parceiro.  

---

### 18. Controle de Saldo e Transações
**Como** sistema,  
**quero** gerenciar o saldo de moedas de alunos e professores,  
**para** garantir que todas as transações sejam registradas e consistentes.  

---

### 19. Gestão Semestral de Créditos
**Como** sistema,  
**quero** adicionar 1.000 moedas ao saldo de cada professor no início de cada semestre,  
**para** garantir o funcionamento do programa de mérito.  

---

