// User Database Class
class UserDatabase {
    constructor() {
        this.users = new Map();
        this.nextId = 1;
        this.loadFromStorage();
    }

    // Create a new user
    createUser(username, password, email) {
        // Check if username already exists
        if (this.findUserByUsername(username)) {
            throw new Error('Username already exists');
        }

        // Check if email already exists
        if (this.findUserByEmail(email)) {
            throw new Error('Email already exists');
        }

        // Basic validation
        if (!username || !password || !email) {
            throw new Error('All fields are required');
        }

        if (!this.isValidEmail(email)) {
            throw new Error('Invalid email format');
        }

        const user = {
            id: this.nextId++,
            username,
            password, // In production, this should be hashed
            email,
            createdAt: new Date().toISOString()
        };

        this.users.set(user.id, user);
        this.saveToStorage();
        return { success: true, userId: user.id };
    }

    // Find user by username
    findUserByUsername(username) {
        for (let user of this.users.values()) {
            if (user.username === username) {
                return user;
            }
        }
        return null;
    }

    // Find user by email
    findUserByEmail(email) {
        for (let user of this.users.values()) {
            if (user.email === email) {
                return user;
            }
        }
        return null;
    }

    // Authenticate user
    authenticateUser(email, password) {
        const user = this.findUserByEmail(email);
        if (user && user.password === password) {
            return { success: true, user: { id: user.id, username: user.username, email: user.email } };
        }
        return { success: false, message: 'Invalid email or password' };
    }

    // Email validation
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Save to memory (in production, use actual storage)
    saveToStorage() {
        // In a real app, you'd save to a database or localStorage
        // For now, we'll keep it in memory
        console.log('User data saved to memory');
    }

    // Load from memory (in production, load from actual storage)
    loadFromStorage() {
        // In a real app, you'd load from a database or localStorage
        console.log('User data loaded from memory');
    }

    // Get user count
    getUserCount() {
        return this.users.size;
    }
}

// Initialize database
const userDB = new UserDatabase();

// Auth JavaScript - Handles both login and signup pages
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on login or signup page
    const isLoginPage = document.getElementById('loginForm');
    const isSignupPage = document.getElementById('signupForm');
    
    if (isLoginPage) {
        initializeLogin();
    } else if (isSignupPage) {
        initializeSignup();
    }
    
    // Initialize social buttons
    initializeSocialButtons();
});

// Login Page Functions
function initializeLogin() {
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const submitButton = form.querySelector('.auth-button');
    
    // Real-time validation
    emailInput.addEventListener('blur', () => validateEmail(emailInput));
    passwordInput.addEventListener('blur', () => validatePassword(passwordInput));
    
    // Form submission
    form.addEventListener('submit', handleLoginSubmit);
    
    // Add input animations
    addInputAnimations([emailInput, passwordInput]);
}

// Signup Page Functions
function initializeSignup() {
    const form = document.getElementById('signupForm');
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const submitButton = form.querySelector('.auth-button');
    
    // Real-time validation
    fullNameInput.addEventListener('blur', () => validateFullName(fullNameInput));
    emailInput.addEventListener('blur', () => validateEmail(emailInput));
    passwordInput.addEventListener('blur', () => validatePassword(passwordInput));
    confirmPasswordInput.addEventListener('blur', () => validateConfirmPassword(passwordInput, confirmPasswordInput));
    
    // Form submission
    form.addEventListener('submit', handleSignupSubmit);
    
    // Add input animations
    addInputAnimations([fullNameInput, emailInput, passwordInput, confirmPasswordInput]);
}

// Validation Functions
function validateEmail(input) {
    const email = input.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const errorElement = document.getElementById('emailError');
    
    if (!email) {
        showError(input, errorElement, 'Email is required');
        return false;
    } else if (!emailRegex.test(email)) {
        showError(input, errorElement, 'Please enter a valid email address');
        return false;
    } else {
        showSuccess(input, errorElement);
        return true;
    }
}

function validatePassword(input) {
    const password = input.value;
    const errorElement = document.getElementById('passwordError');
    
    if (!password) {
        showError(input, errorElement, 'Password is required');
        return false;
    } else if (password.length < 8) {
        showError(input, errorElement, 'Password must be at least 8 characters');
        return false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
        showError(input, errorElement, 'Password must contain uppercase, lowercase, and number');
        return false;
    } else {
        showSuccess(input, errorElement);
        return true;
    }
}

function validateFullName(input) {
    const fullName = input.value.trim();
    const errorElement = document.getElementById('fullNameError');
    
    if (!fullName) {
        showError(input, errorElement, 'Full name is required');
        return false;
    } else if (fullName.length < 2) {
        showError(input, errorElement, 'Full name must be at least 2 characters');
        return false;
    } else {
        showSuccess(input, errorElement);
        return true;
    }
}

