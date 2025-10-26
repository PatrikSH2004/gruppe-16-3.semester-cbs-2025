// Auth JS for login/register
function validateCVR(cvr) {
    return cvr.length === 8 && !isNaN(cvr);
}

function handleCompanyRegister(event) {
    event.preventDefault();
    const form = event.target;
    const cvr = form.querySelector('input[placeholder="CVR"]').value;
    if(validateCVR(cvr)) {
        window.location.href = 'login.html';
    }
}

function handleCustomerRegister(event) {
    event.preventDefault();
    window.location.href = 'login.html';
}

function handleCompanyLogin(event) {
    event.preventDefault();
    window.location.href = 'dashboard.html';
}

function handleCustomerLogin(event) {
    event.preventDefault();
    window.location.href = 'dashboard.html';
}
