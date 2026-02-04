const app = {
    currentView: 'dashboard',
    selectedUserId: null,
    baseUrl: '/api',
    currentUser: null,
    authMode: 'login', // 'login' or 'register'

    init() {
        console.log('App initializing...');
        try {
            // const savedUser = localStorage.getItem('shuttle_user') || localStorage.getItem('currentUser');
            // if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
            //     this.currentUser = JSON.parse(savedUser);
            //     console.log('User found in storage:', this.currentUser.email);
            //     this.showApp();
            // } else {
            //     console.log('No user in storage, showing login.');
            //     this.showLogin();
            // }

            // Forcing Login Page as Entry Page as requested
            this.showLogin();
        } catch (e) {
            console.error('Initialization error:', e);
            this.showLogin();
        }
        this.setupEventListeners();
    },

    setupEventListeners() {
        const actionBtn = document.getElementById('action-btn');
        if (actionBtn) actionBtn.addEventListener('click', () => this.handleHeaderAction());

        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.onsubmit = (e) => this.handleLogin(e);
        }

        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.onsubmit = (e) => this.handleRegister(e);
        }

        const toggleLink = document.getElementById('auth-toggle-link');
        if (toggleLink) {
            toggleLink.onclick = (e) => {
                e.preventDefault();
                this.toggleAuthMode();
            };
        }
    },

    showLogin() {
        const loginContainer = document.getElementById('login-container');
        const appContainer = document.getElementById('app-container');
        if (loginContainer) loginContainer.style.display = 'flex';
        if (appContainer) appContainer.style.display = 'none';
        console.log('Login screen shown');
    },

    showApp() {
        const loginContainer = document.getElementById('login-container');
        const appContainer = document.getElementById('app-container');
        const userDisplay = document.getElementById('user-display');

        if (loginContainer) loginContainer.style.display = 'none';
        if (appContainer) appContainer.style.display = 'flex';
        if (userDisplay && this.currentUser) {
            userDisplay.textContent = this.currentUser.userName || 'User';
        }

        console.log('App screen shown');
        this.renderSidebar();
        this.navigate('dashboard');
    },

    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const errorEl = document.getElementById('login-error');

        console.log('Attempting login for:', email);
        try {
            const response = await fetch(`${this.baseUrl}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const user = await response.json();
                this.currentUser = user;
                localStorage.setItem('shuttle_user', JSON.stringify(user));
                this.showApp();
            } else {
                const msg = await response.text();
                errorEl.textContent = msg || 'Invalid credentials';
                errorEl.style.display = 'block';
            }
        } catch (error) {
            console.error('Login error:', error);
            errorEl.textContent = 'Server error. Please check your connection.';
            errorEl.style.display = 'block';
        }
    },

    async handleRegister(e) {
        e.preventDefault();
        const userName = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const phone = document.getElementById('reg-phone').value;
        const password = document.getElementById('reg-password').value;
        const errorEl = document.getElementById('login-error');

        console.log('Attempting registration for:', email);
        try {
            const response = await fetch(`${this.baseUrl}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userName, email, phone, password })
            });

            if (response.ok) {
                const user = await response.json();
                alert('Registration successful! Please login.');
                this.toggleAuthMode();
            } else {
                const msg = await response.text();
                errorEl.textContent = msg || 'Registration failed';
                errorEl.style.display = 'block';
            }
        } catch (error) {
            console.error('Registration error:', error);
            errorEl.textContent = 'Server error. Please check your connection.';
            errorEl.style.display = 'block';
        }
    },

    toggleAuthMode() {
        this.authMode = this.authMode === 'login' ? 'register' : 'login';
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        const title = document.getElementById('auth-title');
        const toggleText = document.getElementById('auth-toggle-text');
        const toggleLink = document.getElementById('auth-toggle-link');
        const errorEl = document.getElementById('login-error');

        if (errorEl) errorEl.style.display = 'none';

        if (this.authMode === 'login') {
            if (loginForm) loginForm.style.display = 'block';
            if (registerForm) registerForm.style.display = 'none';
            if (title) title.textContent = 'Welcome Back';
            if (toggleText) toggleText.textContent = "Don't have an account?";
            if (toggleLink) toggleLink.textContent = 'Sign Up';
        } else {
            if (loginForm) loginForm.style.display = 'none';
            if (registerForm) registerForm.style.display = 'block';
            if (title) title.textContent = 'Create Account';
            if (toggleText) toggleText.textContent = "Already have an account?";
            if (toggleLink) toggleLink.textContent = 'Sign In';
        }
    },

    logout() {
        localStorage.removeItem('shuttle_user');
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        this.showLogin();
    },

    renderSidebar() {
        const nav = document.getElementById('nav-container');
        if (!nav || !this.currentUser) return;

        const isAdmin = this.currentUser.userRole === 'ADMIN';
        console.log('renderSidebar isAdmin=', isAdmin, 'userRole=', this.currentUser.userRole);

        nav.innerHTML = `
            <ul class="nav-links">
                <li class="nav-item active" onclick="app.navigate('dashboard')">
                    <i data-lucide="layout-dashboard"></i> Dashboard
                </li>
                ${isAdmin ? `
                    <li class="nav-item" onclick="app.navigate('users')">
                        <i data-lucide="users"></i> Members
                    </li>
                    <li class="nav-item" onclick="app.navigate('subscriptions')">
                        <i data-lucide="credit-card"></i> Subscriptions
                    </li>
                    <li class="nav-item" onclick="app.navigate('attendance')">
                        <i data-lucide="calendar"></i> Attendance
                    </li>
                    <li class="nav-item" onclick="app.navigate('reviews')">
                        <i data-lucide="star"></i> Reviews
                    </li>
                ` : `
                    <li class="nav-item" onclick="app.navigate('plans')">
                        <i data-lucide="package"></i> Plans
                    </li>
                    <li class="nav-item" onclick="app.navigate('myProfile')">
                        <i data-lucide="user"></i> My Profile
                    </li>
                    <li class="nav-item" onclick="app.navigate('attendance')">
                        <i data-lucide="calendar"></i> Attendance
                    </li>
                    <li class="nav-item" onclick="app.navigate('reviews')">
                        <i data-lucide="star"></i> Reviews
                    </li>
                `}
            </ul>
        `;
        this.safeLucide();
        console.log('renderSidebar injected nav:', nav.innerHTML);
    },

    async navigate(view, params = {}) {
        console.log('Navigating to:', view);
        this.currentView = view;
        this.selectedUserId = params.userId || null;

        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.textContent.toLowerCase().includes(view.toLowerCase()) && view !== 'memberDetails') {
                item.classList.add('active');
            }
        });

        // View-specific class for theming
        document.body.className = ''; // Reset classes
        if (view === 'dashboard') {
            document.body.classList.add('view-dashboard');
        }

        const title = document.getElementById('view-title');
        const actionBtn = document.getElementById('action-btn');

        if (title) title.textContent = view === 'myProfile' ? 'My Profile' : (view === 'memberDetails' ? 'Member Details' : view.charAt(0).toUpperCase() + view.slice(1));

        if (actionBtn) {
            actionBtn.style.display = 'none';
            if (view === 'dashboard' && this.currentUser.userRole === 'ADMIN') {
                actionBtn.style.display = 'flex';
                actionBtn.innerHTML = '<i data-lucide="user-plus"></i> New User';
            } else if (view === 'users') {
                actionBtn.style.display = 'flex';
                actionBtn.innerHTML = '<i data-lucide="user-plus"></i> Add User';
            } else if (view === 'subscriptions') {
                actionBtn.style.display = 'flex';
                actionBtn.innerHTML = '<i data-lucide="plus-circle"></i> New Subscription';
            }
        }

        try {
            if (view === 'dashboard') await this.renderDashboard();
            else if (view === 'users') await this.renderUsers();
            else if (view === 'subscriptions') await this.renderSubscriptions();
            else if (view === 'plans') await this.renderPlans();
            else if (view === 'memberDetails' || view === 'myProfile') {
                const userId = view === 'myProfile' ? this.currentUser.userId : this.selectedUserId;
                await this.renderMemberDetails(userId);
            } else if (view === 'reviews') await this.renderReviews();
            else if (view === 'attendance') await this.renderAttendance(this.currentUser.userId);
            else if (view === 'payment') await this.renderPayment(params.planId);
        } catch (e) {
            console.error('Navigation render error:', e);
        }

        this.safeLucide();
    },

    async fetchData(endpoint) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`);
            if (!response.ok) return [];
            return await response.json();
        } catch (error) {
            console.error('Fetch error:', endpoint, error);
            return [];
        }
    },

    async renderDashboard() {
        const content = document.getElementById('content');
        if (!content) return;

        if (this.currentUser.userRole === 'ADMIN') {
            const users = await this.fetchData('/users');
            const subs = await this.fetchData('/subscriptions');
            const payments = await this.fetchData('/payments');

            const planStats = subs.reduce((acc, s) => {
                const plan = s.membershipType?.typeName || 'Other';
                acc[plan] = (acc[plan] || 0) + 1;
                return acc;
            }, {});

            content.innerHTML = `
                <div class="badminton-hero">
                    <div class="hero-content">
                        <h2>Smash Your Way to Fitness!</h2>
                        <p>Track your stats, manage bookings, and dominate the court.</p>
                    </div>
                    <img src="images/badminton-neon.png" alt="Badminton Neon" class="hero-image">
                </div>
                <div class="grid">
                    <div class="card stat-card">
                        <span class="stat-label">Total Members</span>
                        <span class="stat-value">${Array.isArray(users) ? users.length : 0}</span>
                    </div>
                    <div class="card stat-card">
                        <span class="stat-label">Active Subscriptions</span>
                        <span class="stat-value">${Array.isArray(subs) ? subs.filter(s => s.status === 'Active').length : 0}</span>
                    </div>
                    <div class="card stat-card">
                        <span class="stat-label">Total Revenue</span>
                        <span class="stat-value">$${Array.isArray(payments) ? payments.reduce((acc, curr) => acc + (curr.amount || 0), 0).toFixed(2) : '0.00'}</span>
                    </div>
                </div>
                <div class="card" style="margin-top: 2rem;">
                    <h3>Plan Breakdown</h3>
                    <div class="grid" style="grid-template-columns: repeat(3, 1fr); margin-top: 1rem;">
                        ${Object.entries(planStats).map(([plan, count]) => `
                            <div style="padding: 1rem; border: 1px solid var(--border); border-radius: var(--radius); text-align: center;">
                                <div style="font-weight: 600; color: var(--primary);">${plan}</div>
                                <div style="font-size: 1.5rem; font-weight: 700;">${count}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        } else {
            const userId = this.currentUser.userId;
            const subs = await this.fetchData(`/subscriptions/user/${userId}`);
            const payments = await this.fetchData(`/payments/user/${userId}`);
            const activeSub = Array.isArray(subs) ? subs.find(s => s.status === 'Active') : null;

            content.innerHTML = `
                <div class="badminton-hero">
                    <div class="hero-content">
                        <h2>Welcome Back, Champion!</h2>
                        <p>Ready for your next match? Here is your activity overview.</p>
                    </div>
                    <img src="images/badminton-neon.png" alt="Badminton Neon" class="hero-image">
                </div>
                <h1 style="margin-bottom: 2rem;">Hello, ${this.currentUser.userName}</h1>

                <div class="card" style="margin-top: 2rem;">
                    <h3>My Subscriptions</h3>
                    <div class="table-container" style="margin-top: 1rem; border: none; box-shadow: none;">
                        <table style="width: 100%;">
                            <thead>
                                <tr>
                                    <th>Plan</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${Array.isArray(subs) && subs.length > 0 ? subs.map(s => `
                                    <tr>
                                        <td style="font-weight: 600;">${s.membershipType?.typeName || 'Unknown'}</td>
                                        <td>${s.startDate}</td>
                                        <td>${s.endDate}</td>
                                        <td>
                                            <span class="status ${s.status === 'Active' ? 'status-active' : 'status-pending'}">
                                                ${s.status}
                                            </span>
                                        </td>
                                    </tr>
                                `).join('') : '<tr><td colspan="4" style="text-align: center; padding: 2rem; color: var(--text-muted);">No subscription history found.</td></tr>'}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        }
    },

    async renderUsers() {
        const users = await this.fetchData('/users');
        const content = document.getElementById('content');
        if (!content) return;

        content.innerHTML = `
            <div class="table-container">
                <table>
                    <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
                    <tbody>
                        ${Array.isArray(users) ? users.map(u => `
                            <tr>
                                <td>${u.userName}</td>
                                <td>${u.email}</td>
                                <td>${u.userRole || 'User'}</td>
                                <td><button class="btn btn-sm btn-primary" onclick="app.navigate('memberDetails', {userId: ${u.userId}})">View</button></td>
                            </tr>
                        `).join('') : ''}
                    </tbody>
                </table>
            </div>
        `;
    },

    async renderMemberDetails(userId) {
        const user = await this.fetchData(`/users/${userId}`);
        const subs = await this.fetchData(`/subscriptions/user/${userId}`);
        const payments = await this.fetchData(`/payments/user/${userId}`);
        const content = document.getElementById('content');
        if (!content || !user) return;

        content.innerHTML = `
            <div class="card">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                        <h3>Member: ${user.userName}</h3>
                        <p style="color: var(--text-secondary); margin-top: 0.5rem;">Email: ${user.email}</p>
                        <p style="color: var(--text-secondary);">Phone: ${user.phone}</p>
                    </div>
                    <button class="btn btn-outline" onclick="app.openEditProfileModal(${user.userId})">
                        <i data-lucide="edit-3"></i> Update Profile
                    </button>
                </div>
            </div>
            <div class="table-container" style="margin-top: 2rem;">
                <h3>Subscriptions</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Plan</th>
                            <th>Status</th>
                            <th>End Date</th>
                            ${this.currentUser.userRole === 'ADMIN' ? '<th>Actions</th>' : ''}
                        </tr>
                    </thead>
                    <tbody>
                        ${Array.isArray(subs) ? subs.map(s => `
                            <tr>
                                <td>${s.membershipType?.typeName}</td>
                                <td>
                                    <span class="status ${s.status === 'Active' ? 'status-active' : 'status-inactive'}">
                                        ${s.status}
                                    </span>
                                </td>
                                <td>${s.endDate}</td>
                                ${this.currentUser.userRole === 'ADMIN' ? `
                                    <td>
                                        <button class="btn btn-sm btn-outline" style="padding: 0.5rem 1rem; font-size: 0.75rem;" onclick="app.toggleSubscription(${s.subscriptionId})">
                                            ${s.status === 'Active' ? 'Deactivate' : 'Activate'}
                                        </button>
                                    </td>
                                ` : ''}
                            </tr>
                        `).join('') : ''}
                    </tbody>
                </table>
            </div>
        `;
    },

    async renderReviews() {
        const reviews = await this.fetchData('/customer-reviews');
        const content = document.getElementById('content');
        if (!content) return;

        content.innerHTML = `
            ${this.currentUser.userRole !== 'ADMIN' ? `
            <div style="display: flex; justify-content: flex-end; margin-bottom: 2rem;">
                <button class="btn btn-primary" onclick="app.openAddReviewModal()">
                    <i data-lucide="plus"></i> Add Review
                </button>
            </div>
            ` : ''}
            <div class="grid">
                ${Array.isArray(reviews) && reviews.length > 0 ? reviews.map(r => `
                    <div class="card">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
                            <div style="display: flex; gap: 4px; color: #fbbf24;">${this.renderStars(r.rating)}</div>
                            <div style="color: var(--text-secondary); font-size: 0.8rem;">Review #${r.reviewId}</div>
                        </div>
                        <p style="font-style: italic; color: var(--text-primary);">"${r.comments}"</p>
                    </div>
                `).join('') : '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">No reviews yet. Be the first!</p>'}
            </div>
        `;
        this.safeLucide();
    },

    async renderSubscriptions() {
        const subs = await this.fetchData('/subscriptions');
        const content = document.getElementById('content');
        if (!content) return;

        if (!Array.isArray(subs) || subs.length === 0) {
            content.innerHTML = '<div class="card"><p>No subscriptions found.</p></div>';
            return;
        }

        const grouped = subs.reduce((acc, s) => {
            const plan = s.membershipType?.typeName || 'Other';
            if (!acc[plan]) acc[plan] = [];
            acc[plan].push(s);
            return acc;
        }, {});

        content.innerHTML = Object.entries(grouped).map(([plan, items]) => `
            <div class="card" style="margin-bottom: 2rem;">
                <h3 style="margin-bottom: 1rem; color: var(--primary);">${plan} Plan</h3>
                <div class="table-container" style="margin-top: 0;">
                    <table>
                        <thead><tr><th>User</th><th>Status</th><th>End Date</th></tr></thead>
                        <tbody>
                            ${items.map(s => `
                                <tr>
                                    <td>${s.user?.userName || 'Unknown'}</td>
                                    <td><span class="status ${s.status === 'Active' ? 'status-active' : 'status-pending'}">${s.status}</span></td>
                                    <td>${s.endDate}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `).join('');
    },

    async renderPlans() {
        const plans = await this.fetchData('/plans');
        const content = document.getElementById('content');
        if (!content) return;

        content.innerHTML = `
            <div class="plans-row">
                ${Array.isArray(plans) && plans.length > 0 ? plans.map(p => `
                    <div class="card plan-card" style="display: flex; flex-direction: column; align-items: center; text-align: center; padding: 2rem;">
                        <h3 class="plan-name" style="color: var(--primary); font-size: 1.5rem;">${p.typeName}</h3>
                        <div class="plan-price" style="font-size: 2.5rem; font-weight: 800; margin: 1.5rem 0;">
                            $${p.price.toFixed(2)}<span style="font-size: 1rem; color: var(--text-muted);">/${p.durationInMonths}mo</span>
                        </div>
                        <ul style="list-style: none; margin-bottom: 2rem; color: var(--text-muted); text-align: left; width: 100%;">
                            <li style="margin-bottom: 0.5rem;"><i data-lucide="check" style="width: 16px; color: #10b981; margin-right: 0.5rem;"></i> Full Access</li>
                            <li style="margin-bottom: 0.5rem;"><i data-lucide="check" style="width: 16px; color: #10b981; margin-right: 0.5rem;"></i> Priority Support</li>
                            <li><i data-lucide="check" style="width: 16px; color: #10b981; margin-right: 0.5rem;"></i> Cancel Anytime</li>
                        </ul>
                        <button class="btn btn-primary" style="width: 100%; justify-content: center;" onclick="app.handleChoosePlan(${p.typeId})">Choose Plan</button>
                    </div>
                `).join('') : '<p style="text-align:center; padding: 2rem; width: 100%;">No plans available at the moment.</p>'}
            </div>
        `;
        this.safeLucide();
    },

    async handleChoosePlan(typeId) {
        this.navigate('payment', { planId: typeId });
    },

    async renderPayment(planId) {
        const content = document.getElementById('content');
        if (!content) return;

        try {
            const plans = await this.fetchData('/plans');
            const plan = plans.find(p => p.typeId == planId);
            if (!plan) {
                content.innerHTML = '<div class="card"><p>Plan not found.</p><button class="btn btn-primary" onclick="app.navigate(\'plans\')">Back to Plans</button></div>';
                return;
            }

            content.innerHTML = `
                <div class="card" style="max-width: 800px; margin: 0 auto;">
                    <h2 style="margin-bottom: 2rem; text-align: center;">Complete Your Subscription</h2>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
                        <!-- Plan Details -->
                        <div style="padding: 1.5rem; background: rgba(255,255,255,0.03); border-radius: var(--radius); border: 1px solid var(--border);">
                            <h3 style="color: var(--primary); margin-bottom: 1rem;">Plan Details</h3>
                            <div style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem;">${plan.typeName}</div>
                            <div style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem;">$${plan.price.toFixed(2)}</div>
                            <div style="color: var(--text-muted);">Duration: ${plan.durationInMonths} Months</div>
                        </div>

                        <!-- User Details -->
                        <div style="padding: 1.5rem; background: rgba(255,255,255,0.03); border-radius: var(--radius); border: 1px solid var(--border);">
                            <h3 style="color: var(--primary); margin-bottom: 1rem;">Billing To</h3>
                            <div style="margin-bottom: 0.5rem;"><strong>Name:</strong> ${this.currentUser.userName}</div>
                            <div style="margin-bottom: 0.5rem;"><strong>Email:</strong> ${this.currentUser.email}</div>
                            <div style="margin-bottom: 0.5rem;"><strong>Phone:</strong> ${this.currentUser.phone}</div>
                        </div>
                    </div>

                    <!-- Payment Section -->
                    <div style="text-align: center; border-top: 1px solid var(--border); padding-top: 2rem;">
                        <h3 style="margin-bottom: 1.5rem;">Scan to Pay</h3>
                        
                        <div style="background: white; padding: 1rem; display: inline-block; border-radius: var(--radius); margin-bottom: 1.5rem;">
                            <!-- Dummy QR Code -->
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ShuttleClub_Plan_${plan.typeId}_User_${this.currentUser.userId}" alt="Payment QR Code" style="width: 200px; height: 200px; display: block;">
                        </div>
                        
                        <p style="color: var(--text-muted); margin-bottom: 2rem;">Scan the QR code with your UPI app or banking app to complete the payment.</p>

                        <div style="display: flex; gap: 1rem; justify-content: center;">
                            <button class="btn btn-outline" onclick="app.navigate('plans')">Cancel</button>
                            <button class="btn btn-primary" onclick="app.processPayment(${plan.typeId})">
                                <i data-lucide="check-circle"></i> Confirm Payment Made
                            </button>
                        </div>
                    </div>
                </div>
            `;
            this.safeLucide();

        } catch (error) {
            console.error('Render payment error:', error);
            content.innerHTML = '<div class="card"><p>Error loading payment details.</p></div>';
        }
    },

    async processPayment(typeId) {
        console.log('Processing payment for plan:', typeId);

        try {
            const plans = await this.fetchData('/plans');
            const plan = plans.find(p => p.typeId == typeId);
            if (!plan) throw new Error('Plan not found during processing');

            // 1. Create Subscription
            const startDate = new Date().toISOString().split('T')[0];
            const endDate = new Date(new Date().setMonth(new Date().getMonth() + plan.durationInMonths)).toISOString().split('T')[0];

            const subResponse = await fetch(`${this.baseUrl}/subscriptions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user: { userId: this.currentUser.userId },
                    membershipType: { typeId: typeId },
                    startDate: startDate,
                    endDate: endDate,
                    status: 'Active'
                })
            });

            if (!subResponse.ok) throw new Error('Subscription creation failed');
            const subscription = await subResponse.json();

            // 2. Create Payment Record
            const payResponse = await fetch(`${this.baseUrl}/payments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: plan.price,
                    paymentDate: startDate,
                    user: { userId: this.currentUser.userId },
                    subscription: { subscriptionId: subscription.subscriptionId }
                })
            });

            if (!payResponse.ok) throw new Error('Payment recording failed');

            alert('Payment Confirmed! Successfully subscribed to ' + plan.typeName + '.');
            this.navigate('dashboard');
        } catch (error) {
            console.error('Subscription error:', error);
            alert('Error: ' + error.message);
        }
    },

    handleHeaderAction() {
        if (this.currentView === 'users' || this.currentView === 'dashboard') this.showUserForm();
        else if (this.currentView === 'subscriptions') this.showSubscriptionForm();
        else if (this.currentView === 'memberDetails' || this.currentView === 'myProfile') {
            this.showUserForm(this.currentView === 'myProfile' ? this.currentUser.userId : this.selectedUserId);
        }
    },

    async showUserForm(userId = null) {
        // Implementation similar to before, simplified for robustness
        alert('Form requested for user: ' + userId);
    },

    closeModal() {
        const modal = document.getElementById('modal');
        if (modal) modal.style.display = 'none';
    },
    async openEditProfileModal(userId) {
        console.log('Opening edit profile for user:', userId);
        const user = await this.fetchData(`/users/${userId}`);
        if (!user || user.length === 0) {
            console.error('User not found for ID:', userId);
            return;
        }

        const modalTitle = document.getElementById('modal-title');
        const mainForm = document.getElementById('main-form');
        const modal = document.getElementById('modal');

        modalTitle.innerText = 'Update Profile';
        mainForm.innerHTML = `
            <div class="form-group">
                <label>Full Name</label>
                <input type="text" id="edit-name" value="${user.userName}" required>
            </div>
            <div class="form-group">
                <label>Email Address</label>
                <input type="email" id="edit-email" value="${user.email}" required>
            </div>
            <div class="form-group">
                <label>Phone Number</label>
                <input type="tel" id="edit-phone" value="${user.phone}" required>
            </div>
            <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                <button type="submit" class="btn btn-primary" style="flex: 1; justify-content: center;">Save Changes</button>
                <button type="button" class="btn btn-outline" style="flex: 1; justify-content: center;" onclick="app.closeModal()">Cancel</button>
            </div>
        `;

        mainForm.onsubmit = (e) => this.handleUpdateProfile(e, userId);
        modal.style.display = 'grid';
    },

    async handleUpdateProfile(e, userId) {
        e.preventDefault();
        const updatedUser = {
            userName: document.getElementById('edit-name').value,
            email: document.getElementById('edit-email').value,
            phone: document.getElementById('edit-phone').value
        };

        try {
            const response = await fetch(`${this.baseUrl}/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedUser)
            });

            if (!response.ok) throw new Error('Update failed');

            const result = await response.json();

            if (this.currentUser && this.currentUser.userId === userId) {
                this.currentUser = { ...this.currentUser, ...result };
                localStorage.setItem('shuttle_user', JSON.stringify(this.currentUser));
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                this.renderSidebar();
            }

            alert('Profile updated successfully!');
            this.closeModal();

            if (this.currentView === 'myProfile' || this.currentView === 'memberDetails') {
                await this.renderMemberDetails(userId);
            }
        } catch (error) {
            console.error('Update error:', error);
            alert('Error: ' + error.message);
        }
    },

    openAddReviewModal() {
        const modalTitle = document.getElementById('modal-title');
        const mainForm = document.getElementById('main-form');
        const modal = document.getElementById('modal');

        modalTitle.innerText = 'Write a Review';
        mainForm.innerHTML = `
            <div class="form-group">
                <label>Rating (1-5)</label>
                <select id="review-rating" style="width: 100%; padding: 1rem; background: rgba(255,255,255,0.05); border: 1px solid var(--border-glass); border-radius: var(--radius-md); color: var(--text-primary); outline: none;" required>
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Good</option>
                    <option value="3">3 - Average</option>
                    <option value="2">2 - Poor</option>
                    <option value="1">1 - Terrible</option>
                </select>
            </div>
            <div class="form-group">
                <label>Comments</label>
                <textarea id="review-comments" rows="4" style="width: 100%; padding: 1rem; background: rgba(255,255,255,0.05); border: 1px solid var(--border-glass); border-radius: var(--radius-md); color: var(--text-primary); outline: none; resize: vertical;" required placeholder="Share your experience..."></textarea>
            </div>
            <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                <button type="submit" class="btn btn-primary" style="flex: 1; justify-content: center;">Submit Review</button>
                <button type="button" class="btn btn-outline" style="flex: 1; justify-content: center;" onclick="app.closeModal()">Cancel</button>
            </div>
        `;

        mainForm.onsubmit = (e) => this.handleAddReview(e);
        modal.style.display = 'grid';
    },

    async handleAddReview(e) {
        e.preventDefault();
        const rating = document.getElementById('review-rating').value;
        const comments = document.getElementById('review-comments').value;

        try {
            const response = await fetch(`${this.baseUrl}/customer-reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerId: this.currentUser.userId,
                    rating: parseInt(rating),
                    comments: comments,
                    subscription: null
                })
            });

            if (!response.ok) throw new Error('Failed to submit review');

            alert('Review submitted successfully!');
            this.closeModal();
            this.navigate('reviews');
        } catch (error) {
            console.error('Review submission error:', error);
            alert('Error: ' + error.message);
        }
    },

    safeLucide() {
        if (window.lucide) {
            window.lucide.createIcons();
        } else {
            console.warn('Lucide not loaded');
        }
    },

    async renderAttendance(userId) {
        const attendance = await this.fetchData(`/attendance/user/${userId}`);
        const content = document.getElementById('content');
        if (!content) return;

        content.innerHTML = `
            <div class="card">
                <h3>Attendance History</h3>
                <div class="table-container" style="margin-top: 1rem;">
                    <table style="width: 100%;">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Check In</th>
                                <th>Check Out</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${Array.isArray(attendance) && attendance.length > 0 ? attendance.map(a => `
                                <tr>
                                    <td>${a.date}</td>
                                    <td>${a.checkInTime}</td>
                                    <td>${a.checkOutTime}</td>
                                    <td>
                                        <span class="status status-active">Present</span>
                                    </td>
                                </tr>
                            `).join('') : '<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 2rem;">No attendance records found.</td></tr>'}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        this.safeLucide();
    },

    renderStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<i data-lucide="star" fill="currentColor" style="width: 16px; height: 16px;"></i>';
            } else {
                stars += '<i data-lucide="star" style="width: 16px; height: 16px; color: var(--text-secondary); opacity: 0.5;"></i>';
            }
        }
        return stars;
    },

    async toggleSubscription(subId) {
        if (!confirm('Are you sure you want to change the status of this subscription?')) return;

        try {
            const response = await fetch(`${this.baseUrl}/subscriptions/${subId}/toggle`, {
                method: 'PUT'
            });

            if (!response.ok) throw new Error('Failed to toggle status');

            const updatedSub = await response.json();
            alert('Subscription status updated to: ' + updatedSub.status);

            // Refresh current view
            if (this.currentView === 'memberDetails') {
                const userId = this.selectedUserId || (this.currentUser.userRole === 'ADMIN' ? updatedSub.user?.userId : this.currentUser.userId);
                this.renderMemberDetails(userId);
            } else {
                this.navigate(this.currentView);
            }
        } catch (error) {
            console.error('Toggle status error:', error);
            alert('Error: ' + error.message);
        }
    }
};

document.addEventListener('DOMContentLoaded', () => app.init());
