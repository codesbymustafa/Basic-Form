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
    const isPhoneNumber = string => {

        const number = Number(string);
        const isInteger = Number.isInteger(number);
        const isPositive = number > 0;
        const isValidLength = string.length === 10; // Assuming a 10-digit phone number
        return isInteger && isPositive && isValidLength;

    }

    const isScholarId = string => {
        const number = Number(string);
        const isInteger = Number.isInteger(number);
        const isPositive = number > 0;
        const isValidLength = string.length === 11;
        return isInteger && isPositive && isValidLength;
    }


    if (!(isPhoneNumber(phoneNumber))) {
        showFormStatus('Please enter a valid phone number.', 'error');
        return;
    }

    if (!(isScholarId(scholarId))) {
        showFormStatus('Please enter a valid scholar ID.', 'error');   
        return;
    }


    // Collect form data
    const formDataObj = {};

    for (let i = 0; i < form.elements.length; i++) {
        const element = form.elements[i];
        if (element.name) {
            formDataObj[element.name] = element.value;
        }
    }


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
    const scriptURL = 'https://script.google.com/macros/s/AKfycbzsW22u49Cv1v-m70Fin67CY6NdFL9VisLUvaXkF_fQegwy8yWpYtcMfFIwNUroTYjy/exec';
    
    fetch(scriptURL, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'no-cors'
    })
    .then(response => {
        // if (response.ok) {
            showFormStatus('Registration submitted successfully!', 'success');
            form.reset();
        // } else {
        //     showFormStatus('Something went wrong. Please try again.', 'error');
        // }
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

