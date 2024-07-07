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
