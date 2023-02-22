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
                            "SUBSCRIBE_BUTTON_COLOR": true,
                            "SUBSCRIBE_BUTTON_SHAPE": true,
                            "UN_ROUNDED_VIEWS": true,
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
                settingsToActions(settings);
            }
        }
    }
});

// START INJECTOR BASED SETTINGS HELPERS
function setInjectionStateHelper(state, id, filePath){
    if(typeof filePath == "undefined"){//Make id filepath for overloading
        filePath = id;
        id = "returnUI_injected_CSS__"+filePath.substring((filePath.lastIndexOf("/")===-1 ? 0 : (filePath.lastIndexOf("/"))),filePath.lastIndexOf("."));
    }
    let element = document.getElementById(id);

    if (state === true) {
        // TODO: Make more efficient, right now trys removal and re-add
        if(element === null) {
            element = createElementLink(filePath);
            element.id = id;
            document.head.appendChild(element);
        }
    } else if (state === false) {
        try{
            element.parentElement.removeChild(element);
        }catch(e){}
    }
}
// END INJECTOR BASED SETTINGS HELPERS


function settingsToActions(){
    getApplySettings(KEY_STORAGE_LOCAL_APPLYING_SETTINGS).then((applySettings) => {
        console.log("Initial applySettings:", applySettings);
        console.log("Settings used:");
        const keys = Object.keys(applySettings);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value = applySettings[keys[i]];
            console.log("[Return Youtube UI]:   " + key + ": " + value);

            if(typeof value == "boolean"){
                // TODO: Make switch statement
                if(key === "UN_ROUNDED_SEARCH"){
                    setInjectionStateHelper(value, "returnUI_injected_CSS__searchUnrouded", "injection_parts/return/searchbox.css");
                }else if(key === "SUBSCRIBE_BUTTON_COLOR"){
                    setInjectionStateHelper(value, "injection_parts/return/subscribe_button_color.css");
                }else if(key === "SUBSCRIBE_BUTTON_SHAPE"){
                    setInjectionStateHelper(value, "injection_parts/return/subscribe_button_shape.css");
                }else if(key === "UN_ROUNDED_VIEWS"){
                    setInjectionStateHelper(value, "returnUI_injected_CSS__unrounded_views", "injection_parts/return/unrounded_views.css");
                }
            }
        }
    }).catch((error) => {
        console.error(error);
    });
}

// Initial setup/initial receive
settingsToActions();
