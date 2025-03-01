document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.sync.get({ defaultCountryCode: "+55" }, (data) => {
        document.getElementById("defaultCountryCode").value = data.defaultCountryCode;
    });
});

document.getElementById("optionsForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const defaultCountryCode = document.getElementById("defaultCountryCode").value.trim();

    if (!defaultCountryCode.startsWith("+")) {
        document.getElementById("status").textContent = "Please enter a valid country code starting with '+'.";
        return;
    }

    chrome.storage.sync.set({ defaultCountryCode }, () => {
        const status = document.getElementById("status");
        status.textContent = "Options saved!";
        setTimeout(() => {
            status.textContent = "";
        }, 2000);
    });
});
