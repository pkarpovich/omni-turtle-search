chrome.runtime.onInstalled.addListener(() => {
    chrome.tabs.onUpdated.addListener(handleUpdateUrl);
});

chrome.runtime.onStartup.addListener(() => {
    chrome.tabs.onUpdated.addListener(handleUpdateUrl);
});

const handleUpdateUrl = (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, _: chrome.tabs.Tab) => {
    if (changeInfo.status === "complete") {
        chrome.tabs
            .sendMessage(tabId, {
                message: "TabUpdated",
            })
            .catch(console.error);
    }
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "openOptionsPage") {
        chrome.runtime.openOptionsPage().catch(console.error);
        sendResponse({ status: "Options page opened" });
    }
});
