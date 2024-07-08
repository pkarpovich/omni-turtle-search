chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
    if (message.action === "openOptionsPage") {
        chrome.runtime.openOptionsPage().catch(console.error);
        sendResponse({ status: "Options page opened" });
    }
});
