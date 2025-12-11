document.addEventListener("DOMContentLoaded", () =>{
    // Henter formen på virksomhed login siden.
    const form = document.getElementById("firmLoginForm");
    
    // Event listener til, når brugeren klikker på login.
    form.addEventListener("submit", async (event) => {
        // Undgår standard opførsel af form data i URL ved submit.
        event.preventDefault();
        
        // Henter oplysningerne fra formen.
        const firmMail = document.getElementById("firmMail").value;
        const firmPassword = document.getElementById("firmPassword").value;

        // Bruger en fetch request med HTTP-metoden POST, til at sende data til serveren.
        // Data afsendes til /routes/index.js.
        const response = await fetch("/firmLogin", {
            method : "POST",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify({firmMail, firmPassword})
        });

        // Statuskode fra respons af fetch request. Bruges til at tjekke, om login var successfuld.
        if (response.ok) {
            window.location.href = "/firm/home";
        } else {
            const data = await response.json();
            alert(data.error || "Login failed");
        };
    });
});