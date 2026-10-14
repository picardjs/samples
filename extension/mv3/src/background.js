// opens the extension page when the toolbar button is clicked
chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: chrome.runtime.getURL('page.html') });
});
