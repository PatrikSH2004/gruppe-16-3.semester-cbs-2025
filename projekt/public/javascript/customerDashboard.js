document.addEventListener('DOMContentLoaded', async function () {

    const response = await fetch('/customer/data', { credentials: 'same-origin' });
    const data = await response.json();

    console.log('info:', data.info, 'counters:', data.counters);

    const rewardsContainer = document.getElementById('loyaltyCardsContainer');
    
    data.info.forEach(info => {

        // Vi finder den rigtige counter for den tilsvarende reward med ens reward ID'er.
        const counterObj = data.counters.find(c => c.rewardID === info.rewardID);
        // Ændret det til, at hvis counteren ikke findes (dvs. redeemed), så sæt den til -1, i stedet for 0, så vi sikre at der ikke vil ende med datatype undefined.
        const counter = Number(counterObj ? counterObj.counter : -1);
        const betingelse = Number(info.betingelse || 1);

        // Angiver hvor mange fyldte stjerner der skal vises ud af de samlede counter og betingelse.
        const filledStars = Math.min(betingelse, counter);

        console.log(`${info.virkNavn}: counter=${counter}, betingelse=${betingelse}, filledStars=${filledStars}`);

        // Remaining angiver til brugeren hvor mange bookninger de mangler
        const remaining = betingelse - counter;

        // Hvis counter er -1, betyder det at reward er redeemed, og vi skal ikke vise noget kort.
        if (counter !== -1) {
            // HTML element der ligger samlede antal stjerner ud, og makere dem som aktiv ved filledStars
            let starsHTML = '';
            for (let i = 1; i <= betingelse; i++) {
                starsHTML += `<span class="star ${i <= filledStars ? 'active' : ''}">★</span>`;
            }

            const card = document.createElement('div');
            card.className = 'loyalty-card';
        
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
                            Du mangler <strong>${remaining}</strong> bookinger for at opnå:
                            <span class="reward-visible">${info.beskrivelse}</span>
                            <span class="reward-hidden hidden">XXX</span>
                        </p>
                    </div>

                    <div class="card-actions">
                        <button class="action-btn book" data-reward-id="${info.rewardID}">Book next trip</button>
                    </div>
                </div>
            `;
            rewardsContainer.appendChild(card);

            // wire toggle for this card
            const toggle = card.querySelector('.reward-toggle');
            const visible = card.querySelector('.reward-visible');
            const hidden = card.querySelector('.reward-hidden');

            toggle.checked = false;

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
        };

        
    });

    rewardsContainer.addEventListener('click', function (e) {
        const btn = e.target.closest('.action-btn.book');
        if (!btn) return;
        e.preventDefault();
        const rewardId = btn.dataset.rewardId;
        window.location.href = `/customer/bookTrip?rewardId=${encodeURIComponent(rewardId)}`;
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