
document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById("date");
    const timeInput = document.getElementById("time");
    const preview = document.getElementById("preview");
    const cancelBtn = document.querySelector('.cancel-btn');
    const bookingForm = document.querySelector(".booking-form");

    function updatePreview() {
        const date = dateInput.value;
        const time = timeInput.value;
        if (date && time) {
            const formattedDate = new Date(date).toLocaleDateString("da-DK", {
                day: "2-digit", month: "long", year: "numeric"
            });
            preview.textContent = `Du har valgt: ${formattedDate} kl. ${time}`;
        } else {
            preview.textContent = "Vælg en dato og et tidspunkt";
        }
    }

    if (dateInput) {
        dateInput.addEventListener("change", updatePreview);
    }

    if (timeInput) {
        timeInput.addEventListener("change", updatePreview);
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '/customer/dashboard';
        });
    }

    if (bookingForm) {
        bookingForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const confirmBtn = document.querySelector('.confirm-btn');
            if (confirmBtn) {
                confirmBtn.disabled = true;
            }

            const date = document.getElementById("date").value;
            const time = document.getElementById("time").value;
          
            const params = new URLSearchParams(window.location.search);
            const rewardId = params.get('rewardId');
            const reward = params.get('reward');

            try {
                
                const response = await fetch('/customer/bookTrip', {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ rewardId, date, time, reward })
                });

                const result = await response.json();
                console.log(result);

                if (response.ok) {
                    alert("Booking gennemført – mail sendt!");
                    window.location.href = "/customer/dashboard";
                }
            } catch (error) {
                console.error('Booking error:', error);
                alert("Der opstod en fejl ved booking");
                if (confirmBtn) {
                    confirmBtn.disabled = false;
                }
            }
        });
    }
});
