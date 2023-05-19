const settingsListElement = document.getElementById("settingsOptionsList");
// const extensionPreferencesListElement = document.getElementById("popupPreferencesList");

let determinedBrowserAPI = typeof browser !== 'undefined' ? browser : chrome;

function loadProjectConfiguration() {//TODO: Make use returnYouTubeUI.js getProjectConfiguration or add to helperFunctions?
    projectConfiguration = JSON.parse(localStorage.getItem("ProjectConfiguration"));
    // localCopyApplySettings = structuredClone(projectConfiguration.DEFAULT_REVERT_SETTINGS);
}
loadProjectConfiguration();

// START OF PAGE CONSTRUCTION
/**
 * Creates/recreates and populates the settings table
 * @returns {Promise<void>}
 */
async function createAndPopulateTable(){
    // Clears out the existing list contents
    while (settingsListElement.lastElementChild) {
        settingsListElement.removeChild(settingsListElement.lastElementChild);
    }

    getApplySettings(KEY_STORAGE_LOCAL_APPLYING_SETTINGS).then((applySettings) => {
        logWithConfigMsg("Initial applySettings:", applySettings);
        logWithConfigMsg("Settings used:");

        logWithConfigMsg("Settings used:");
        const keys = Object.keys(applySettings);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const displayName = applySettings[keys[i]].displayName;
            const value = applySettings[keys[i]].value;
            const needsReload = applySettings[keys[i]].needsReload;
            logWithConfigMsg("   "+key+": "+value);

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
                const label = document.createElement("label");
                label.classList.add("switch");
                const input = document.createElement("input");
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
                const label = document.createElement("label");
                label.classList.add("integerBox");
                const input = document.createElement("input");
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
}

async function createAndPopulateFooter(){//TODO: Make create instead of just populate
    const footer = document.getElementsByTagName("footer")[0];
    footer.querySelector("#bottommost_message").innerText = projectConfiguration.link_sites.popup_page_footer_bottommost_message;
    const sitesSection = footer.querySelector("#sites_section");
    // Populate eleents in popup window
    sitesSection.querySelector("#link_sites_header").innerText = projectConfiguration.link_sites.link_sites_header;


    const footerSitesTr = footer.querySelector("#sites_list");
    const keys = Object.keys(projectConfiguration.link_sites.sites);
    for (let i = 0; i < keys.length; i++) {
        const site = projectConfiguration.link_sites.sites[keys[i]];
        const th = document.createElement("th");
        th.classList.add("homepageLink");
        const li = document.createElement("li");
        // li.style.backgroundImage = "url('"+site.icon_url+"')";
        site.generatedId = (projectConfiguration.extension_display_name+"-autogenid-"+keys[i]).replace(/\s/g, "-").toLowerCase();
        li.id = site.generatedId;
        const backgroundImageStyle = document.createElement("style");

        backgroundImageStyle.innerText = `#`+site.generatedId+`:before{
                                background-image: url("`+site.icon_url+`");
                            }`;
        footer.appendChild(backgroundImageStyle);
        // footer.appendChild(backgroundImageStyle);

        const a = document.createElement("a");
        a.innerText = site.name;
        a.href = site.link_url;
        a.target = "_blank";
        li.appendChild(a);
        th.appendChild(li);
        footerSitesTr.appendChild(th);
    }
}

// async function waitForProjectConfiguration() {//TODO: Make without wait timer
//     // let gotProjectConfiguration = await getProjectConfiguration();
//     while (projectConfiguration === null) {
//         // Wait for projectConfiguration to be populated
//         await new Promise(resolve => setTimeout(resolve, 50));
//     }
//
//     createAndPopulateTable();
//     createAndPopulateFooter();
// }

// waitForProjectConfiguration();
setTimeout(function() {//TODO: Make without wait timer
    loadProjectConfiguration();
    createAndPopulateTable();
    createAndPopulateFooter();
}, 150);
// getProjectConfiguration().then(gotProjectConfiguration => {
//     createAndPopulateTable();
//     createAndPopulateFooter();
// });
// END OF PAGE CONSTRUCTION


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
            logWithConfigMsg(`Could not edit page, most likely page is not permitted in manifest: ${error}`);//, "error");//TODO: Make error level message passable
        }

        /**
         * Get current tab, for selecting tabs see for others: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/Tabs/query
         * then call functions as appropriate.
         */

        if (e.target.type === "submit") {
            if (e.target.id === "reloadExtension") {
                reloadExtension();
            } else if(e.target.id === "resetSettingsToDefault") {
                projectConfiguration = JSON.parse(localStorage.getItem("ProjectConfiguration"));
                localCopyApplySettings = structuredClone(projectConfiguration.DEFAULT_REVERT_SETTINGS);
                applySettingsUpdate();


                // Save current scroll position as when the page is re-populated, it gets smaller before bouncing back;
                const scrollPosition = document.documentElement.scrollTop;
                // Repopulate settings table first and make sure it's done before restoring position
                createAndPopulateTable();
                setTimeout(() => {//TODO: Get working without timeout and instead on .then()
                    window.scrollTo(0, scrollPosition);
                }, 75);

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
            e.value = e.target.checked;
            sendStoreValue(e);
        } else if (e.target.type === "number") {
            e.value = parseInt(e.target.value);
            sendStoreValue(e);
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


// PAGE METHOD CONSOLIDATIONS
/**
 * Reloads the extension popup page
 */
function reloadExtension(){
    determinedBrowserAPI.runtime.reload();
}

/**
 * Sends value to be stored in browser local storage.
 * @param event that triggered the send
 */
function sendStoreValue(event){
    const value = event.value;
    console.log("Storing attributes: "+event.target.attributes);
    const currentApplySettingKey = event.target.id.replace("idAuto_", "");

    determinedBrowserAPI.storage.local.get("applying_settings", async (result) => {
        result[KEY_STORAGE_LOCAL_APPLYING_SETTINGS][currentApplySettingKey].value = value;
        try {
            try {
                const newSettings = JSON.parse(JSON.stringify(result)).applying_settings;
                newSettings[currentApplySettingKey].value = value;
                await determinedBrowserAPI.storage.local.set({"applying_settings": newSettings});
                console.log("Storage \""+currentApplySettingKey+"\" set to \""+value+"\"successfully");
            }catch(e2){
                console.error(`Error setting storage (at catch1): ${e2}`);
            }
        } catch (error) {
            console.error(`Error setting storage (at catch2: ${error}`);
        }
    });
}