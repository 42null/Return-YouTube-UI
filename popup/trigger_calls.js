const settingsListElement = document.getElementById("settingsOptionsList");
// const appPreferencesListElement = document.getElementById("settingsOptionsList");

let determinedBrowserAPI = typeof browser !== 'undefined' ? browser : chrome;

// CREATE TABLE
getApplySettings(KEY_STORAGE_LOCAL_APPLYING_SETTINGS).then((applySettings) => {
    console.log("[Return Youtube UI]: Initial applySettings:", applySettings);
    console.log("[Return Youtube UI]: Settings used:");
    const keys = Object.keys(applySettings);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const displayName = applySettings[keys[i]].displayName;
        const value = applySettings[keys[i]].value;
        const needsReload = applySettings[keys[i]].needsReload;
        console.log("[Return Youtube UI]:   " + key + ": " + value);

        // Table Builder
        const row = settingsListElement.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);

        cell1.innerText = displayName;
        if(needsReload){
            const reloadWarning = document.createElement("span");//TODO: Make reusable
            reloadWarning.classList.add("reloadWarning");
            cell1.append(reloadWarning);
        }


        if (typeof value == "boolean") {
            const label = document.createElement('label');
            label.classList.add("switch");
            const input = document.createElement('input');
            input.type = "checkbox";
            input.id = "idAuto_" + key;
            input.name = "nameAuto_" + key;
            input.checked = value;

            const span = document.createElement("span");
            span.classList.add("slider", "round");//TODO: Make option for without round

            label.appendChild(input);
            label.appendChild(span);
            cell2.appendChild(label);

            localCopyApplySettings[key].value = input.checked; // Change a setting
            applySettingsUpdate();
        }else if(Number.isInteger(parseInt(value))){
            const label = document.createElement('label');
            label.classList.add("integerBox");
            const input = document.createElement('input');
            input.type = "number";
            input.id = "idAuto_" + key;
            input.name = "nameAuto_" + key;
            input.value = parseInt(value);
            // Check if input settings were provided
            if(typeof applySettings[keys[i]].min){
                input.min = applySettings[keys[i]].min;
            }
            if(typeof applySettings[keys[i]].max){
                input.max = applySettings[keys[i]].max;
            }
            if(typeof applySettings[keys[i]].placeholder){
                input.placeholder = applySettings[keys[i]].placeholder;
            }
            if(typeof applySettings[keys[i]].step){
                input.step = applySettings[keys[i]].step;
            }

            input.classList.add("numberBox");//TODO: Make option for without round

            label.appendChild(input);
            cell2.appendChild(label);

            localCopyApplySettings[key].value = parseInt(value); // Change a setting
            applySettingsUpdate();
        }
    }

}).catch((error) => {
    console.error(error);
});





