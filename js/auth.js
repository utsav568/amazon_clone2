// ============================================
// Authentication Module
// ============================================

const Auth = {
    currentUser: null,

    init() {
        // Check for existing session
        const savedUser = Utils.storage.get('currentUser');
        if (savedUser) {
            this.currentUser = savedUser;
            this.updateUI();
        }

        this.bindEvents();
    },

    bindEvents() {
        // Sign In Button
        const signInBtn = document.getElementById('sign-in-btn');
        if (signInBtn) {
            signInBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.openModal('sign-in');
            });
        }

        // Register Link
        const registerLink = document.getElementById('register-link');
        if (registerLink) {
            registerLink.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.openModal('register');
            });
        }

        // Close Modal
        const closeModalBtn = document.getElementById('close-auth-modal');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => this.closeModal());
        }

        // Click outside modal to close
        const modal = document.getElementById('auth-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }

        // Toggle between sign in and register
        const showRegister = document.getElementById('show-register');
        const showLogin = document.getElementById('show-login');

        if (showRegister) {
            showRegister.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleForms('register');
            });
        }

        if (showLogin) {
            showLogin.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleForms('sign-in');
            });
        }

        // Login Form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Signup Form
        const signupForm = document.getElementById('signup-form');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSignup();
            });
        }

        // Logout Button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
    },

    openModal(formType = 'sign-in') {
        const modal = document.getElementById('auth-modal');
        if (modal) {
            modal.classList.add('active');
            this.toggleForms(formType);
        }
    },

    closeModal() {
        const modal = document.getElementById('auth-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    },

    toggleForms(formType) {
        const signInForm = document.getElementById('sign-in-form');
        const registerForm = document.getElementById('register-form');

        if (formType === 'register') {
            signInForm.style.display = 'none';
            registerForm.style.display = 'block';
        } else {
            signInForm.style.display = 'block';
            registerForm.style.display = 'none';
        }
    },

    handleLogin() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        // Get users from storage
        const users = Utils.storage.get('users') || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            this.currentUser = {
                id: user.id,
                name: user.name,
                email: user.email
            };
            Utils.storage.set('currentUser', this.currentUser);
            this.updateUI();
            this.closeModal();
            Utils.showToast(`Welcome back, ${user.name}!`, 'success');
        } else {
            Utils.showToast('Invalid email or password', 'error');
        }
    },

    handleSignup() {
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm').value;

        // Validation
        if (!Utils.isValidEmail(email)) {
            Utils.showToast('Please enter a valid email address', 'error');
            return;
        }

        if (password.length < 6) {
            Utils.showToast('Password must be at least 6 characters', 'error');
            return;
        }

        if (password !== confirmPassword) {
            Utils.showToast('Passwords do not match', 'error');
            return;
        }

        // Check if user already exists
        const users = Utils.storage.get('users') || [];
        if (users.find(u => u.email === email)) {
            Utils.showToast('An account with this email already exists', 'error');
            return;
        }

        // Create new user
        const newUser = {
            id: Utils.generateId(),
            name,
            email,
            password,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        Utils.storage.set('users', users);

        // Auto login
        this.currentUser = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email
        };
        Utils.storage.set('currentUser', this.currentUser);

        this.updateUI();
        this.closeModal();
        Utils.showToast(`Welcome to Amazon Clone, ${name}!`, 'success');
    },

    logout() {
        this.currentUser = null;
        Utils.storage.remove('currentUser');
        this.updateUI();
        Utils.showToast('You have been signed out', 'info');
    },

    updateUI() {
        const authNav = document.getElementById('auth-nav');
        const signInBtn = document.getElementById('sign-in-btn');
        const logoutBtn = document.getElementById('logout-btn');

        if (this.currentUser) {
            // Update header greeting
            const navLine1 = authNav.querySelector('.nav-line-1');
            if (navLine1) {
                navLine1.textContent = `Hello, ${this.currentUser.name.split(' ')[0]}`;
            }

            // Update dropdown
            if (signInBtn) {
                signInBtn.textContent = 'Your Account';
            }
            if (logoutBtn) {
                logoutBtn.style.display = 'block';
            }
        } else {
            // Reset header greeting
            const navLine1 = authNav?.querySelector('.nav-line-1');
            if (navLine1) {
                navLine1.textContent = 'Hello, Sign in';
            }

            // Reset dropdown
            if (signInBtn) {
                signInBtn.textContent = 'Sign In';
            }
            if (logoutBtn) {
                logoutBtn.style.display = 'none';
            }
        }
    },

    isLoggedIn() {
        return this.currentUser !== null;
    },

    getUser() {
        return this.currentUser;
    },

    requireAuth(callback) {
        if (this.isLoggedIn()) {
            callback();
        } else {
            Utils.showToast('Please sign in to continue', 'info');
            this.openModal('sign-in');
        }
    }
};

// Make Auth globally available
window.Auth = Auth;
