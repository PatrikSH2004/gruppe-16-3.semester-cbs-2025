// Create Reward modal JS

document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector('.event-form');
    if (form) form.addEventListener('submit', handleSubmitReward);
});

function handleSubmitReward(event) {
    event.preventDefault();

    const name = document.getElementById('rewardName').value.trim();
    const description = document.getElementById('rewardDescription').value.trim();
    const conditionVal = document.getElementById('rewardCondition').value;
    const quotas = document.getElementById('rewardQuotas').value.trim();
    // Basic validation
    if (!name) {
        alert('Indtast et navn til reward');
        return false;
    }
    const condition = parseInt(conditionVal, 10);
    if (isNaN(condition) || condition < 1) {
        alert('Betingelse skal være et heltal større end 0');
        return false;
    }

    // Allow quotas to be empty or '-' to indicate not set
    const quotasValue = (!quotas || quotas === '-') ? null : quotas;

    // For now just log the collected data and redirect to dashboard
    const payload = {
        name,
        description,
        condition,
        quotas: quotasValue
    };
    console.log('Create reward payload:', payload);

    // TODO: send payload to backend API (POST /api/rewards)

    // Redirect back to dashboard after creating
    window.location.href = 'dashboard.html';
    return false;
}
