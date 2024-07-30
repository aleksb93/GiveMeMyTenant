// Listen for navigation events
browser.webNavigation.onBeforeNavigate.addListener((details) => {
  browser.storage.local.get('selectedTid', (data) => {
    if (data.selectedTid) {
      let url = new URL(details.url);
      // Check if the tid parameter is different from the selected one
      if (url.searchParams.get('tid') !== data.selectedTid) {
        // Set the new tid parameter
        url.searchParams.set('tid', data.selectedTid);
        // Update the tab's URL
        browser.tabs.update(details.tabId, { url: url.href });
      }
    }
  });
}, { url: [{ hostContains: "microsoft.com" }] });