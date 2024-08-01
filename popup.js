let tidListElement = document.getElementById('tid-list');
let tidInputElement = document.getElementById('tid-input');
let nameInputElement = document.getElementById('name-input');
let selectedTid = null;

// Function to remove a specific query parameter from a URL
function removeQueryParam(url, param) {
  let urlObj = new URL(url);
  urlObj.searchParams.delete(param);
  return urlObj.href;
}

// Load TIDs from storage and display them
browser.storage.local.get('tids', (data) => {
  let tids = data.tids || [];
  tids.forEach(tid => {
    addTidToUI(tid);
  });
});

// Add new TID with name
document.getElementById('add-tid').addEventListener('click', () => {
  let newTid = tidInputElement.value.trim();
  let newName = nameInputElement.value.trim();
  if (newTid && newName) {
    browser.storage.local.get('tids', (data) => {
      let tids = data.tids || [];
      tids.push({name: newName, tid: newTid});
      browser.storage.local.set({tids: tids}, () => {
        addTidToUI({name: newName, tid: newTid});
        tidInputElement.value = '';
        nameInputElement.value = '';
      });
    });
  }
});

// Use selected TID
document.getElementById('use-tid').addEventListener('click', () => {
  if (selectedTid) {
    browser.storage.local.set({selectedTid: selectedTid}, () => {
      browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
        let currentURL = tabs[0].url;
        let newURL = removeQueryParam(currentURL, "modified");
        let newURLobj = new URL(newURL);
        // Replacing the TID
        newURLobj.searchParams.set("tid", selectedTid);
        // Update browser URL
        browser.tabs.update(tabs[0].id, { url: newURLobj.href});
        browser.tabs.reload(tabs[0].id);
      });
    });
  }
});

// Show current tenant
document.addEventListener('DOMContentLoaded', () => {
  // Retrieve the selected TID from storage
  browser.storage.local.get(['selectedTid', 'tids'], (data) => {
    const selectedTid = data.selectedTid;
    const tenants = data.tids || {};

    // Find the corresponding tenant name
    const currTenant = tenants.find(tenant => tenant.tid === selectedTid) || 'No tenant selected catch';
    // Display the tenant name in the popup
    document.getElementById('selected-tenant-display').textContent = currTenant.name;
  });
});

// Function to add a TID to the UI
function addTidToUI(tidObject) {
  let li = document.createElement('li');
  li.textContent = `${tidObject.name} (${tidObject.tid})`;
  li.addEventListener('click', () => {
    Array.from(tidListElement.children).forEach(child => child.classList.remove('selected'));
    li.classList.add('selected');
    selectedTid = tidObject.tid;
  });

  // Add delete button
  let deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.style.marginLeft = '10px';
  deleteButton.addEventListener('click', (event) => {
    event.stopPropagation();
    deleteTid(tidObject.tid);
    tidListElement.removeChild(li);
  });

  li.appendChild(deleteButton);
  tidListElement.appendChild(li);
}

// Function to delete a TID
function deleteTid(tidToDelete) {
  browser.storage.local.get('tids', (data) => {
    let tids = data.tids || [];
    tids = tids.filter(tid => tid.tid !== tidToDelete);
    browser.storage.local.set({tids: tids});
  });
}