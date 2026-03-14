document.addEventListener("DOMContentLoaded", () => {
    // --- 1. ELEMENTS ---
    const sections = {
        home: document.getElementById('homeSection'),
        register: document.getElementById('registerSection'),
        verify: document.getElementById('verifySection'),
        login: document.getElementById('loginSection'),
        profile: document.getElementById('profileSection'),
        employees: document.getElementById('employeeSection'),
        departments: document.getElementById('deptSection'),
        accounts: document.getElementById('accountSection')
    };

    const navItems = {
        login: document.getElementById('navLogin'),
        register: document.getElementById('navRegister'),
        profile: document.getElementById('navProfile'),
        employees: document.getElementById('navEmployees'),
        departments: document.getElementById('navDepartments'),
        accounts: document.getElementById('navAccounts'),
        logout: document.getElementById('logoutBtn'),
        brand: document.getElementById('brandLink'),
        userDropdown: document.getElementById('userDropdown'),
        usernameDisplay: document.getElementById('usernameDisplay'),
        adminOnlyLinks: document.querySelectorAll('.admin-link'),
        guestLinks: document.querySelectorAll('.guest-only')
    };

    const forms = {
        register: document.getElementById('registerForm'),
        login: document.getElementById('loginForm'),
        employee: document.getElementById('employeeForm'),
        department: document.getElementById('deptForm'),
        account: document.getElementById('accountForm') // Added account form
    };

    const empTableBody = document.getElementById('employeeTableBody');
    const deptTableBody = document.getElementById('deptTableBody');
    const accountTableBody = document.getElementById('accountTableBody');
    const empDeptSelect = document.getElementById('empDept');

    // --- 2. CORE FUNCTIONS ---

    const hideAll = () => {
        Object.values(sections).forEach(section => {
            if (section) section.classList.add('d-none');
        });
    };

    const showSection = (name) => {
        hideAll();
        if (sections[name]) sections[name].classList.remove('d-none');
    };

    const populateDeptDropdown = () => {
        if (!empDeptSelect) return;
        
        const departments = JSON.parse(localStorage.getItem('departments')) || [
            { name: "Engineering", description: "Software team" },
            { name: "HR", description: "Human Resources" }
        ];

        empDeptSelect.innerHTML = '<option value="" selected disabled>Select Department</option>';
        
        departments.forEach(dept => {
            const option = document.createElement('option');
            option.value = dept.name;
            option.textContent = dept.name;
            empDeptSelect.appendChild(option);
        });
    };

    // --- PHASE 6: ACCOUNTS LOGIC (UPDATED) ---
    const renderAccounts = () => {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        if (!accountTableBody) return;
        accountTableBody.innerHTML = '';

        // Add hardcoded admin to display for visual completeness if list is empty
        if (users.length === 0) {
            accountTableBody.innerHTML = `
                <tr>
                    <td>Admin User</td>
                    <td>admin@example.com</td>
                    <td>Admin</td>
                    <td>✅</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary" disabled>Edit</button>
                        <button class="btn btn-sm btn-outline-warning" disabled>Reset Password</button>
                        <button class="btn btn-sm btn-outline-danger" disabled>Delete</button>
                    </td>
                </tr>
            `;
            return;
        }

        users.forEach((user, index) => {
            accountTableBody.innerHTML += `
                <tr>
                    <td>${user.firstName} ${user.lastName}</td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                    <td>${user.isVerified ? '✅' : '❌'}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary" onclick="editAccount(${index})">Edit</button>
                        <button class="btn btn-sm btn-outline-warning" onclick="resetPassword(${index})">Reset Password</button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteAccount(${index})">Delete</button>
                    </td>
                </tr>
            `;
        });
    };

    window.resetPassword = (index) => {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        alert("A password reset link has been simulated for: " + users[index].email);
    };

    window.editAccount = (index) => {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users[index];
        document.getElementById('accFirstName').value = user.firstName;
        document.getElementById('accLastName').value = user.lastName;
        document.getElementById('accEmail').value = user.email;
        document.getElementById('accPassword').value = user.password;
        document.getElementById('accRole').value = user.role;
        document.getElementById('accVerified').checked = user.isVerified;
        
        // Remove old entry so "Save" updates it
        window.currentEditIndex = index;
    };

    window.deleteAccount = (index) => {
        if(confirm("Are you sure you want to delete this account?")) {
            let users = JSON.parse(localStorage.getItem('users')) || [];
            users.splice(index, 1);
            localStorage.setItem('users', JSON.stringify(users));
            renderAccounts();
        }
    };

    // --- EMPLOYEE & DEPT LOGIC ---
    const renderEmployees = () => {
        const employees = JSON.parse(localStorage.getItem('employees')) || [];
        if (!empTableBody) return;
        empTableBody.innerHTML = '';

        if (employees.length === 0) {
            empTableBody.innerHTML = '<tr><td colspan="5" class="bg-light py-3">No employees.</td></tr>';
            return;
        }

        employees.forEach((emp, index) => {
            empTableBody.innerHTML += `
                <tr>
                    <td>${emp.id}</td>
                    <td>${emp.email}</td>
                    <td>${emp.position}</td>
                    <td>${emp.dept}</td>
                    <td>
                        <button class="btn btn-sm btn-danger" onclick="deleteEmployee(${index})">Delete</button>
                    </td>
                </tr>
            `;
        });
    };

    window.deleteEmployee = (index) => {
        let employees = JSON.parse(localStorage.getItem('employees')) || [];
        employees.splice(index, 1);
        localStorage.setItem('employees', JSON.stringify(employees));
        renderEmployees();
    };

    const renderDepartments = () => {
        const departments = JSON.parse(localStorage.getItem('departments')) || [
            { name: "Engineering", description: "Software team" },
            { name: "HR", description: "Human Resources" }
        ];
        if (!deptTableBody) return;
        deptTableBody.innerHTML = '';

        departments.forEach((dept, index) => {
            deptTableBody.innerHTML += `
                <tr>
                    <td>${dept.name}</td>
                    <td>${dept.description}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteDept(${index})">Delete</button>
                    </td>
                </tr>
            `;
        });
        populateDeptDropdown();
    };

    window.deleteDept = (index) => {
        let departments = JSON.parse(localStorage.getItem('departments')) || [];
        departments.splice(index, 1);
        localStorage.setItem('departments', JSON.stringify(departments));
        renderDepartments();
    };

    const updateUIForLoggedInUser = (user) => {
        navItems.guestLinks.forEach(el => el.classList.add('d-none'));
        if (navItems.userDropdown) navItems.userDropdown.classList.remove('d-none');
        if (navItems.usernameDisplay) navItems.usernameDisplay.textContent = user.firstName;

        document.getElementById('profileNameDisplay').textContent = `${user.firstName} ${user.lastName}`;
        document.getElementById('profileEmailDisplay').textContent = user.email;
        document.getElementById('profileRoleDisplay').textContent = user.role || "User";

        if (user.role === "Admin") {
            navItems.adminOnlyLinks.forEach(link => link.classList.remove('d-none'));
            showSection('employees');
            renderEmployees();
            populateDeptDropdown();
        } else {
            navItems.adminOnlyLinks.forEach(link => link.classList.add('d-none'));
            showSection('profile');
        }
    };

    // --- 3. EVENT LISTENERS ---

    if (navItems.brand) navItems.brand.onclick = () => showSection('home');
    if (navItems.login) navItems.login.onclick = () => showSection('login');
    if (navItems.register) navItems.register.onclick = () => showSection('register');
    if (navItems.profile) navItems.profile.onclick = () => showSection('profile');
    
    if (navItems.employees) {
        navItems.employees.onclick = () => { 
            showSection('employees'); 
            renderEmployees(); 
            populateDeptDropdown(); 
        };
    }
    
    if (navItems.departments) navItems.departments.onclick = () => { showSection('departments'); renderDepartments(); };
    if (navItems.accounts) navItems.accounts.onclick = () => { showSection('accounts'); renderAccounts(); };

    const getStartedBtn = document.getElementById('getStartedBtn');
    if (getStartedBtn) getStartedBtn.onclick = () => showSection('register');

    if (forms.register) {
        forms.register.onsubmit = (e) => {
            e.preventDefault();
            const user = {
                firstName: document.getElementById('regFirstName').value,
                lastName: document.getElementById('regLastName').value,
                email: document.getElementById('regEmail').value,
                password: document.getElementById('regPassword').value,
                role: "User",
                isVerified: false
            };
            localStorage.setItem('temp_user', JSON.stringify(user));
            document.getElementById('userEmailSpan').textContent = user.email;
            showSection('verify');
        };
    }

    const verifyBtn = document.getElementById('simulateVerifyBtn');
    if (verifyBtn) {
        verifyBtn.onclick = () => {
            let user = JSON.parse(localStorage.getItem('temp_user'));
            user.isVerified = true;
            let users = JSON.parse(localStorage.getItem('users')) || [];
            users.push(user);
            localStorage.setItem('users', JSON.stringify(users));
            showSection('login');
            document.getElementById('loginAlert').classList.remove('d-none');
        };
    }

    const goToLoginBtn = document.getElementById('goToLoginBtn');
    if (goToLoginBtn) goToLoginBtn.onclick = () => showSection('login');

    if (forms.login) {
        forms.login.onsubmit = (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const pass = document.getElementById('loginPassword').value;
            const users = JSON.parse(localStorage.getItem('users')) || [];

            if (email === "admin@example.com" && pass === "admin123") {
                const admin = { firstName: "Admin", lastName: "User", email, role: "Admin" };
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('currentUser', JSON.stringify(admin));
                updateUIForLoggedInUser(admin);
                return;
            }

            const foundUser = users.find(u => u.email === email && u.password === pass);
            if (foundUser) {
                if (!foundUser.isVerified) return alert("Please verify your email first.");
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('currentUser', JSON.stringify(foundUser));
                updateUIForLoggedInUser(foundUser);
            } else {
                alert("Invalid Credentials.");
            }
        };
    }

    if (forms.employee) {
        forms.employee.onsubmit = (e) => {
            e.preventDefault();
            const newEmp = {
                id: document.getElementById('empId').value,
                email: document.getElementById('empEmail').value,
                position: document.getElementById('empPosition').value,
                dept: document.getElementById('empDept').value
            };
            let employees = JSON.parse(localStorage.getItem('employees')) || [];
            employees.push(newEmp);
            localStorage.setItem('employees', JSON.stringify(employees));
            forms.employee.reset();
            renderEmployees();
        };
    }

    if (forms.department) {
        forms.department.onsubmit = (e) => {
            e.preventDefault();
            const newDept = {
                name: document.getElementById('deptName').value,
                description: document.getElementById('deptDesc').value
            };
            let departments = JSON.parse(localStorage.getItem('departments')) || [];
            departments.push(newDept);
            localStorage.setItem('departments', JSON.stringify(departments));
            forms.department.reset();
            renderDepartments();
        };
    }

    // NEW: Handle Account Form Submission
    if (forms.account) {
        forms.account.onsubmit = (e) => {
            e.preventDefault();
            const newUser = {
                firstName: document.getElementById('accFirstName').value,
                lastName: document.getElementById('accLastName').value,
                email: document.getElementById('accEmail').value,
                password: document.getElementById('accPassword').value,
                role: document.getElementById('accRole').value,
                isVerified: document.getElementById('accVerified').checked
            };
            
            let users = JSON.parse(localStorage.getItem('users')) || [];
            
            if (window.currentEditIndex !== undefined) {
                users[window.currentEditIndex] = newUser;
                window.currentEditIndex = undefined;
            } else {
                users.push(newUser);
            }

            localStorage.setItem('users', JSON.stringify(users));
            forms.account.reset();
            renderAccounts();
        };
    }

    if (navItems.logout) {
        navItems.logout.onclick = () => {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('currentUser');
            location.reload();
        };
    }

    const checkSession = () => {
        if (localStorage.getItem('isLoggedIn') === 'true') {
            const user = JSON.parse(localStorage.getItem('currentUser'));
            if (user) updateUIForLoggedInUser(user);
        } else {
            showSection('home');
        }
    };

    checkSession();
});