function validateConfirmPassword(passwordInput, confirmInput) {
    const password = passwordInput.value;
    const confirmPassword = confirmInput.value;
    const errorElement = document.getElementById('confirmPasswordError');
    
    if (!confirmPassword) {
        showError(confirmInput, errorElement, 'Please confirm your password');
        return false;
    } else if (password !== confirmPassword) {
        showError(confirmInput, errorElement, 'Passwords do not match');
        return false;
    } else {
        showSuccess(confirmInput, errorElement);
        return true;
    }
}

function showError(input, errorElement, message) {
    input.classList.add('error');
    errorElement.textContent = message;
    input.parentElement.classList.add('shake');
    setTimeout(() => {
        input.parentElement.classList.remove('shake');
    }, 500);
}

function showSuccess(input, errorElement) {
    input.classList.remove('error');
    errorElement.textContent = '';
}

// Form Submission Handlers
async function handleLoginSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitButton = form.querySelector('.auth-button');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    // Validate all fields
    const isEmailValid = validateEmail(emailInput);
    const isPasswordValid = validatePassword(passwordInput);
    
    if (!isEmailValid || !isPasswordValid) {
        return;
    }
    
    // Show loading state
    setButtonLoading(submitButton, true);
    
    try {
        // Authenticate user with database
        const authResult = userDB.authenticateUser(emailInput.value.trim(), passwordInput.value);
        
        if (authResult.success) {
            // Show success message
            showSuccessMessage('Login successful! Redirecting...');
            
            // Store user session (in real app, use secure tokens)
            sessionStorage.setItem('currentUser', JSON.stringify(authResult.user));
            
            // Simulate redirect after delay
            setTimeout(() => {
                // window.location.href = '/dashboard';
                console.log('Redirecting to dashboard...', authResult.user);
            }, 1500);
        } else {
            throw new Error(authResult.message);
        }
        
    } catch (error) {
        showError(emailInput, document.getElementById('emailError'), error.message);
    } finally {
        setButtonLoading(submitButton, false);
    }
}

async function handleSignupSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitButton = form.querySelector('.auth-button');
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const termsCheckbox = document.getElementById('terms');
    
    // Validate all fields
    const isFullNameValid = validateFullName(fullNameInput);
    const isEmailValid = validateEmail(emailInput);
    const isPasswordValid = validatePassword(passwordInput);
    const isConfirmPasswordValid = validateConfirmPassword(passwordInput, confirmPasswordInput);
    
    if (!termsCheckbox.checked) {
        alert('Please accept the terms of service');
        return;
    }
    
    if (!isFullNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
        return;
    }
    
    // Show loading state
    setButtonLoading(submitButton, true);
    
    try {
        // Create user in database
        const result = userDB.createUser(
            fullNameInput.value.trim(),
            passwordInput.value,
            emailInput.value.trim()
        );
        
        if (result.success) {
            // Show success message
            showSuccessMessage('Account created successfully! Redirecting to login...');
            
            // Clear form
            form.reset();
            
            // Simulate redirect after delay
            setTimeout(() => {
                // window.location.href = '/login';
                console.log('Redirecting to login page...', 'User ID:', result.userId);
            }, 1500);
        }
        
    } catch (error) {
        if (error.message.includes('Username')) {
            showError(fullNameInput, document.getElementById('fullNameError'), error.message);
        } else if (error.message.includes('Email')) {
            showError(emailInput, document.getElementById('emailError'), error.message);
        } else {
            showError(emailInput, document.getElementById('emailError'), error.message);
        }
    } finally {
        setButtonLoading(submitButton, false);
    }
}

// Helper Functions
function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.classList.add('loading');
        button.textContent = 'Please wait...';
    } else {
        button.disabled = false;
        button.classList.remove('loading');
        button.textContent = button.dataset.originalText || 'Submit';
    }
}

function showSuccessMessage(message) {
    // Create or update success message element
    let successElement = document.getElementById('successMessage');
    if (!successElement) {
        successElement = document.createElement('div');
        successElement.id = 'successMessage';
        successElement.className = 'success-message';
        successElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        `;
        document.body.appendChild(successElement);
    }
    
    successElement.textContent = message;
    successElement.style.display = 'block';
    
    // Hide after 3 seconds
    setTimeout(() => {
        successElement.style.display = 'none';
    }, 3000);
}

function addInputAnimations(inputs) {
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });
}

function initializeSocialButtons() {
    const socialButtons = document.querySelectorAll('.social-button');
    socialButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const provider = this.dataset.provider;
            console.log(`Social login with ${provider}`);
            // Implement social login logic here
        });
    });
}

// Simulate API call (remove in production)
function simulateApiCall() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 1000);
    });
}

// Debug function to check current users
function debugUsers() {
    console.log('Current users in database:', userDB.users);
    console.log('Total users:', userDB.getUserCount());
}

// Example usage - create a test user
try {
    userDB.createUser('testuser', 'TestPass123', 'test@example.com');
    console.log('Test user created successfully');
} catch (error) {
    console.log('Test user may already exist');
}