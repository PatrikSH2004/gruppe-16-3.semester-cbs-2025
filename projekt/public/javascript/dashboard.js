async function deleteEvent(button) {
    if (confirm('Er du sikker på, at du vil slette dette event?')) {
            
        const row = button.closest('tr');

        const rewardsID = Number(row.children[0].textContent);

        console.log(rewardsID);

        const result = await fetch(`/firm/delete-reward`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ rewardsID })
        });

        row.remove();

    };
};

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


document.getElementById('toRewardCreation').addEventListener('click', function() {
    window.location.href = '/firm/create-reward';
});

document.addEventListener('DOMContentLoaded', async function() {

    // Afhenter data, og udparker det.
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
                <button class="delete-btn" onclick="deleteEvent(this)" title="Slet event">
                    <span class="delete-icon">×</span>
                </button>
            </td>
        `;
        rewardTable.appendChild(row);
    });

    

});
