// Sistema de Mérito Acadêmico - Frontend JavaScript
class AcademicMeritApp {
    constructor() {
        this.apiBase = '/api';
        this.token = localStorage.getItem('token');
        this.currentUser = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuth();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.showSection(section);
            });
        });

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });

        // Forms
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin(e);
        });

        document.getElementById('registerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister(e);
        });

        document.getElementById('sendCoinsForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSendCoins(e);
        });
    }

    async checkAuth() {
        if (this.token) {
            try {
                const response = await this.apiCall('/auth/profile', 'GET');
                if (response.ok) {
                    this.currentUser = await response.json();
                    this.showDashboard();
                } else {
                    this.logout();
                }
            } catch (error) {
                console.error('Erro ao verificar autenticação:', error);
                this.logout();
            }
        } else {
            this.showSection('login');
        }
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        const activeLink = document.querySelector(`[data-section="${sectionName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Load dashboard data if needed
        if (sectionName === 'dashboard' && this.currentUser) {
            this.loadDashboardData();
        }
    }

    showDashboard() {
        this.showSection('dashboard');
        
        // Update navigation for authenticated user
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.dataset.section === 'login' || link.dataset.section === 'register') {
                link.style.display = 'none';
            }
        });
        
        document.getElementById('logoutBtn').style.display = 'inline-block';
        document.querySelector('[data-section="dashboard"]').style.display = 'inline-block';
    }

    async handleLogin(e) {
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        this.showLoading(true);

        try {
            const response = await this.apiCall('/auth/login', 'POST', data);
            const result = await response.json();

            if (response.ok) {
                this.token = result.token;
                this.currentUser = result.user;
                localStorage.setItem('token', this.token);
                
                this.showToast('Login realizado com sucesso!', 'success');
                this.showDashboard();
            } else {
                this.showToast(result.error || 'Erro no login', 'error');
            }
        } catch (error) {
            console.error('Erro no login:', error);
            this.showToast('Erro de conexão', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async handleRegister(e) {
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        this.showLoading(true);

        try {
            const response = await this.apiCall('/auth/register/student', 'POST', data);
            const result = await response.json();

            if (response.ok) {
                this.showToast('Cadastro realizado com sucesso!', 'success');
                this.showSection('login');
                e.target.reset();
            } else {
                this.showToast(result.error || 'Erro no cadastro', 'error');
            }
        } catch (error) {
            console.error('Erro no cadastro:', error);
            this.showToast('Erro de conexão', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async handleSendCoins(e) {
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        this.showLoading(true);

        try {
            const response = await this.apiCall('/transactions/send', 'POST', data);
            const result = await response.json();

            if (response.ok) {
                this.showToast('Moedas enviadas com sucesso!', 'success');
                e.target.reset();
                this.loadDashboardData();
            } else {
                this.showToast(result.error || 'Erro ao enviar moedas', 'error');
            }
        } catch (error) {
            console.error('Erro ao enviar moedas:', error);
            this.showToast('Erro de conexão', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async loadDashboardData() {
        try {
            // Load balance
            const balanceResponse = await this.apiCall('/transactions/balance', 'GET');
            if (balanceResponse.ok) {
                const balanceData = await balanceResponse.json();
                document.getElementById('balanceAmount').textContent = balanceData.balance;
            }

            // Load transactions
            const transactionsResponse = await this.apiCall('/transactions', 'GET');
            if (transactionsResponse.ok) {
                const transactionsData = await transactionsResponse.json();
                this.displayTransactions(transactionsData.transactions);
            }

            // Update user info
            if (this.currentUser) {
                document.getElementById('userInfo').textContent = 
                    `${this.currentUser.email} (${this.currentUser.type})`;
            }
        } catch (error) {
            console.error('Erro ao carregar dados do dashboard:', error);
        }
    }

    displayTransactions(transactions) {
        const container = document.getElementById('transactionsList');
        
        if (!transactions || transactions.length === 0) {
            container.innerHTML = `
                <div class="no-transactions">
                    <i class="fas fa-inbox"></i>
                    <p>Nenhuma transação encontrada</p>
                </div>
            `;
            return;
        }

        container.innerHTML = transactions.map(transaction => `
            <div class="transaction-item">
                <div class="transaction-info">
                    <div class="transaction-reason">${transaction.reason || 'Transação'}</div>
                    <div class="transaction-date">${new Date(transaction.created_at).toLocaleString('pt-BR')}</div>
                </div>
                <div class="transaction-amount ${transaction.to_user_id === this.currentUser.id ? 'positive' : 'negative'}">
                    ${transaction.to_user_id === this.currentUser.id ? '+' : '-'}${transaction.amount}
                </div>
            </div>
        `).join('');
    }

    async apiCall(endpoint, method = 'GET', data = null) {
        const url = `${this.apiBase}${endpoint}`;
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (this.token) {
            options.headers['Authorization'] = `Bearer ${this.token}`;
        }

        if (data && method !== 'GET') {
            options.body = JSON.stringify(data);
        }

        return fetch(url, options);
    }

    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (show) {
            overlay.classList.add('show');
        } else {
            overlay.classList.remove('show');
        }
    }

    showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
        toast.innerHTML = `
            <i class="${icon}"></i>
            <span>${message}</span>
        `;

        container.appendChild(toast);

        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 100);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => container.removeChild(toast), 300);
        }, 3000);
    }

    logout() {
        this.token = null;
        this.currentUser = null;
        localStorage.removeItem('token');
        
        // Reset navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.style.display = 'inline-block';
        });
        document.getElementById('logoutBtn').style.display = 'none';
        
        this.showSection('login');
        this.showToast('Logout realizado com sucesso!', 'success');
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AcademicMeritApp();
});
