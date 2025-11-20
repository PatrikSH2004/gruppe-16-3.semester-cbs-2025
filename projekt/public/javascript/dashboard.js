function deleteEvent(button) {
    if (confirm('Er du sikker på, at du vil slette dette event?')) {
        const row = button.closest('tr');
        row.remove();
        // Her ville du normalt også sende en request til backend om at slette eventet
    }
}

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

