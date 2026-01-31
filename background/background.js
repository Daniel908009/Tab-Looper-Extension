chrome.commands.onCommand.addListener(async function(command) {
    if (command === "cycle-tabs-minus"){
        let tabs = await chrome.storage.local.get("tabs");
        tabs = tabs.tabs ? tabs.tabs : [];
        if (tabs.length === 0){
            return;
        }
        let currentTab = await chrome.tabs.query({active: true, currentWindow: true})
        let index = 0;
        for (let i = 0; i < tabs.length; i++){
            if (tabs[i].url === currentTab[0].url){
                index = i - 1;
                break;
            }
        }
        if (index < 0){
            index = tabs.length - 1;
        }
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
    else if (command === "cycle-tabs-plus"){
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
    else if (command === "add-current-tab"){
        let tabs = await chrome.storage.local.get("tabs");
        tabs = tabs.tabs ? tabs.tabs : [];
        let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
        for (let savedTab of tabs) {
            if (savedTab.url === tab.url) {
                return;
            }
        }
        if (
            tabs.length < 10) {tabs.push({title: tab.title, url: tab.url, favIconUrl: tab.favIconUrl});
        }else {
            await chrome.tabs.sendMessage(tab.id, {action: "show-notification", message: "Cycle list is full (10 tabs max)."});
            return;
        }
        await chrome.storage.local.set({tabs: tabs}); 
        if (tab.id && (tab.url.startsWith("http") || tab.url.startsWith("https")))  
            try {
                await chrome.tabs.sendMessage(tab.id, {action: "show-notification", message: "Tab added to cycle list."});
            } catch (e) {
                await chrome.scripting.executeScript({
                    target: {tabId: tab.id},
                    files: ['content/content.js']
                }).then(async () => {
                    await chrome.tabs.sendMessage(tab.id, {action: "show-notification", message: "Tab added to cycle list."});
                }).catch((error) => {
                    console.error('Script injection failed: ' + error);
                });
            }
    } 
    else if (command === "remove-current-tab"){
        let tabs = await chrome.storage.local.get("tabs");
        tabs = tabs.tabs ? tabs.tabs : [];
        if (tabs.length > 0) {
            let currentTab = await chrome.tabs.query({active: true, currentWindow: true});
            tabs = tabs.filter(tab => tab.url !== currentTab[0].url);
            await chrome.storage.local.set({tabs: tabs});
            if (currentTab[0].id && (currentTab[0].url.startsWith("http") || currentTab[0].url.startsWith("https"))){
                try {
                    await chrome.tabs.sendMessage(currentTab[0].id, {action: "show-notification", message: "Tab removed from cycle list."});
                } catch (e) {
                    await chrome.scripting.executeScript({
                        target: {tabId: currentTab[0].id},
                        files: ['content/content.js']
                    }).then(async () => {
                        await chrome.tabs.sendMessage(currentTab[0].id, {action: "show-notification", message: "Tab removed from cycle list."});
                    }).catch((error) => {
                        console.error('Script injection failed: ' + error);
                    });
                }
            }
        }
    }
});