// Create Reward modal JS
let rewardTypes = ["Rabat 20%", "Gratis kaffe", "VIP adgang"];

function renderRewardTypes(select) {
    select.innerHTML = "";
    rewardTypes.forEach((type) => {
        const opt = document.createElement("option");
        opt.value = type;
        opt.textContent = type;
        select.appendChild(opt);
    });
}

function setupRewardTypeUI() {
    const select = document.getElementById("rewardTypeSelect");
    const addBtn = document.getElementById("addRewardType");
    const newInput = document.getElementById("newRewardType");
    const deleteBtn = document.getElementById("deleteRewardType");
    renderRewardTypes(select);

    addBtn.onclick = function() {
        const val = newInput.value.trim();
        if(val && !rewardTypes.includes(val)) {
            rewardTypes.push(val);
            renderRewardTypes(select);
            select.value = val;
            newInput.value = "";
        }
    };
    deleteBtn.onclick = function() {
        const idx = rewardTypes.indexOf(select.value);
        if(idx > -1) {
            rewardTypes.splice(idx, 1);
            renderRewardTypes(select);
            select.selectedIndex = 0;
        }
    };
}

document.addEventListener("DOMContentLoaded", function() {
    setupRewardTypeUI();
});

function handleSubmitReward(event) {
    event.preventDefault();
    window.location.href = 'dashboard.html';
}
