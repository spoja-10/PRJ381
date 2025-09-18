
    // Floating particles animation
    function createParticles() {
        const particlesContainer = document.getElementById('particles');
        const particleCount = window.innerWidth < 768 ? 20 : 40;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Random properties
            const size = Math.random() * 3 + 1;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const delay = Math.random() * 5;
            const duration = Math.random() * 10 + 10;
            const opacity = Math.random() * 0.5 + 0.1;
            
            // Apply styles
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            particle.style.opacity = opacity;
            particle.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
            
            // Add to container
            particlesContainer.appendChild(particle);
        }
        
        // Add floating animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0%, 100% { transform: translate(0, 0); }
                25% { transform: translate(10px, 10px); }
                50% { transform: translate(5px, -5px); }
                75% { transform: translate(-5px, 5px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Initialize particles
    createParticles();

    // Form switching
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const showSignup = document.getElementById('show-signup');
    const showLogin = document.getElementById('show-login');
    const authTitle = document.getElementById('auth-title');
    const authSubtitle = document.getElementById('auth-subtitle');

    // Check URL param to open signup directly
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'signup') {
        loginForm.classList.remove('active');
        signupForm.classList.add('active');
        authTitle.textContent = 'Create Account';
        authSubtitle.textContent = 'Join us to start using AI-powered gesture recognition';
    }

    showSignup.addEventListener('click', () => {
        loginForm.classList.remove('active');
        signupForm.classList.add('active');
        authTitle.textContent = 'Create Account';
        authSubtitle.textContent = 'Join us to start using AI-powered gesture recognition';
    });

    showLogin.addEventListener('click', () => {
        signupForm.classList.remove('active');
        loginForm.classList.add('active');
        authTitle.textContent = 'Welcome Back';
        authSubtitle.textContent = 'Sign in to access your gesture recognition dashboard';
    });

    // Role selection
    const roleOptions = document.querySelectorAll('.role-option');
    roleOptions.forEach(option => {
        option.addEventListener('click', () => {
            roleOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            const radio = option.querySelector('input[type="radio"]');
            radio.checked = true;
        });
    });

    // Password validation
    const signupPassword = document.getElementById('signup-password');
    const passwordRequirements = document.getElementById('password-requirements');
    const lengthReq = document.getElementById('length-req');
    const specialReq = document.getElementById('special-req');

    signupPassword.addEventListener('focus', () => {
        passwordRequirements.classList.add('show');
    });

    signupPassword.addEventListener('input', () => {
        const password = signupPassword.value;
        
        // Check length requirement
        if (password.length >= 8) {
            lengthReq.classList.add('met');
        } else {
            lengthReq.classList.remove('met');
        }

        // Check special characters requirement
        const specialChars = (password.match(/[!@#$%^&*(),.?":{}|<>]/g) || []).length;
        if (specialChars >= 4) {
            specialReq.classList.add('met');
        } else {
            specialReq.classList.remove('met');
        }
    });

    // Email validation
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const loginBtn = document.getElementById('login-btn');
        
        // Clear previous errors
        document.getElementById('login-email-error').classList.remove('show');
        document.getElementById('login-password-error').classList.remove('show');
        
        // Validate email
        if (!validateEmail(email)) {
            document.getElementById('login-email-error').textContent = 'Please enter a valid email address';
            document.getElementById('login-email-error').classList.add('show');
            return;
        }
        
        // Show loading state
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<div class="loading-spinner"></div> Signing In...';
        
        try {
            // Simulate API call
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });
            
            // For demo purposes, simulate successful login
            setTimeout(() => {
                if (email === 'demo@example.com' && password === 'demo123') {
                    // Redirect to main app
                    window.location.href = 'sign-translate.html';
                } else if (email === 'admin@example.com' && password === 'admin123') {
                    // Redirect to admin dashboard
                    window.location.href = 'sign-translate.html';

                } else {
                    // Show error
                    document.getElementById('login-password-error').textContent = 'Invalid email or password';
                    document.getElementById('login-password-error').classList.add('show');
                    loginBtn.disabled = false;
                    loginBtn.innerHTML = 'Sign In';
                }
            }, 1500);
            
        } catch (error) {
            console.error('Login error:', error);
            document.getElementById('login-password-error').textContent = 'An error occurred. Please try again.';
            document.getElementById('login-password-error').classList.add('show');
            loginBtn.disabled = false;
            loginBtn.innerHTML = 'Sign In';
        }
    });

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const role = document.querySelector('input[name="role"]:checked').value;
        const acceptTerms = document.getElementById('accept-terms').checked;
        const signupBtn = document.getElementById('signup-btn');
        
        // Clear previous errors
        document.querySelectorAll('.form-error').forEach(error => error.classList.remove('show'));
        
        let hasErrors = false;
        
        // Validate name
        if (name.length < 2) {
            document.getElementById('signup-name-error').textContent = 'Name must be at least 2 characters';
            document.getElementById('signup-name-error').classList.add('show');
            hasErrors = true;
        }
        
        // Validate email
        if (!validateEmail(email)) {
            document.getElementById('signup-email-error').textContent = 'Please enter a valid email address';
            document.getElementById('signup-email-error').classList.add('show');
            hasErrors = true;
        }
        
        // Validate password
        if (password.length < 8) {
            document.getElementById('signup-password-error').textContent = 'Password must be at least 8 characters';
            document.getElementById('signup-password-error').classList.add('show');
            hasErrors = true;
        }
        
        const specialChars = (password.match(/[!@#$%^&*(),.?":{}|<>]/g) || []).length;
        if (specialChars < 4) {
            document.getElementById('signup-password-error').textContent = 'Password must contain at least 4 special characters';
            document.getElementById('signup-password-error').classList.add('show');
            hasErrors = true;
        }
        
        // Validate password confirmation
        if (password !== confirmPassword) {
            document.getElementById('confirm-password-error').textContent = 'Passwords do not match';
            document.getElementById('confirm-password-error').classList.add('show');
            hasErrors = true;
        }
        
        // Validate terms acceptance
        if (!acceptTerms) {
            alert('Please accept the Terms of Service and Privacy Policy');
            hasErrors = true;
        }
        
        if (hasErrors) return;
        
        // Show loading state
        signupBtn.disabled = true;
        signupBtn.innerHTML = '<div class="loading-spinner"></div> Creating Account...';
        
        try {
            // Simulate API call
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password, role })
            });
            
            // For demo purposes, simulate successful registration
            setTimeout(() => {
                // Show success message and switch to login
                alert('Account created successfully! Please sign in.');
                showLogin.click();
                signupBtn.disabled = false;
                signupBtn.innerHTML = 'Create Account';
                signupForm.reset();
            }, 1500);
            
        } catch (error) {
            console.error('Signup error:', error);
            alert('An error occurred. Please try again.');
            signupBtn.disabled = false;
            signupBtn.innerHTML = 'Create Account';
        }
    });

    // Guest access
    document.getElementById('guest-access').addEventListener('click', (e) => {
        e.preventDefault();
        // For demo purposes, redirect to a limited version
        window.location.href = "sign-translate.html";
    });

    // Auto-fill demo credentials
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'd') {
            e.preventDefault();
            if (loginForm.classList.contains('active')) {
                document.getElementById('login-email').value = 'demo@example.com';
                document.getElementById('login-password').value = 'demo123';
            }
        }
    });
    
    // Add subtle hover effect to form inputs
    document.querySelectorAll('.form-input').forEach(input => {
        input.addEventListener('mouseenter', () => {
            input.style.transform = 'translateY(-1px)';
            input.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        });
        
        input.addEventListener('mouseleave', () => {
            input.style.transform = '';
            input.style.boxShadow = '';
        });
    });

