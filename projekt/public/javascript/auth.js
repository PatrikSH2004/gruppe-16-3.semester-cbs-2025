// Håndtere logout funktionalitet for sidebar 
document.addEventListener('DOMContentLoaded', function() {
    const logoutButton = document.getElementById('logoutButton');

    // hvis logoutButton findes, tilføj en event listener
    if (logoutButton) {
        logoutButton.addEventListener('click', async function(e) {
            e.preventDefault();
            
            try { // vi sender en POST anmodning til serveren for at logge ud
                 // i sidebar routes kan man finde ruten, hvor vi destorey session 
                const response = await fetch('/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    // sender brugeren til login siden 
                    window.location.href = '/login';
                    alert('Du er nu logget ud!');
                } else {
                    throw new Error('Logout fejlede');
                }
            } catch (error) {
                console.error('Logout fejl:', error);
                alert('Der skete en fejl under logout');
            } 
        });
    };

    // DOM til at afsende customer data ved sign-up
    const form = document.getElementById("costumerRegisterForm");

    form.addEventListener("submit", async (event) =>{
        event.preventDefault();

        // Afhenter data fra brugeren.
        const userName = document.getElementById("KundeName").value;
        const userMail = document.getElementById("kundeEmail").value;
        const userPassword = document.getElementById("kundePassword").value;
        
        // Opstiller en JSON payload med brugerens data til en post request.
        const response = await fetch("/customerSignUp", {
            method : "POST",
            headers : {"Content-Type": "application/json"},
            body: JSON.stringify({userName, userMail, userPassword})
        });

        //Tjekker om vi har successfuld respons og informer brugeren.
        if (response.ok) {
            alert("Konto er oprettet successfuldt");
        } else {
            alert("Noget gik galt. Prøv igen senere");
        };
    });

});

