/*
The starting point of this file started as a fork from the example repository in
https://github.com/mdn/webextensions-examples/tree/master/beastify (beastify.css)
*/

/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
function listenForClicks() {
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
      if(e.target.id === "reloadExtension"){
        browser.runtime.reload();
      }else if(e.target.id === "ManuallyReApplyJSPageModifications"){
        browser.tabs.query({currentWindow: true, active: true}).then(reapplyGeneratedJS).catch(reportError);//TODO: Make double check for if a youtube page.
      }
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
