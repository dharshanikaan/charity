document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
    const profilePage = document.getElementById('profilePage');
    const donationsPage = document.getElementById('donationsPage');
    const charityPage = document.getElementById('charityPage');
    const logoutButton = document.getElementById('logoutButton');
    
    // Load initial page (if logged in)
    if (token) {
        profilePage.style.display = 'block';
        donationsPage.style.display = 'block';
        charityPage.style.display = 'block';
        loadProfileInfo();
    } else {
        profilePage.style.display = 'none';
        donationsPage.style.display = 'none';
        charityPage.style.display = 'none';
    }

    // Show Registration Form
    document.getElementById('registerPage').addEventListener('click', () => {
        document.getElementById('registerForm').style.display = 'block';
        document.getElementById('loginForm').style.display = 'none';
    });

    // Show Login Form
    document.getElementById('loginPage').addEventListener('click', () => {
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('registerForm').style.display = 'none';
    });

    // Register User
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const phone = document.getElementById('registerPhone').value;
        const address = document.getElementById('registerAddress').value;
        const password = document.getElementById('registerPassword').value;

        try {
            const response = await fetch('/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, phone, address, password }),
            });

            const data = await response.json();
            alert(data.message);
            window.location.href = '/'; // Redirect to home
        } catch (error) {
            alert("Error during registration: " + error.message);
        }
    });

    // Login User
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (data.token) {
                localStorage.setItem('authToken', data.token);
                window.location.href = '/';
            } else {
                alert("Login failed: " + data.error);
            }
        } catch (error) {
            alert("Error during login: " + error.message);
        }
    });

    // Logout User
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('authToken');
        window.location.href = '/';
    });

    // Load User Profile
    async function loadProfileInfo() {
        const response = await fetch('/api/users/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await response.json();
        document.getElementById('profileDetails').innerHTML = `
            <p>Name: ${data.user.name}</p>
            <p>Email: ${data.user.email}</p>
            <p>Phone: ${data.user.phone}</p>
            <p>Address: ${data.user.address}</p>
        `;
    }
});
