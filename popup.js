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
chrome.storage.local.get('tids', (data) => {
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
    chrome.storage.local.get('tids', (data) => {
      let tids = data.tids || [];
      tids.push({name: newName, tid: newTid});
      chrome.storage.local.set({tids: tids}, () => {
        addTidToUI({name: newName, tid: newTid});
        tidInputElement.value = '';
        nameInputElement.value = '';
      });
    });
  }
});

// Function to add a TID to the UI
function addTidToUI(tenant) {
  const tenantList = document.getElementById("tid-list");
  let li = document.createElement('li');
  li.className = "tenant-item";
  li.textContent = tenant.name;

  let tidSpan = document.createElement("span");
  tidSpan.className = "tenant-id";
  tidSpan.textContent = tenant.tid;

  li.addEventListener('click', () => {
    useTenant(tenant.tid);
  });

  // Add delete button
  let deleteButton = document.createElement('button');
  deleteButton.className = "tenant-delete-button";
  deleteButton.textContent = 'Del';
  deleteButton.addEventListener('click', (event) => {
    event.stopPropagation();
    deleteTid(tenant.tid);
    tenantList.removeChild(li);
  });

  li.appendChild(tidSpan);
  li.appendChild(deleteButton);
  tenantList.appendChild(li);
};

// Use the selected tenant entry
function useTenant(selectedTid) {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    let newURLobj = new URL(tabs[0].url);
    // Stoping not-microsoft sites from updating (must also have tid) / do nothing
    if (!newURLobj.hostname.endsWith("microsoft.com") || !newURLobj.searchParams.has("tid")) {
      return; 
    }

    // Replacing the TID
    newURLobj.searchParams.set("tid", selectedTid);
    // Update browser URL
    chrome.tabs.update(tabs[0].id, { url: newURLobj.href});
  });
};

// Function to delete a TID
function deleteTid(tidToDelete) {
  chrome.storage.local.get('tids', (data) => {
    let tids = data.tids || [];
    tids = tids.filter(tid => tid.tid !== tidToDelete);
    chrome.storage.local.set({tids: tids});
  });
}

// Show the JSON input field
document.getElementById("show-json-input").addEventListener("click", () => {
  document.getElementById("json-input-container").style.display = "block";
});

// Show the manual input field
document.getElementById("show-manual-input").addEventListener("click", () => {
  document.getElementById("manual-input-container").style.display = "block";
});

// Load tenants from JSON
document.getElementById("load-json").addEventListener("click", () => {
  const jsonInput = document.getElementById("json-input").value.trim();
  try {
    const tenants = JSON.parse(jsonInput);
  } catch (error) {
    console.error("Invalid JSON:", error);
    alert("Invalid JSON format. Please check your input.");
    return;
  }
  // Tested that parse is OK, but need access to tenants variable
  const tenants = JSON.parse(jsonInput);
  chrome.storage.local.get("tids", (data) => {
    let tids = data.tids || [];
    tenants.forEach(tenant => {
      tids.push({name: tenant.name, tid: tenant.tid});
  })
  chrome.storage.local.set({tids: tids});
  location.reload();
  });
});