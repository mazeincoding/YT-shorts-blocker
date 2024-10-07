function checkForShorts(tabId, url) {
  if (url.includes('youtube.com/shorts')) {
    chrome.tabs.sendMessage(tabId, { action: 'enableScrollBlocking' }, (response) => {
      if (chrome.runtime.lastError) {
        // If the content script is not ready, inject it
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ['content.js']
        }, () => {
          // After injection, try sending the message again
          chrome.tabs.sendMessage(tabId, { action: 'enableScrollBlocking' });
        });
      }
    });
  } else {
    chrome.tabs.sendMessage(tabId, { action: 'disableScrollBlocking' }, (response) => {
      // We don't need to handle errors for disabling
    });
  }
}

chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
  checkForShorts(details.tabId, details.url);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    checkForShorts(tabId, tab.url);
  }
});