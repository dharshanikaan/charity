document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');

    // Elements
    const homePage = document.getElementById('homePage');
    const dashboardPage = document.getElementById('dashboardPage');
    const profilePage = document.getElementById('profilePage');
    const donationsPage = document.getElementById('donationsPage');
    const manageCharityPage = document.getElementById('manageCharityPage');
    const manageProjectsPage = document.getElementById('manageProjectsPage');
    const reportsPage = document.getElementById('reportsPage');

    const profileLink = document.getElementById('profileLink');
    const donationsLink = document.getElementById('donationsLink');
    const manageCharityLink = document.getElementById('manageCharityLink');
    const manageProjectsLink = document.getElementById('manageProjectsLink');
    const reportsLink = document.getElementById('reportsLink');

    const backToDashboardFromProfile = document.getElementById('backToDashboardFromProfile');
    const backToDashboardFromDonations = document.getElementById('backToDashboardFromDonations');
    const backToDashboardFromManageCharity = document.getElementById('backToDashboardFromManageCharity');
    const backToDashboardFromManageProjects = document.getElementById('backToDashboardFromManageProjects');
    const backToDashboardFromReports = document.getElementById('backToDashboardFromReports');

    const logoutLink = document.getElementById('logoutLink');
    const registerLink = document.getElementById('registerLink');
    const loginLink = document.getElementById('loginLink');

    // Show Dashboard after login
    function showDashboard() {
        homePage.style.display = 'none';
        dashboardPage.style.display = 'block';
    }

    // Show Home page and hide others
    function showHomePage() {
        homePage.style.display = 'block';
        dashboardPage.style.display = 'none';
    }

    // Show Profile Page
    profileLink.addEventListener('click', () => {
        dashboardPage.style.display = 'none';
        profilePage.style.display = 'block';
    });

    // Show Donations Page
    donationsLink.addEventListener('click', () => {
        dashboardPage.style.display = 'none';
        donationsPage.style.display = 'block';
    });

    // Show Manage Charity Page
    manageCharityLink.addEventListener('click', () => {
        dashboardPage.style.display = 'none';
        manageCharityPage.style.display = 'block';
    });

    // Show Manage Projects Page
    manageProjectsLink.addEventListener('click', () => {
        dashboardPage.style.display = 'none';
        manageProjectsPage.style.display = 'block';
    });

    // Show Reports Page
    reportsLink.addEventListener('click', () => {
        dashboardPage.style.display = 'none';
        reportsPage.style.display = 'block';
    });

    // Back to Dashboard from Profile
    backToDashboardFromProfile.addEventListener('click', () => {
        profilePage.style.display = 'none';
        dashboardPage.style.display = 'block';
    });

    // Back to Dashboard from Donations
    backToDashboardFromDonations.addEventListener('click', () => {
        donationsPage.style.display = 'none';
        dashboardPage.style.display = 'block';
    });

    // Back to Dashboard from Manage Charity
    backToDashboardFromManageCharity.addEventListener('click', () => {
        manageCharityPage.style.display = 'none';
        dashboardPage.style.display = 'block';
    });

    // Back to Dashboard from Manage Projects
    backToDashboardFromManageProjects.addEventListener('click', () => {
        manageProjectsPage.style.display = 'none';
        dashboardPage.style.display = 'block';
    });

    // Back to Dashboard from Reports
    backToDashboardFromReports.addEventListener('click', () => {
        reportsPage.style.display = 'none';
        dashboardPage.style.display = 'block';
    });

    // Logout
    logoutLink.addEventListener('click', () => {
        localStorage.removeItem('authToken');
        alert('Logged out successfully');
        showHomePage();  // Show Home page after logout
    });

    // Register User
    registerLink.addEventListener('click', () => {
        // For simplicity, simulate registration success (use real API in production)
        alert('Registration successful!');
        showHomePage();  // Go back to home page after registration
    });

    // Login User
    loginLink.addEventListener('click', () => {
        // For simplicity, simulate login success (use real API in production)
        localStorage.setItem('authToken', 'fakeAuthToken');
        alert('Login successful!');
        showDashboard();  // Redirect to Dashboard after login
    });

    // Show the correct page based on login status
    if (token) {
        showDashboard();
    } else {
        showHomePage();
    }
});
