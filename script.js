const form = document.getElementById('hackathonForm');
const formStatus = document.getElementById('formStatus');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Basic form validation
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const age = document.getElementById('age').value;
    const phoneNumber = document.getElementById('phoneNumber').value.trim();
    const graduationYear = document.getElementById('graduationYear').value;
    const branch = document.getElementById('branch').value;
    const scholarId = document.getElementById('scholarId').value.trim();
    
    // Simple validation example
    if (!firstName || !lastName || !age || !phoneNumber || !graduationYear || !branch || !scholarId) {
        showFormStatus('Please fill in all required fields.', 'error');
        return;
    }
    
    // Phone number validation (simple example)
    if (phoneNumber.length < 10) {
        showFormStatus('Please enter a valid phone number.', 'error');
        return;
    }
    
    // Collect form data
    const formData = new FormData(form);
    const formDataObj = {};
    formData.forEach((value, key) => {
        formDataObj[key] = value;
    });
    
    // Log the form data object to console
    console.log(formDataObj);
    
    // Send data to Google Sheets using fetch
    sendDataToGoogleSheets(formDataObj);
});

function sendDataToGoogleSheets(data) {
    // Show loading state
    document.getElementById('submitBtn').disabled = true;
    document.getElementById('submitBtn').textContent = 'Submitting...';
    
    // Replace with your Google Apps Script Web App URL (explained in the next steps)
    const scriptURL = 'YOUR_GOOGLE_SCRIPT_URL';
    
    fetch(scriptURL, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            showFormStatus('Registration submitted successfully!', 'success');
            form.reset();
        } else {
            showFormStatus('Something went wrong. Please try again.', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showFormStatus('Network error. Please try again later.', 'error');
    })
    .finally(() => {
        // Reset button state
        document.getElementById('submitBtn').disabled = false;
        document.getElementById('submitBtn').textContent = 'Submit Registration';
    });
}

function showFormStatus(message, type) {
    formStatus.textContent = message;
    formStatus.className = 'form-status';
    formStatus.classList.add(type);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        formStatus.classList.remove(type);
    }, 5000);
}