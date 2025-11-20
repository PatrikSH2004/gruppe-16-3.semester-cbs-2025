document.addEventListener('DOMContentLoaded', async function () {
    const bookButtons = document.querySelectorAll('.action-btn.book');

    if (!bookButtons || bookButtons.length === 0) return;

    bookButtons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            // vi bruger customer/bookTrip som rute for at komme til bookin siden fordi bookTrip routen er under customer i app.js
            window.location.href = '/customer/bookTrip';
        });
    });

    const response = await fetch('/customer/data');
    const data = await response.json();

    console.log(data);

    const rewardsContainer = document.getElementById('loyaltyCardsContainer');

    data.info.forEach(info => {
        const card = document.createElement('div');
        card.className = 'loyalty-card';
        /*
            Kortet her angiver ikke hvor mange bookninger der mangler for at opnå reward.
            Det er noget som skal beregnes og indsættes.
            Vi skal finde ud af, hvordan det bedst kan gøres.
        
            Tjek database.js, der burde være en beskrivelse af evt. løsningsforslag.
            Men det kræver en del ændringer i backend.
        */
        card.innerHTML = `
            <div class="card-top">
                <img src="${info.virkBillURL}" alt="Morning Flow" class="card-image">               
            </div>

            <div class="card-header">
                <h3>${info.virkNavn}</h3>
                <label class="toggle-switch">
                    <span>View Reward?</span>
                    <input type="checkbox">
                    <span class="slider"></span>
                </label>
            </div>

            <div class="stars">
                <span class="star active">★</span>
                <span class="star active">★</span>
                <span class="star">★</span>
                <span class="star">★</span>
                <span class="star">★</span>
            </div>

            <p class="progress-text">Du mangler [Beregning her] bookinger for at opnå: ${info.beskrivelse}</p>
            <div class="card-actions">
                <button class="action-btn book">Book next trip</button>
            </div>
        `;
        rewardsContainer.appendChild(card);
    });
});

document.getElementById('logoutButton').addEventListener('click', async (e) => {
    e.preventDefault();
    
    const response = await fetch('/logout', {
        method: 'POST'
    });

    if (response.ok) {
        window.location.href = '/'; 
    } else {
        alert('Der opstod en fejl ved logout');
    }
});
