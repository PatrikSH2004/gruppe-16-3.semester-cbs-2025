document.getElementById("start").addEventListener("click", async () => {
    try {
        const response = await fetch('/api/start', { method: 'POST' });
        const data = await response.json();
        console.log(data.message);
    } catch (err) {
        console.error("Error:", err);
    }
});

document.getElementById("stop").addEventListener("click", async () => {
    try {
        const response = await fetch('/api/stop', { method: 'POST' });
        const data = await response.json();
        console.log(data.message);
    } catch (err) {
        console.error("Error:", err);
    }
});