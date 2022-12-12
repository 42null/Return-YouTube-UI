/*
The starting point of this file started as a fork from the example repository in
https://github.com/mdn/webextensions-examples/tree/master/beastify (beastify.js)
*/

(function() {
  /**
   * Check and set a global guard variable.
   * If this content script is injected into the same page again,
   * it will do nothing next time.
   */
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;

  function manuallyTriggerVideoSwap() {
    document.getElementById("injectedInvisibleClickable").click();// = document.createElement("injectedInvisibleClickable");

  }

  /**
   * Listen for messages from the background script.
   * Call the function
   */
  browser.runtime.onMessage.addListener((message) => {
    if (message.command === "ManuallyReApplyJSPageModifications") {
      manuallyTriggerVideoSwap();
    }
  });

})();
