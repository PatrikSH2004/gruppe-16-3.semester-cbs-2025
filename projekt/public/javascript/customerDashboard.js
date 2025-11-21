document.addEventListener('DOMContentLoaded', async function () {

    const response = await fetch('/customer/data');
    const data = await response.json();

    console.log(data);

    const rewardsContainer = document.getElementById('loyaltyCardsContainer');
    //
    data.info.forEach(info => {

        // best-effort: brug antal stjerner hvis tilgængeligt, ellers 2 som fallback
        const filled = Number(info.stjerner || info.stars || 2);
        let starsHTML = '';
        for (let i = 1; i <= 5; i++) {
            starsHTML += `<span class="star ${i <= filled ? 'active' : ''}">★</span>`;
        }

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
                            <span class="toggle-label">View Reward?</span>
                            <input type="checkbox" class="reward-toggle" checked>
                            <span class="slider"></span>
                        </label>
                    </div>

                    <div class="stars">
                        ${starsHTML}
                    </div>

                    <p class="progress-text">
                        Du mangler <strong>[Beregning her]</strong> bookinger for at opnå:
                        <span class="reward-visible">${info.beskrivelse}</span>
                        <span class="reward-hidden hidden">XXX</span>
                    </p>
                </div>

                <div class="card-actions">
                    <button class="action-btn book">Book next trip</button>
                </div>
            </div>
        `;
        rewardsContainer.appendChild(card);

        // wire toggle for dette kort
        const toggle = card.querySelector('.reward-toggle');
        const visible = card.querySelector('.reward-visible');
        const hidden = card.querySelector('.reward-hidden');

         // sørg for at den starter skjult
        toggle.checked = false;

        // initial state: checked => show real reward, unchecked => show XXX
        const applyToggle = () => {
            if (toggle.checked) {
                visible.classList.remove('hidden');
                hidden.classList.add('hidden');
            } else {
                visible.classList.add('hidden');
                hidden.classList.remove('hidden');
            }
        };
        applyToggle();
        toggle.addEventListener('change', applyToggle);
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
