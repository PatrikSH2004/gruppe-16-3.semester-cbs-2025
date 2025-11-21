document.addEventListener('DOMContentLoaded', async function () {

    const response = await fetch('/customer/data');
    const data = await response.json();

    console.log(data);

    const rewardsContainer = document.getElementById('loyaltyCardsContainer');
    //
    data.info.forEach(info => {
        const card = document.createElement('div');
        card.className = 'loyalty-card';
        /*
            Kortet her angiver ikke hvor mange bookninger der mangler for at opnå reward.
            Det er noget som skal beregnes og indsættes.
        */
        card.innerHTML = `
            <div class="card-top">
                <img src="${info.virkBillURL}" alt="${info.virkNavn}" class="card-image">               
            </div>

            <div class="card-content">
                <div>
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
                </div>

                <div class="card-actions">
                    <button class="action-btn book">Book next trip</button>
                </div>
            </div>
        `;
        rewardsContainer.appendChild(card);
    });


        rewardsContainer.addEventListener('click', function (e) {
        const btn = e.target.closest('.action-btn.book');
        if (!btn) return;
        e.preventDefault();
        window.location.href = '/customer/bookTrip';
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
