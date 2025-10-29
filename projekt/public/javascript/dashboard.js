function deleteEvent(button) {
    if (confirm('Er du sikker på, at du vil slette dette event?')) {
        const row = button.closest('tr');
        row.remove();
        // Her ville du normalt også sende en request til backend om at slette eventet
    }
}

// Hvis du har tabs eller flere dashboard-funktioner, kan de tilføjes her
