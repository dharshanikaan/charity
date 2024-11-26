document.addEventListener('DOMContentLoaded', () => {
    const homePage = document.getElementById('homePage');
    const registerPage = document.getElementById('registerForm');
    const loginPage = document.getElementById('loginForm');
    const dashboardPage = document.getElementById('dashboardPage');
    const registerLink = document.getElementById('registerLink');
    const loginLink = document.getElementById('loginLink');
    const backToHomeFromRegister = document.getElementById('backToHomeFromRegister');
    const backToHomeFromLogin = document.getElementById('backToHomeFromLogin');
    const logoutLink = document.getElementById('logoutLink');
    const authLinks = document.getElementById('authLinks');
    
    const token = localStorage.getItem('authToken');

    // Toggle pages based on login status
    function togglePagesVisibility() {
        if (token) {
            // If logged in, show Dashboard and Logout, hide Home and Auth Links
            dashboardPage.style.display = 'block';
            logoutLink.style.display = 'inline';
            authLinks.style.display = 'none';
            homePage.style.display = 'none';
        } else {
            // If not logged in, show Home and Auth Links, hide other pages
            dashboardPage.style.display = 'none';
            logoutLink.style.display = 'none';
            authLinks.style.display = 'block';
            homePage.style.display = 'block';
        }
    }

    // Show Register page
    registerLink.addEventListener('click', () => {
        homePage.style.display = 'none';
        registerPage.style.display = 'block';
    });

    // Register User
    document.getElementById('registerFormElement').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;

        // Simulate registration success (replace with actual API)
        const success = true;

        if (success) {
            alert('Registration successful!');
            homePage.style.display = 'block';
            registerPage.style.display = 'none';
            togglePagesVisibility();  // Ensure correct page visibility after registration
        } else {
            alert('Error during registration. Please try again.');
        }
    });

    // Show Login page
    loginLink.addEventListener('click', () => {
        homePage.style.display = 'none';
        loginPage.style.display = 'block';
    });

    // Login User
    document.getElementById('loginFormElement').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        // Simulate login success (replace with actual API)
        const success = true;

        if (success) {
            localStorage.setItem('authToken', 'token'); // Store auth token
            alert('Login successful!');
            togglePagesVisibility();  // Redirect to the Dashboard page after login
            loginPage.style.display = 'none';
            dashboardPage.style.display = 'block';  // Show the dashboard after login
        } else {
            alert('Login failed. Please check your credentials.');
        }
    });

    // Back to home from Register page
    backToHomeFromRegister.addEventListener('click', () => {
        registerPage.style.display = 'none';
        homePage.style.display = 'block';
    });

    // Back to home from Login page
    backToHomeFromLogin.addEventListener('click', () => {
        loginPage.style.display = 'none';
        homePage.style.display = 'block';
    });

    // Logout
    logoutLink.addEventListener('click', () => {
        localStorage.removeItem('authToken');
        alert('Logged out successfully');
        togglePagesVisibility();  // Redirect to Home after logout
    });

    // Initial page setup
    togglePagesVisibility();
});
