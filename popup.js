document.getElementById("redirect").addEventListener("click", () => {
    const phoneInput = document.getElementById("phone");
    let phoneNumber = phoneInput.value.replace(/[^0-9+]/g, '');

    if (!phoneNumber) {
        alert("Please enter a valid phone number.");
        return;
    }

    if (!phoneNumber.startsWith("+")) {
        phoneNumber = `+55${phoneNumber}`;
    }

    if (!/^(\+\d{1,4})\d{8,15}$/.test(phoneNumber)) {
        alert("Please enter a valid number with the country code.");
        return;
    }

    const whatsappUrl = `https://wa.me/${phoneNumber}`;
    window.open(whatsappUrl, "_blank");
});
