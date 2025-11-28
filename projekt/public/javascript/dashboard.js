
// DELETE EVENT HANDLER

async function deleteEventById(id, row) {
    if (!confirm("Er du sikker på, at du vil slette dette event?")) return;

    try {
        const result = await fetch(`/firm/delete-reward`, {
            method: 'DELETE',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rewardsID: id })
        });

        if (!result.ok) throw new Error("Delete failed");

        row.remove();
        console.log("Reward deleted:", id);

    } catch (err) {
        console.error(err);
        alert("Kunne ikke slette reward.");
    }
}

// Delegér klik på delete-knapper
document.addEventListener("click", (event) => {
    const btn = event.target.closest(".delete-btn");
    if (!btn) return;

    const id = Number(btn.dataset.id);
    const row = btn.closest("tr");

    deleteEventById(id, row);
});


// LOGOUT


document.getElementById('logoutButton').addEventListener('click', async (e) => {
    e.preventDefault();

    const response = await fetch('/logout', { method: 'POST' });

    if (response.ok) {
        window.location.href = '/';
    } else {
        alert('Der opstod en fejl ved logout');
    }
});


// GÅ TIL CREATE REWARD


document.getElementById('toRewardCreation').addEventListener('click', function () {
    window.location.href = '/firm/create-reward';
});


// LOAD DATA


document.addEventListener('DOMContentLoaded', async function () {

    const response = await fetch('/firm/data');
    const data = await response.json();
    console.log(data);

    const rewardTable = document.getElementById('rewardTable');

    data.rewards.forEach(reward => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${reward.rewardID}</td>
            <td>${reward.rewardName}</td>
            <td>${reward.betingelse} gange</td>
            <td>${reward.kvoter !== null ? reward.kvoter : 'Ubegrænset'}</td>
            <td>${reward.eligible}</td>
            <td>${reward.beskrivelse}</td>
            <td>
                <button class="delete-btn" data-id="${reward.rewardID}" title="Slet event">
                    <span class="delete-icon">×</span>
                </button>
            </td>
        `;

        rewardTable.appendChild(row);
    });
});
