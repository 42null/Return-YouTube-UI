const determinedBrowserAPI = typeof browser !== 'undefined' ? browser : chrome;

determinedBrowserAPI.runtime.onInstalled.addListener(function(details) {
// browser.runtime.onInstalled.addEventListener((details) => {//TODO: Check/replace this commented out line. Should be using eventListener but it does not work for some reason.
    if(details.reason == "install") {
        // Open a new page on first install
            determinedBrowserAPI.tabs.create({ url: "releaseInfo/welcome.html" });
    } else if(details.reason == "update") {
        // browser.tabs.create({ url: "release.html" });
    }
});