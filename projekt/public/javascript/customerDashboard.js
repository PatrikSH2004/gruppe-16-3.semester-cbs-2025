document.addEventListener('DOMContentLoaded', function () {
    const bookButtons = document.querySelectorAll('.action-btn.book');

    if (!bookButtons || bookButtons.length === 0) return;

    bookButtons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            // vi bruger customer/bookTrip som rute for at komme til bookin siden fordi bookTrip routen er under customer i app.js
            window.location.href = '/customer/bookTrip';
        });
    });
});