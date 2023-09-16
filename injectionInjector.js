let projectConfiguration = null;

const KEY_STORAGE_LOCAL_APPLYING_ADJUSTMENT_STATES = "page_adjustment_states";


let localCopyApplySettings = {};

determinedBrowserAPI = typeof browser !== 'undefined' ? browser : chrome;

function getProjectConfiguration() {
    return fetch(determinedBrowserAPI.runtime.getURL('projectConfiguration.json'))
        .then(response => response.json())
        .then(data => data);
}
getProjectConfiguration().then(projectConfiguration => { localStorage.setItem("ProjectConfiguration", JSON.stringify(projectConfiguration));});
projectConfiguration = JSON.parse(localStorage.getItem("ProjectConfiguration"));

function logWithConfigMsg(...messages){
    if(projectConfiguration === null){
        getProjectConfiguration().then(gotProjectConfiguration => {
            projectConfiguration = JSON.stringify(gotProjectConfiguration);
            for(const message of messages){
                if(typeof message === "object"){
                    console.log("["+JSON.parse(projectConfiguration).log_header+"]: "+JSON.stringify(message));
                }else{
                    console.log("["+JSON.parse(projectConfiguration).log_header+"]: "+message);
                }
            }
        });
    }else{
        for(const message of messages){
            if(typeof message === "object"){
                console.log("["+projectConfiguration.log_header+"]: "+JSON.stringify(message));
            }else{
                console.log("["+projectConfiguration.log_header+"]: "+message);
            }
        }
    }
}


// TODO: MOVE TO A BETTER/LESS REDUNDANT SPOT. Remove Duplicate Code
function createElementLink(sheetName) {
    logWithConfigMsg("Linking document name ="+sheetName);

    if(sheetName.endsWith(".css")){
        const stylesheetLinkElement = document.createElement('link');
        stylesheetLinkElement.rel = 'stylesheet';
        stylesheetLinkElement.type = 'text/css';
        stylesheetLinkElement.href = determinedBrowserAPI.runtime.getURL(sheetName);
        return stylesheetLinkElement;
    }else if(sheetName.endsWith(".js")){
        const jsSheetLinkElement=document.createElement('script')
        jsSheetLinkElement.setAttribute("type","text/javascript")
        jsSheetLinkElement.setAttribute("src", determinedBrowserAPI.runtime.getURL(sheetName))
        return jsSheetLinkElement;
    }
    // primary stylesheetLinkElement;
}



