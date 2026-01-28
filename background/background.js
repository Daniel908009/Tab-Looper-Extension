chrome.commands.onCommand.addListener(async function(command) {
    if (command === "cycle-tabs"){
        let tabs = await chrome.storage.local.get("tabs");
        tabs = tabs.tabs ? tabs.tabs : [];
        if (tabs.length === 0){
            return;
        }
        let currentTab = await chrome.tabs.query({active: true, currentWindow: true})
        let index = 0;
        for (let i = 0; i < tabs.length; i++){
            if (tabs[i].url === currentTab[0].url){
                index = i + 1;
                break;
            }
        }
        if (index >= tabs.length){
            index = 0;
        }
        console.log("tabsList:", tabs, "current index:", index, "next index:", index);
        let nextTabUrl = tabs[index].url;
        let nextTab = await chrome.tabs.query({url: nextTabUrl});
        if (nextTab.length > 0){
            chrome.windows.update(nextTab[0].windowId, {focused: true});
            chrome.tabs.update(nextTab[0].id, {active: true});
        } else {
            let createdTab = await chrome.tabs.create({url: nextTabUrl});
            chrome.tabs.update(createdTab.id, {active: true});
        }
    }
});