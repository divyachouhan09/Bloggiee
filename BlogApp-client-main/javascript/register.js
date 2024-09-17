document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Perform validation checks
    if (!/^[a-zA-Z\s]+$/.test(username)) {
        alert("Username can only contain letters and spaces.");
        return;
    }

    if (!/.+@.+\..+/.test(email)) {
        alert("Please enter a valid email.");
        return;
    }

    if (password.length < 8 || !/[!@#$%^&*]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password) || /(.)\1\1/.test(password)) {
        alert("Password must be at least 8 characters long, contain at least one special character, one capital letter, one number, and no more than two consecutive identical characters.");
        return;
    }

    if (password !== confirmPassword) {
        document.getElementById('confirmPassword').classList.add('error-field');
        alert("Passwords do not match, please retype.");
        return;
    }

    const response = await fetch('http://localhost:8080/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            email: email,
            password: password,
        }),
    });
    

    if (response.status === 201) {
        alert("Signup successful! Redirecting to login page...");
        window.location.href = "login.html";
    } else {
        const errorResponse = await response.json();
        alert("Signup failed: " + errorResponse.message);
    }
});
