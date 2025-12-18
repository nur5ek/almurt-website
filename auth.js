// Authentication Logic

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});

// Handle Login
function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email').trim();
    const password = formData.get('password');
    
    // Validation
    if (!validateEmail(email)) {
        showAlert('Неверный формат email', 'error');
        return;
    }
    
    if (password.length < 4) {
        showAlert('Пароль должен содержать минимум 4 символа', 'error');
        return;
    }
    
    // Get user from localStorage
    const savedUser = localStorage.getItem('user');
    
    if (!savedUser) {
        showAlert('Пользователь не найден. Пожалуйста, зарегистрируйтесь', 'error');
        return;
    }
    
    const user = JSON.parse(savedUser);
    
    // Check credentials
    if (user.email === email && user.password === password) {
        showAlert('Вход выполнен успешно!', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    } else {
        showAlert('Неверный email или пароль', 'error');
    }
}

// Handle Registration
function handleRegister(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get('name').trim();
    const email = formData.get('email').trim();
    const phone = formData.get('phone').trim();
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    
    // Validation
    if (name.length < 2) {
        showAlert('Имя должно содержать минимум 2 символа', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showAlert('Неверный формат email', 'error');
        return;
    }
    
    if (!validatePhone(phone)) {
        showAlert('Неверный формат телефона. Минимум 10 цифр', 'error');
        return;
    }
    
    if (password.length < 4) {
        showAlert('Пароль должен содержать минимум 4 символа', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showAlert('Пароли не совпадают', 'error');
        return;
    }
    
    // Check if user already exists
    const existingUser = localStorage.getItem('user');
    if (existingUser) {
        const user = JSON.parse(existingUser);
        if (user.email === email) {
            showAlert('Пользователь с таким email уже существует', 'error');
            return;
        }
    }
    
    // Create user object
    const userData = {
        name: name,
        email: email,
        phone: phone,
        password: password,
        registeredAt: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    
    showAlert('Регистрация прошла успешно!', 'success');
    
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
}

// Email Validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone Validation
function validatePhone(phone) {
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length >= 10;
}

// Show Alert
function showAlert(message, type = 'success') {
    const container = document.getElementById('alertContainer');
    if (!container) {
        alert(message);
        return;
    }
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    container.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}