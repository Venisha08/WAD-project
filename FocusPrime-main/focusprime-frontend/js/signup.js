document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Retrieve values from the form fields
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Basic client-side validation
    if (password !== confirmPassword) {
        alert('Passwords do not match. Please try again.');
        return;
    }

    // Debugging: Show the data being sent
    console.log('Signup attempt:', { username, email, password });

    try {
        // Send POST request to create a new user
        const response = await fetch('http://localhost:5000/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password_hash: password }), // Sending data to the API
        });

        if (response.ok) {
            alert('User created successfully!');
            window.location.href = 'login.html'; // Redirect to login page
        } else {
            // Extract and display error message if available
            const errorData = await response.json();
            alert(`Error creating user: ${errorData.message || 'Unknown error occurred.'}`);
        }
    } catch (error) {
        console.error('Error during signup:', error); // Debugging: Log error
        alert('An error occurred. Please try again.');
    }
});
