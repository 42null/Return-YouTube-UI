const settingsListElement = document.getElementById("settingsOptionsList");
// const appPreferencesListElement = document.getElementById("settingsOptionsList");


// CREATE TABLE
getApplySettings(KEY_STORAGE_LOCAL_APPLYING_SETTINGS).then((applySettings) => {
    console.log("[Return Youtube UI]: Initial applySettings:", applySettings);
    console.log("[Return Youtube UI]: Settings used:");
    const keys = Object.keys(applySettings);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const displayName = applySettings[keys[i]].displayName;
        const value = applySettings[keys[i]].value;
        console.log("[Return Youtube UI]:   " + key + ": " + value);

        // Table Builder
        const row = settingsListElement.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        cell1.innerText = displayName;

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

            // label.addEventListener('change', async event => {
            //
            //     console.log("label.eventListener = " + input.name + " ");
            //     // resolveApplication();//TODO move into individual and have in the eventListener?
            //     applySettings[keys[i]] = input.checked;
            //     label.value = input.checked;
            //     browser.tabs.query({active: true, currentWindow: true})
            //         .then(tabs => {
            //             // send message to active tab
            //             // console.log("DID IT !!!!!");
            //             console.log('[return youtube ui]; input.checked in trigger=' + input.checked)
            //             browser.tabs.sendMessage(tabs[0].id, {
            //                 targetName: '',
            //                 checkYourself: input.checked
            //             });
            //         })
            //         .catch(error => console.error(error));
            //     // saveData(KEY_STORAGE_LOCAL_APPLYING_SETTINGS, applySettings);
            // });

            localCopyApplySettings[key].value = input.checked; // Change a setting
            // localCopyApplySettings[key] = JSON.parse(JSON.stringify({"value":false}));
            // {"UN_ROUNDED_SEARCH":{"value":true}}
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
            browser.tabs.sendMessage(tabs[0].id, {
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
                browser.runtime.reload();
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
                browser.tabs.query({currentWindow: true, active: true}).then(reapplyGeneratedJS).catch(reportError);//TODO: Make double check for if a youtube page.
            }
        } else if (e.target.type === "checkbox") {
            console.log(e.target.attributes);
            const currentApplySettingKey = e.target.id.replace("idAuto_", "");
            // console.log(e.target.attributes);

            browser.storage.local.get("applying_settings", async (result) => {
                result[KEY_STORAGE_LOCAL_APPLYING_SETTINGS][currentApplySettingKey].value = e.target.checked;
                try {
                    try {
                        const newSettings = JSON.parse(JSON.stringify(result)).applying_settings;
                        newSettings[currentApplySettingKey].value = e.target.checked;
                        await browser.storage.local.set({"applying_settings": newSettings});
                        console.log("Storage set successfully");
                    }catch(e2){
                        console.log("Error="+e2);
                    }
                } catch (error) {
                    console.error(`Error setting storage: ${error}`);
                }
                });
        } else {

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
    console.error(`[Return Youtube UI]: Failed to execute content script: ${error.message}`);
}

/**
 * When the popup loads, inject a content script into the active tab,
 * and add a click handler.
 * If we couldn't inject the script, handle the error.
 */
browser.tabs.executeScript({file: "/content_scripts/function_broker.js"})
    .then(listenForClicks)
    .catch(reportExecuteScriptError);
