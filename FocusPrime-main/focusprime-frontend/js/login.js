document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();  // Prevent the form from submitting normally

    // Retrieve values from the form fields
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Fetch all users from the API
        const response = await fetch('http://localhost:5000/api/users', {
            method: 'GET',
        });

        if (!response.ok) {
            alert('Failed to fetch users. Please try again later.');
            return;
        }

        const users = await response.json();

        // Check for a user with matching email, username, and password
        const user = users.find(
            (user) => 
                user.username === username && 
                user.email === email && 
                user.password_hash === password
        );

        if (user) {
            // Save user data to localStorage
            localStorage.setItem('loggedInUser', JSON.stringify(user));

            alert('Login successful');
            window.location.href = 'profile.html';  // Redirect to profile page
        } else {
            alert('Invalid username, email, or password');
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred. Please try again.');
    }
});