function getApplySettings(key) {
    return new Promise((resolve, reject) => {
        determinedBrowserAPI.storage.local.get(key, (result) => {
            if (determinedBrowserAPI.runtime.lastError) {
                reject(determinedBrowserAPI.runtime.lastError);
            } else {
                // If the key is not in storage, create it with default values
                if (!result[key]) {
                    let defaultSettings = {};
                    if(key === KEY_STORAGE_LOCAL_APPLYING_ADJUSTMENT_STATES) {
                        defaultSettings = structuredClone(projectConfiguration.DEFAULT_CHANGE_SETTINGS);
                    }
                    result[key] = defaultSettings;
                    determinedBrowserAPI.storage.local.set(result, () => {
                        if (determinedBrowserAPI.runtime.lastError) {
                            reject(determinedBrowserAPI.runtime.lastError);
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
    logWithConfigMsg("Start of applySettingsUpdate");

    // TODO: Try to fix again, KEY_STORAGE_LOCAL_APPLYING_ADJUSTMENT_STATES not converted to string for some reason
    determinedBrowserAPI.storage.local.set({ "page_adjustment_states": localCopyApplySettings }); // Synchronize the changes made to localCopyApplySettings
}

determinedBrowserAPI.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "local" && KEY_STORAGE_LOCAL_APPLYING_ADJUSTMENT_STATES in changes) {
        for (let key in changes) {
            const settings = JSON.parse(JSON.stringify(changes[key].newValue));//TODO: Make sure this is efficient{

            logWithConfigMsg(`Key "${key}" in area "${areaName}" changed. New value is ${JSON.stringify(changes[key].newValue)}.`);


            localCopyApplySettings = settings;
            if(key===KEY_STORAGE_LOCAL_APPLYING_ADJUSTMENT_STATES){
                settingsToActions(settings);
            }
        }
    }
});

// START INJECTOR BASED SETTINGS HELPERS
function setInjectionStateHelper(state, id, filePath){
    if(typeof filePath == "undefined"){//Make id filepath for overloading
        if(typeof id == "undefined"){//If both undefined for overloading
            id = state;
            state = true;
        }
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

function setProperty(propertyName, value){
    var root = document.querySelector(':root');//TODO: Inefficient?
    if(!propertyName.startsWith("--")){
        propertyName = "--".concat(propertyName);
    }
    root.style.setProperty(propertyName, value);

}
// END INJECTOR BASED SETTINGS HELPERS

function settingsToActions(){
    getApplySettings(KEY_STORAGE_LOCAL_APPLYING_ADJUSTMENT_STATES).then((applySettings) => {
        logWithConfigMsg("Settings used:");
        const keys = Object.keys(applySettings);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value = applySettings[keys[i]].value;

            // if(typeof value == "boolean"){
            if(true){
                // TODO: Make switch statement
                if(key === "UN_ROUNDED_SEARCH"){
                    setInjectionStateHelper(value, "injection_parts/primary/searchbox.css");
                }else if(key === "SUBSCRIBE_BUTTON_COLOR"){
                    setInjectionStateHelper(value, "injection_parts/primary/subscribe_button_color.css");
                }else if(key === "SUBSCRIBE_BUTTON_SHAPE"){
                    setInjectionStateHelper(value, "injection_parts/primary/subscribe_button_shape.css");
                }else if(key === "UN_ROUNDED_MENUS"){
                    setInjectionStateHelper(value, "injection_parts/primary/unrounded_menus.css");
                }else if(key === "UN_ROUNDED_MAIN_PLAYER"){
                    setInjectionStateHelper(value, "injection_parts/primary/unrounded_main_player.css");
                }else if(key === "UN_ROUNDED_THUMBNAILS_AND_SECONDARY_PLAYERS"){
                    setInjectionStateHelper(value, "injection_parts/primary/unrounded_thumbnails_and_secondary_players.css");
                    setInjectionStateHelper(value, "injection_parts/primary/unrounded_image_posts.css");//TODO: Move to own setting?
                }else if(key === "BAR_BUTTONS"){
                    setInjectionStateHelper(value, "injection_parts/primary/otherFormattingFromViews.css");
                }else if(key === "SAVE_BEFORE_SHARE"){
                    // if(value){
                    //     setInjectionStateHelper(true, "injection_parts/primary/save_visible_before_clip.js");
                    // }else{
                    //     save_visible_before_clip(false);
                    // }
                }
                // setInjectionStateHelper(value, "injection_parts/primary/text_formatting.css");
            // }else{
                if(key === "VIDEOS_PER_ROW"){
                    setProperty("return-youtube-ui-videos-per-row", value);
                    setInjectionStateHelper( "injection_parts/primary/homepage_videos_per_row.css");
                }else if(key === "PERCENT_MORE_SPACE_TO_ACTIONS_BAR"){
                    setProperty("return-youtube-ui-percent-more-actions-bar-space", value+"%");
                    setInjectionStateHelper( "injection_parts/primary/percent_more_actions_bar.css");
                }
                // setInjectionStateHelper(value, "injection_parts/primary/text_formatting.css");
            // }else{
                if(key === "VIDEOS_PER_ROW"){
                    setProperty("return-youtube-ui-videos-per-row", value);
                    setInjectionStateHelper( "injection_parts/primary/homepage_videos_per_row.css");
                }else if(key === "PERCENT_MORE_SPACE_TO_ACTIONS_BAR"){
                    setProperty("return-youtube-ui-percent-more-actions-bar-space", value+"%");
                    setInjectionStateHelper( "injection_parts/primary/percent_more_actions_bar.css");
                }
            }else{
                if(key === "VIDEOS_PER_ROW"){
                    var r = document.querySelector(':root');
                    r.style.setProperty('--return-youtube-ui-videos-per-row', value);
                    setInjectionStateHelper(false, "injection_parts/return/homepage_videos_per_row.css");
                    setInjectionStateHelper(true, "injection_parts/return/homepage_videos_per_row.css");
                }
            }
        }
    }).catch((error) => {
        console.error(error);
    });
}

// Initial setup/initial receive
console.log("Running initial applySettings...");
settingsToActions();


// SPECIFICS TO YOUTUBE.COM
/*
* SPECIFIC TO YOUTUBE - listens for all video changes and re-applies
* */
const videoObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'src') {

        }
    });
});

// Observe changes
videoObserver.observe(document.querySelector("video"), { attributes: true, attributeFilter: ['src'] });

