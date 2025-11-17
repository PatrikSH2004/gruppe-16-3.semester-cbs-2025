document.addEventListener("DOMContentLoaded", () => {
    // Tjekker om formen eksisterer på siden.
    const formRegisterFirm = document.getElementById("firmRegisterForm");
    if (!formRegisterFirm) return;

    // Eventlistener til formen, når alt data er indhentet.
    formRegisterFirm.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Afhenter oplysningerne og data fra brugeren.
        const firmName = document.getElementById("companyName").value;
        const firmMail = document.getElementById("email").value;
        const firmPassword = document.getElementById("password").value;
        const logoInput = document.getElementById("companyLogo");

        // Opretter et FormData objekt til at håndtere både tekst og fil upload via binær indhold.
        const formData = new FormData();
        formData.append("firmName", firmName);
        formData.append("firmMail", firmMail);
        formData.append("firmPassword", firmPassword);

        // append fil objekt hvis en fil er valgt.
        if (logoInput && logoInput.files && logoInput.files[0]) {
            formData.append("companyLogo", logoInput.files[0]);
        }

        // Prøver at sende dataen til serveren via en POST request.
        try {
            const respons = await fetch("/firmSignUp", {
                method: "POST",
                // Behøver ingen header, da det er multipart/form-data.
                body: formData
            });

            if (respons.ok) {
                alert("Konto er oprettet succesfuldt");
                window.location.href = "/firmLogin";
            } else {
                const err = await respons.json().catch(()=>({}));
                alert(err.error || "Noget gik galt. Prøv igen senere");
            }
        } catch (e) {
            console.error(e);
            alert("Netværksfejl");
        }
    });
});