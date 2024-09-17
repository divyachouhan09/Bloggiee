document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting normally
    console.log('login-form');
    
    let isValid = true;

    // Validate Username
    const username = document.getElementById('username').value;
    const usernameError = document.getElementById('usernameError');
    
    if (username.trim() === "") {
        usernameError.textContent = 'Username is required.';
        usernameError.style.visibility = 'visible';
        isValid = false;
    } else {
        usernameError.style.visibility = 'hidden';
    }

    // Validate Password
    const password = document.getElementById('password').value;
    const passwordError = document.getElementById('passwordError');
    
    if (password.trim() === "") {
        passwordError.textContent = 'Password is required.';
        passwordError.style.visibility = 'visible';
        isValid = false;
    } else {
        passwordError.style.visibility = 'hidden';
    }

    if (isValid) {
        // Prepare data for the API call
        const loginData = {
            username: username,
            password: password
        };

        // Send login request to the server
        fetch('http://localhost:8080/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        })
        .then(response => {
            if (response.ok) {
                return response.json(); // Parse JSON only if the response is okay
            } else if (response.status === 401) {
                throw new Error('Unauthorized');
            } else {
                throw new Error('Unexpected error');
            }
        })
        .then(data => {
            if (data.token) {
                // Store the token in session storage
                sessionStorage.setItem('token', data.token);
                sessionStorage.setItem('username', data.username);

                console.log(sessionStorage.getItem('token'));
                
                // Redirect to home page upon successful login
                window.location.href = 'homePage.html';
            } else {
                // Handle login failure (e.g., display error message)
                passwordError.textContent = 'Invalid username or password.';
                passwordError.style.visibility = 'visible';
            }
        })
        .catch(error => {
            console.error('Error during login:', error);
            if (error.message === 'Unauthorized') {
                passwordError.textContent = 'Invalid username or password.';
            } else {
                passwordError.textContent = 'An error occurred during login. Please try again.';
            }
            passwordError.style.visibility = 'visible';
        });
    }
});
