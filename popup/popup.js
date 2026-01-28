document.getElementById("addTabButton").addEventListener("click", AddTab);
document.getElementById("removeTabButton").addEventListener("click", RemoveTab);
tabsList = document.getElementById("tabList");

async function AddTab() {
    let tabs = localStorage.getItem("tabs");
    if (tabs) {
        tabs = JSON.parse(tabs);
    } else {
        tabs = [];
    }
    let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    tabs.push({title: tab.title, url: tab.url});
    localStorage.setItem("tabs", JSON.stringify(tabs));
    reloadTabs();
}

function RemoveTab(index) {
    let tabs = localStorage.getItem("tabs");
    if (tabs) {
        tabs = JSON.parse(tabs);
        tabs.splice(index, 1);
        localStorage.setItem("tabs", JSON.stringify(tabs));
    }
    reloadTabs();
}

function reloadTabs() {
    tabsList.innerHTML = "";
    let tabs = localStorage.getItem("tabs");
    if (tabs) {
        tabs = JSON.parse(tabs);
        tabs.forEach((tab, index) => {
            let listItem = document.createElement("li");
            listItem.textContent = index+1 + ". " + tab.title + " - " + tab.url;
            let removeButton = document.createElement("button");
            removeButton.textContent = "Remove";
            removeButton.addEventListener("click", () => {
                RemoveTab(index);
                reloadTabs();
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