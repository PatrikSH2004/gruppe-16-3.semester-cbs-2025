document.addEventListener("DOMContentLoaded", () =>{
    const form = document.getElementById("userLoginForm");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const userMail = document.getElementById("userMail").value;
        const userPassword = document.getElementById("userPassword").value;

        console.log(userMail, userPassword);

        const response = await fetch("/customerLogin", {
            method : "POST",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify({userMail, userPassword})
        });

        if (response.ok) {
            window.location.href = "/customer/dashboard";
        } else {
            const data = await response.json();
            alert(data.error || "Login failed");
        };

    });

});