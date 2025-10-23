// Select the form
const form = document.querySelector('form');

// Hardcoded user credentials
const userData = {
  username: 'abc',
  email: 'pant@123gmail.com',
  password: '12345'
};

form.addEventListener('submit', function(e) {
  e.preventDefault(); // Prevent form submission

  // Get input values
  const username = form.querySelector('input[type="text"]').value.trim();
  const email = form.querySelector('input[type="email"]').value.trim();
  const password = form.querySelectorAll('input[type="password"]')[0].value.trim();
  const confirmPassword = form.querySelectorAll('input[type="password"]')[1].value.trim();

  // Validation
  if (!username || !email || !password || !confirmPassword) {
    alert("⚠️ All fields are required.");
    return;
  }

  // Email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("⚠️ Please enter a valid email address.");
    return;
  }

  
  // Password match check
  if (password !== confirmPassword) {
    alert("⚠️ Password and Confirm Password do not match.");
    return;
  }

  // Check against hardcoded credentials
  if (username === userData.username && email === userData.email && password === userData.password) {
    // Save username/email in localStorage
    localStorage.setItem('userName', username);
    localStorage.setItem('userEmail', email);

    alert("✅ Registration successful! Redirecting...");
    window.location.href = 'upload.html';
  } else {
    alert("❌ Invalid credentials! Please enter correct information.");
  }
});
