const determinedBrowserAPI = typeof browser !== 'undefined' ? browser : chrome;

const open_page_on_install = true;
const open_page_on_update  = false;
determinedBrowserAPI.runtime.onInstalled.addListener(function(details) {
// browser.runtime.onInstalled.addEventListener((details) => {//TODO: Check/replace this commented out line. Should be using eventListener but it does not work for some reason.
    if(details.reason === "install" && open_page_on_update) {
        // Open a new page on first install
            determinedBrowserAPI.tabs.create({ url: "releaseInfo/onInstalled.html" });
    } else if(details.reason === "update" && open_page_on_update) {
        // determinedBrowserAPI.tabs.create({ url: "releaseInfo/onUpdated.html" });
        // browser.tabs.create({ url: "release.html" });
    }
});