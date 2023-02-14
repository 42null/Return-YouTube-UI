/*
The starting point of this file started as a fork from the example repository in
https://github.com/mdn/webextensions-examples/tree/master/beastify (beastify.css)
*/


// XML receiving code is based on https://stackoverflow.com/a/43553788
let xml;
let xmlSettingsDoc;
xml=new XMLHttpRequest();

const xhr = new XMLHttpRequest();

const settingsListElement = document.querySelector("#settingsOptionsList");


xhr.onload = () => {
  console.log(xhr.responseXML.documentElement.nodeName);
};

xhr.onerror = () => {
  console.log("Error while getting XML.");
};

xhr.open("GET", "../settings.xml");
xhr.responseType = "document";
xhr.send();

xml.addEventListener("load", function done() {
  xmlSettingsDoc = this.responseXML;
  // Update settings list
  let settings = xmlSettingsDoc.getElementsByTagName('setting');
    for (let i = 0; i < settings.length; i++) {
      // const name = settings[i].getAttribute('attributeName');
      const name = settings[i].getElementsByTagName('name')[0].textContent;
      const value = settings[i].getElementsByTagName('value')[0].textContent;
      console.log(name);
      const row = settingsListElement.insertRow();
      const cell1 = row.insertCell(0);
      const cell2 = row.insertCell(1);
      cell1.innerText = name;

      if(value === "false" || value === "true"){
        let label = document.createElement('label');
        label.classList.add("switch");
        let input = document.createElement('input');
        input.type = "checkbox";
        input.id   = "idAuto_"+name;
        input.name = "nameAuto_"+name;
        input.checked = (value==='true');
        let span = document.createElement("span");
        span.classList.add("slider","round");//TODO: Make option for without round

        label.appendChild(input);
        label.appendChild(span);
        cell2.appendChild(label);

        label.addEventListener('change', async event => {

          // Update the XML document with the new value of the setting
          // const setting = xmlSettingsDoc.querySelector('setting[name="' + name + '"]');
          const setting = xmlSettingsDoc.evaluate('//setting[name="UN_ROUNDED_VIEWS"]', xmlSettingsDoc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

          console.log(setting);
          setting.setAttribute('value', input.checked);
          setting.setAttribute('name', "~~~~~");

          // ~~~
          async function saveXML(xml) {
            const response = await fetch('settings.xml');
            const text = await response.text();
            const blob = new Blob([text], {type: 'text/xml'});
            const url = URL.createObjectURL(blob);
            const url2 = new URL(url);
            const fileReader = new FileReader();

            fileReader.onload = async function() {
              const contents = fileReader.result;
              const encoder = new TextEncoder();
              const uint8array = encoder.encode(xml);
              const blob = new Blob([uint8array], {type: 'text/xml'});
              const fileSaver = document.createElement('a');
              fileSaver.href = url2;
              fileSaver.target = '_blank';
              fileSaver.download = 'settings.xml';
              document.body.appendChild(fileSaver);
              fileSaver.click();
              // URL.revokeObjectURL(url);
              // document.body.removeChild(fileSaver);
            }

            // fileReader.readAsText(blob);
          }
          saveXML();

        });
      }
    }
  }, false);

xml.open("GET","../settings.xml",true);
xml.send();



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
      if(e.target.id === "reloadExtension") {
        browser.runtime.reload();
      }else if(e.target.id === "settingsPageButton"){
        if(settingsListElement.classList.contains("hidden")){

          settingsListElement.classList.remove("hidden");
        }else {
          settingsListElement.classList.add("hidden");
        }
      }else if(e.target.id === "ManuallyReApplyJSPageModifications"){
        browser.tabs.query({currentWindow: true, active: true}).then(reapplyGeneratedJS).catch(reportError);//TODO: Make double check for if a youtube page.
      }
    }else if (e.target.type === "checkbox") {
      console.log(e.target.attributes);

      e.target.value = e.target.value === 'false';//Set value to displayed look
      console.log(e.target.checked);
      if(e.target.checked){
      }else{

      }
    }else{

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
