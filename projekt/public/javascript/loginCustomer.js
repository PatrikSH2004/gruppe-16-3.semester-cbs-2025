document.addEventListener("DOMContentLoaded", () =>{
    // Henter formen på bruger login siden.
    const form = document.getElementById("userLoginForm");
    
    // Event listener til, når brugeren klikker på login.
    form.addEventListener("submit", async (event) => {
        
        // Undgår standard opførsel af form data i URL ved submit.
        event.preventDefault();
        
        // Henter oplysningerne fra formen.
        const userMail = document.getElementById("userMail").value;
        const userPassword = document.getElementById("userPassword").value;

        // Bruger en fetch request med HTTP-metoden POST, til at sende data til serveren.
        // Data afsendes til /routes/index.js.
        const response = await fetch("/customerLogin", {
            method : "POST",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify({userMail, userPassword})
        });

        // Statuskode fra respons af fetch request. Bruges til at tjekke, om login var successfuld.
        if (response.ok) {
            window.location.href = "/customer/dashboard";
        } else {
            const data = await response.json();
            alert(data.error || "Login failed");
        };

    });

});