document.addEventListener('DOMContentLoaded', () => {
    const companyLoginBtn = document.getElementById('companyLoginBtn');
    const companySignUpBtn = document.getElementById('companySignUpBtn');
    const customerLoginBtn = document.getElementById('customerLoginBtn');
    const customerSignUpBtn = document.getElementById('customerSignUpBtn');

    if (companyLoginBtn) {
        companyLoginBtn.addEventListener('click', () => {
            window.location.href = '/firmLogin';
        });
    }

    if (companySignUpBtn) {
        companySignUpBtn.addEventListener('click', () => {
            window.location.href = '/firmSignUp';
        });
    }

    if (customerLoginBtn) {
        customerLoginBtn.addEventListener('click', () => {
            window.location.href = '/customerLogin';
        });
    }

    if (customerSignUpBtn) {
        customerSignUpBtn.addEventListener('click', () => {
            window.location.href = '/customerSignUp';
        });
    }
});
