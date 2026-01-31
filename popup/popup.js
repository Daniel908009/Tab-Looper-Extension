document.getElementById("addTabButton").addEventListener("click", AddTab);
document.getElementById("removeTabButton").addEventListener("click", RemoveAllTabs);
tabsList = document.getElementById("tabList");

function RemoveAllTabs() {
    chrome.storage.local.set({tabs: []});
}

async function AddTab() {
    let tabs = await chrome.storage.local.get("tabs");
    tabs = tabs.tabs ? tabs.tabs : [];
    let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    for (let savedTab of tabs) {
        if (savedTab.url === tab.url) {
            return;
        }
    }
    if (tabs.length < 10) {
        tabs.push({title: tab.title, url: tab.url, favIconUrl: tab.favIconUrl});
    }else {
        chrome.tabs.sendMessage(tab.id, {action: "show-notification", message: "Cycle list is full (10 tabs max)."});
        return;
    }
    await chrome.storage.local.set({tabs: tabs});
}

async function RemoveTab(index) {
    let tabs = await chrome.storage.local.get("tabs");
    tabs = tabs.tabs ? tabs.tabs : [];
    if (tabs) {
        if (index != null && index >= 0 && index < tabs.length) {
            tabs.splice(index, 1);
        } else {
            let currentTab = await chrome.tabs.query({active: true, currentWindow: true});
            tabs = tabs.filter(tab => tab.url !== currentTab[0].url);
        }
        await chrome.storage.local.set({tabs: tabs});
    }
}

function modifiedTitle(title) {
    if (title.length > 15) {
        return title.substring(0, 15) + "...";
    }
    return title;
}

async function reloadTabs() {
    tabsList.innerHTML = "";
    let tabs = await chrome.storage.local.get("tabs");
    let currentTab = await chrome.tabs.query({active: true, currentWindow: true});
    tabs = tabs.tabs ? tabs.tabs : [];
    if (tabs.length > 0) {
        tabs.forEach((tab, index) => {
            let listItem = document.createElement("li");
            listItem.className = "tabElement";
            if (tab.url === currentTab[0].url) {
                listItem.classList.add("current-tab");
            }
            listItem.style.marginBottom = "10px";
            let p = document.createElement("p");
            p.textContent = modifiedTitle(tab.title);
            p.style.display = "inline";
            p.style.width = "95px";
            listItem.appendChild(p);
            let favicon = document.createElement("img");
            favicon.src = tab.favIconUrl ? tab.favIconUrl : chrome.runtime.getURL("icons/questionMark.png");
            favicon.style.width = "16px";
            favicon.style.height = "16px";
            favicon.style.marginRight = "10px";
            listItem.prepend(favicon);
            let removeButton = document.createElement("button");
            removeButton.style.marginLeft = "10px";
            removeButton.textContent = "Remove";
            removeButton.className = "button rem-button-small";
            removeButton.addEventListener("click", async () => {
                await RemoveTab(index);
            });
            listItem.appendChild(removeButton);
            switchOrderUpButton = document.createElement("button");
            switchOrderUpButton.style.marginLeft = "5px";
            switchOrderUpButton.textContent = "↑";
            switchOrderUpButton.className = "button order-button-small";
            switchOrderUpButton.addEventListener("click", async () => {
                if (index > 0) {
                    let tabs = await chrome.storage.local.get("tabs");
                    tabs = tabs.tabs ? tabs.tabs : [];
                    for (let i = 0; i < tabs.length; i++) {
                        if (i === index) {
                            let temp = tabs[i - 1];
                            tabs[i - 1] = tabs[i];
                            tabs[i] = temp;
                            break;
                        }
                    }
                    await chrome.storage.local.set({tabs: tabs});
                }
            });
            listItem.appendChild(switchOrderUpButton);
            let switchOrderDownButton = document.createElement("button");
            switchOrderDownButton.style.marginLeft = "5px";
            switchOrderDownButton.textContent = "↓";
            switchOrderDownButton.className = "button order-button-small";
            switchOrderDownButton.addEventListener("click", async () => {
                let tabs = await chrome.storage.local.get("tabs");
                tabs = tabs.tabs ? tabs.tabs : [];
                if (index < tabs.length - 1) {
                    for (let i = 0; i < tabs.length; i++) {
                        if (i === index) {
                            let temp = tabs[i + 1];
                            tabs[i + 1] = tabs[i];
                            tabs[i] = temp;
                            break;
                        }
                    }
                    await chrome.storage.local.set({tabs: tabs});
                }
            });
            listItem.appendChild(switchOrderDownButton);
            tabsList.appendChild(listItem);
        });
    }else {
        let p = document.createElement("p");
        p.textContent = "No tabs added yet.";
        tabsList.appendChild(p);
    }
}

chrome.storage.onChanged.addListener(reloadTabs);

reloadTabs();
