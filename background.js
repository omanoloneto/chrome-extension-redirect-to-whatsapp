const phoneRegex = /^\+?\d[\d\s.-]{7,14}\d$/;

function getMessage(key) {
  return chrome.i18n.getMessage(key);
}

const openWhatsAppTel = getMessage("openWhatsAppTel");
const openWhatsAppText = getMessage("openWhatsAppText");
const invalidNumber = getMessage("invalidNumber");

let storageCache = { defaultCountryCode: "+55" };

const initStorageCache = chrome.storage.sync.get().then((items) => {
  Object.assign(storageCache, items);
}).catch((err) => {
  console.error("Failed to load storage.sync data:", err);
});

async function getConfig() {
  try {
    await initStorageCache;
    return storageCache;
  } catch (e) {
    console.error("Error fetching config:", e);
    return { defaultCountryCode: "+55" };
  }
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ defaultCountryCode: "+55" });
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync") {
    Object.assign(storageCache, changes);
  }
});

(async function setupContextMenus() {
  await getConfig();

  chrome.contextMenus.create({
    id: "openWhatsAppTel",
    title: openWhatsAppTel,
    contexts: ["link"],
    targetUrlPatterns: ["tel:*"]
  });

  chrome.contextMenus.create({
    id: "openWhatsAppText",
    title: openWhatsAppText,
    contexts: ["selection"]
  });

  chrome.contextMenus.onClicked.addListener(async (info) => {
    const config = await getConfig();
    const defaultCountryCode = config.defaultCountryCode;

    if (info.menuItemId === "openWhatsAppTel") {
      const phoneNumber = info.linkUrl.replace("tel:", "").replace(/[^0-9+]/g, "");
      openWhatsApp(phoneNumber, defaultCountryCode);
    } else if (info.menuItemId === "openWhatsAppText") {
      const selectedText = info.selectionText.replace(/[^0-9+]/g, "");
      if (phoneRegex.test(selectedText)) {
        openWhatsApp(selectedText, defaultCountryCode);
      } else {
        alert(invalidNumber);
      }
    }
  });
})();

function openWhatsApp(phoneNumber, defaultCountryCode) {
  if (!phoneNumber.startsWith("+")) {
    phoneNumber = `${defaultCountryCode}${phoneNumber}`;
  }
  const whatsappUrl = `https://wa.me/${phoneNumber}`;
  chrome.tabs.create({ url: whatsappUrl });
}
