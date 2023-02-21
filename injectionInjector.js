let KEY_STORAGE_LOCAL_APPLYING_SETTINGS = "applying_settings";

let localCopyApplySettings = {};

// TODO: MOVE TO A BETTER/LESS REDUNDANT SPOT. Remove Duplicate Code

function createElementLink(sheetName) {
    console.log("[Return Youtube UI]: Linking document name ="+sheetName);
    if(sheetName.endsWith(".css")){
        const stylesheetLinkElement = document.createElement('link');
        stylesheetLinkElement.rel = 'stylesheet';
        stylesheetLinkElement.type = 'text/css';
        stylesheetLinkElement.href = browser.runtime.getURL(sheetName);
        return stylesheetLinkElement;
    }else if(sheetName.endsWith(".js")){
        const jsSheetLinkElement=document.createElement('script')
        jsSheetLinkElement.setAttribute("type","text/javascript")
        jsSheetLinkElement.setAttribute("src", browser.runtime.getURL(sheetName))
        return jsSheetLinkElement;
    }
    // return stylesheetLinkElement;
}




function getApplySettings(key) {
    return new Promise((resolve, reject) => {
        browser.storage.local.get(key, (result) => {
            if (browser.runtime.lastError) {
                reject(browser.runtime.lastError);
            } else {
                // If the key is not in storage, create it with default values
                if (!result[key]) {
                    let defaultSettings = {};
                    if (key === KEY_STORAGE_LOCAL_APPLYING_SETTINGS) {
                        defaultSettings = {
                            "UN_ROUNDED_SEARCH": true,
                            "SEARCH_BUTTON_COLOR": true,
                        };
                    }
                    result[key] = defaultSettings;
                    browser.storage.local.set(result, () => {
                        if (browser.runtime.lastError) {
                            reject(browser.runtime.lastError);
                        } else {
                            localCopyApplySettings = result[key];
                            resolve(result[key]);
                        }
                    });
                } else {
                    localCopyApplySettings = result[key];
                    resolve(result[key]);
                }
            }
        });
    });
}

function applySettingsUpdate(){
    console.log("[Return Youtube UI]: Start of applySettingsUpdate");

    // TODO: Try to fix again, KEY_STORAGE_LOCAL_APPLYING_SETTINGS not converted to string for some reason
    browser.storage.local.set({ "applying_settings": localCopyApplySettings }); // Synchronize the changes made to localCopyApplySettings
}

browser.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "local" && KEY_STORAGE_LOCAL_APPLYING_SETTINGS in changes) {
        for (let key in changes) {
            const settings = JSON.parse(JSON.stringify(changes[key].newValue));//TODO: Make sure this is efficent
            console.log(`[Return Youtube UI]: Key "${key}" in area "${areaName}" changed. New value is ${JSON.stringify(changes[key].newValue)}.`);
            localCopyApplySettings = settings;
            if(key===KEY_STORAGE_LOCAL_APPLYING_SETTINGS){
                for(const settingsKey in settings){
                    if (settingsKey === "UN_ROUNDED_SEARCH") {
                        setSearchBoxRounding(localCopyApplySettings.UN_ROUNDED_SEARCH);
                    }else if(settingsKey==="SEARCH_BUTTON_COLOR"){
                        setSubscribeState(localCopyApplySettings.SEARCH_BUTTON_COLOR);
                    }
                }
            }
        }
    }
});

// START INJECTOR BASED SETTINGS FUNCTIONS
function setSearchBoxRounding(state) {
    let unroundedSearchboxCSS = document.getElementById("returnUI_injected_CSS__searchUnrouded");

    if (state === true) {
        // TODO: Make more efficient, right now trys removal and re-add
        if(unroundedSearchboxCSS === null) {
            unroundedSearchboxCSS = createElementLink("injection_parts/return/searchbox.css");
            unroundedSearchboxCSS.id = "returnUI_injected_CSS__searchUnrouded";
            document.head.appendChild(unroundedSearchboxCSS);
        }
    } else if (state === false) {
        try{
            unroundedSearchboxCSS.parentElement.removeChild(unroundedSearchboxCSS);
        }catch(e){}
    }
}
function setSubscribeState(state) {
    let originalSubscribeButtonColorCSS = document.getElementById("returnUI_injected_CSS__subscribeButtonModified");
    if (state === true) {
        // TODO: Make more efficient, right now trys removal and re-add
        if(originalSubscribeButtonColorCSS === null) {
            originalSubscribeButtonColorCSS = createElementLink("injection_parts/return/subscribe_button_color.css");
            originalSubscribeButtonColorCSS.id = "returnUI_injected_CSS__subscribeButtonModified";
            document.head.appendChild(originalSubscribeButtonColorCSS);
        }
    } else if (state === false) {
        try{
            originalSubscribeButtonColorCSS.parentElement.removeChild(originalSubscribeButtonColorCSS);
        }catch(e){}
    }
}
// END INJECTOR BASED SETTINGS FUNCTIONS





// Initial setup/initial receive
getApplySettings(KEY_STORAGE_LOCAL_APPLYING_SETTINGS).then((applySettings) => {
    console.log("Initial applySettings:", applySettings);
    // Rest of the code to initialize the table
    console.log("Settings used:");
    const keys = Object.keys(applySettings);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = applySettings[keys[i]];
        console.log("[Return Youtube UI]:   " + key + ": " + value);

        if(typeof value == "boolean"){
            if(key === "UN_ROUNDED_SEARCH"){
                setSearchBoxRounding(value);
            }else if(key === "SEARCH_BUTTON_COLOR"){
                setSubscribeState(value);
            }
        }
    }
}).catch((error) => {
    console.error(error);
});

