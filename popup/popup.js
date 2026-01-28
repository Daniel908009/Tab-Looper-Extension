document.getElementById("addTabButton").addEventListener("click", AddTab);
document.getElementById("removeTabButton").addEventListener("click", RemoveTab);
tabsList = document.getElementById("tabList");

async function AddTab() {
    let tabs = await chrome.storage.local.get("tabs");
    if (tabs) {
        tabs = tabs.tabs ? tabs.tabs : [];
    } else {
        tabs = [];
    }
    let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    for (let savedTab of tabs) {
        if (savedTab.url === tab.url) {
            return;
        }
    }
    tabs.push({title: tab.title, url: tab.url});
    await chrome.storage.local.set({tabs: tabs});
    reloadTabs();
}

async function RemoveTab(index) {
    console.log("Removing tab at index:", index);
    let tabs = await chrome.storage.local.get("tabs");
    if (tabs) {
        tabs = tabs.tabs ? tabs.tabs : [];
        if (index != null && index >= 0 && index < tabs.length) {
            tabs.splice(index, 1);
        } else {
            let currentTab = await chrome.tabs.query({active: true, currentWindow: true});
            tabs = tabs.filter(tab => tab.url !== currentTab[0].url);
        }
        await chrome.storage.local.set({tabs: tabs});
        reloadTabs();
    }
}

async function reloadTabs() {
    tabsList.innerHTML = "";
    let tabs = await chrome.storage.local.get("tabs");
    tabs = tabs.tabs ? tabs.tabs : [];
    if (tabs) {
        tabs.forEach((tab, index) => {
            let listItem = document.createElement("li");
            listItem.textContent = index+1 + ". " + tab.title + " - " + tab.url;
            let removeButton = document.createElement("button");
            removeButton.textContent = "Remove";
            removeButton.addEventListener("click", async () => {
                await RemoveTab(index);
                await reloadTabs();
            });
            listItem.appendChild(removeButton);
            tabsList.appendChild(listItem);
        });
    }else {
        let p = document.createElement("p");
        p.textContent = "No tabs added yet.";
        tabsList.appendChild(p);
    }
}

reloadTabs();