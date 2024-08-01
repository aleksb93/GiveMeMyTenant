// Listen for navigation events
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  // Check if the URL has already been modified
  if (details.url.includes('modified=true')) {
    return; // Skip processing if URL has been modified
  }

  chrome.storage.local.get('selectedTid', (data) => {
    if (data.selectedTid) {
      let url = new URL(details.url);
      let host = url.hostname;
      
      // Define excluded subdomains
      let excludedSubdomains = [
        'logon.microsoft.com',
        'login.microsoft.com'
      ];

      // Check if the URL's host is in the list of excluded subdomains
      if (excludedSubdomains.includes(host)) {
        return; // Skip processing for these subdomains
      }

      // Check if the URL contains the 'tid' parameter
      if (url.searchParams.has('tid')) {
        // Update the 'tid' parameter with the selected TID
        url.searchParams.set('tid', data.selectedTid);

        // Mark the URL as modified to avoid reloading
        url.searchParams.set('modified', 'true');

        // Update the tab's URL
        chrome.tabs.update(details.tabId, { url: url.href });
      }
    }
  });
}, { url: [
  { hostContains: "microsoft.com" }   // Matches all subdomains of microsoft.com
] });