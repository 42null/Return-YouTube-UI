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

  document.querySelector("body").classList.add("hasVerticalOverflowCausingHorizontal");

  function manuallyTriggerVideoSwap() {
    let injectedTriggerFound = document.getElementById("returnYouTubeUI_invisibleClickable");
    if(!injectedTriggerFound){//If it is found
      console.log("Injected trigger not found, adding again and recalling.");//TODO: Connect to projectConfiguration.json once re-enabled
      let injectedInvisibleClickable = document.createElement("button");
      injectedInvisibleClickable.id = "returnYouTubeUI_invisibleClickable";
      injectedInvisibleClickable.nodeName = "returnYouTubeUI_invisibleClickable";
      document.body.appendChild(injectedInvisibleClickable);//TODO: DUPLICATE CODE, FIX
      injectedTriggerFound = document.getElementById("returnYouTubeUI_invisibleClickable");
    }
    injectedTriggerFound.click();// = document.createElement("returnYouTubeUI_invisibleClickable");

  }

  /**
   * Listen for messages from the background script.
   * Call the function
   */
  determinedBrowserAPI.runtime.onMessage.addListener((message) => {
    if (message.command === "ManuallyReApplyJSPageModifications") {
      manuallyTriggerVideoSwap();
    }
  });

})();