// Major button processing
function listenForClicks() {//TODO: Merge components with getApplySettings initial
    document.addEventListener("click", (e) => {
        /**
         * Remove the page-hiding CSS from the active tab,
         * send a "reset" message to the content script in the active tab.
         */
        function reapplyGeneratedJS(tabs) {
            determinedBrowserAPI.tabs.sendMessage(tabs[0].id, {
                command: "ManuallyReApplyJSPageModifications",//TODO: Come up with better message
            });

        }

        /**
         * Just log the error to the console.
         */
        function reportError(error) {
            console.error(`[Return Youtube UI]: Could not edit page, most likely page is not permitted in manifest: ${error}`);
        }

        /**
         * Get current tab, for selecting tabs see for others: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/Tabs/query
         * then call functions as appropriate.
         */

        if (e.target.type === "submit") {
            if (e.target.id === "reloadExtension") {
                determinedBrowserAPI.runtime.reload();
            } else if (e.target.id === "settingsPageButton" && !settingsListElement.unhideable) {
                if (settingsListElement.classList.contains("hidden")) {
                    settingsListElement.classList.remove("hidden");
                    // Get the vertical scrollbar element dimensions

                    // var width = document.body.clientWidth;
                    // var height = document.body.clientHeight;
                    // console.log(width);
                    // console.log(height);
                } else {
                    settingsListElement.classList.add("hidden");
                }

            } else if (e.target.id === "ManuallyReApplyJSPageModifications") {
                determinedBrowserAPI.tabs.query({currentWindow: true, active: true}).then(reapplyGeneratedJS).catch(reportError);//TODO: Make double check for if a YouTube page.
            }
        } else if (e.target.type === "checkbox") {
            console.log(e.target.attributes);
            const currentApplySettingKey = e.target.id.replace("idAuto_", "");
            // console.log(e.target.attributes);

            determinedBrowserAPI.storage.local.get("applying_settings", async (result) => {
                result[KEY_STORAGE_LOCAL_APPLYING_SETTINGS][currentApplySettingKey].value = e.target.checked;
                try {
                    try {
                        const newSettings = JSON.parse(JSON.stringify(result)).applying_settings;
                        newSettings[currentApplySettingKey].value = e.target.checked;
                        await determinedBrowserAPI.storage.local.set({"applying_settings": newSettings});
                        console.log("Storage set successfully");
                    }catch(e2){
                        console.log("Error="+e2);
                    }
                } catch (error) {
                    console.error(`Error setting storage: ${error}`);
                }
            });
        } else if (e.target.type === "number") {
            console.log(e.target.attributes);
            const currentApplySettingKey = e.target.id.replace("idAuto_", "");
            // console.log(e.target.attributes);

            determinedBrowserAPI.storage.local.get("applying_settings", async (result) => {
                result[KEY_STORAGE_LOCAL_APPLYING_SETTINGS][currentApplySettingKey].value = e.target.checked;
                try {
                    try {
                        const newSettings = JSON.parse(JSON.stringify(result)).applying_settings;
                        newSettings[currentApplySettingKey].value = parseInt(e.target.value);
                        await determinedBrowserAPI.storage.local.set({"applying_settings": newSettings});
                        console.log("Storage set successfully");
                    }catch(e2){
                        console.log("Error="+e2);
                    }
                } catch (error) {
                    console.error(`Error setting storage: ${error}`);
                }
            });
        }
    });
}

/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function reportExecuteScriptError(error) {
    document.querySelector("#popup-content").classList.add("hidden");
    document.querySelector("#error-content").classList.remove("hidden");
    document.querySelector("body").classList.remove("hasVerticalOverflowCausingHorizontal");
    logWithConfigMsg(`Failed to execute content script: ${error.message}`);
}

/**
 * When the popup loads, inject a content script into the active tab,
 * and add a click handler.
 * If we couldn't inject the script, handle the error.
 */
// UPDATE FROM MV2 to MV3
// browser.tabs.executeScript({file: "/content_scripts/function_broker.js"})
//     .then(listenForClicks)
//     .catch(reportExecuteScriptError);
determinedBrowserAPI.tabs.query({active: true, currentWindow: true})
    .then((tabs) => {
        determinedBrowserAPI.scripting.executeScript({
            target: {tabId: tabs[0].id},
            files: ['/content_scripts/function_broker.js']
        })
            .then(listenForClicks)
            .catch(reportExecuteScriptError);
    });

document.querySelector("body").classList.add("hasVerticalOverflowCausingHorizontal");//TODO: Document & rename


// browser.permissions.contains({
//     permissions: ['*://*.youtube.com/*'],
//     origins: ['*://*.youtube.com/*']
// }).then((result) => {
//     if (result.permissions && (result.permissions.indexOf('*://*.youtube.com/*') !== -1) &&
//         result.origins && (result.origins.indexOf('*://*.youtube.com/*') !== -1)) {
//         if (result.granted) {
//             console.log('The extension has permission to read and change data.');
//         } else {
//             console.log('The extension does not have permission to read and change data.');
//         }
//     } else {
//         console.log('The extension does not have the necessary permissions.');
//     }
// });
