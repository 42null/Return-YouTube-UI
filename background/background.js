browser.runtime.onInstalled.addListener(function(details) {
    if(details.reason == "install") {
        // Open a new page on first install
        browser.tabs.create({ url: "releaseInfo/welcome.html" });
    } else if(details.reason == "update") {
        // browser.tabs.create({ url: "release.html" });
    }
});
