/*
   Settings are established by default to reset YouTube to look how it did just before the circular UI rework,
   leave all settings true to return to how it used to be, this changes shapes but also some other things such
   as colors and text.
*/

const PROPER_DATES = true; //Changes main video date info from "<#> years/months/etc. ago" to it's formatted date

//Created pages to inject
let script = document.createElement('script');
let activator = document.createElement('script');

//Element to hold injected items and insert within
let injectedDiv = document.createElement("div");

//SWITCHING FOR CROSS-COMPATABILITY BETWEEN BROWSERS //TODO: Remove duplication
    // Select the correct browser object
let determinedBrowserAPI = typeof browser !== 'undefined' ? browser : chrome;

function getProjectConfiguration() {//TODO: Reduce duplicate code
    return fetch(determinedBrowserAPI.runtime.getURL('projectConfiguration.json'))
        .then(response => response.json())
        .then(data => data);
}
getProjectConfiguration().then(projectConfiguration => { localStorage.setItem("ProjectConfiguration", JSON.stringify(projectConfiguration));});
projectConfiguration = JSON.parse(localStorage.getItem("ProjectConfiguration"));

function logWithConfigMsg(...messages){
    if(projectConfiguration === null){
        getProjectConfiguration().then(gotProjectConfiguration => {
            projectConfiguration = JSON.stringify(gotProjectConfiguration);
            for(const message of messages){
                console.log("["+projectConfiguration.log_header+"]: "+message);
            }
        });
    }else{
        for(const message of messages){
            console.log("["+projectConfiguration.log_header+"]: "+message);
        }
    }
}

determinedBrowserAPI.permissions.request({
    permissions: ['*://*.youtube.com/*']
}, function(granted) {
    if (granted) {
        logWithConfigMsg("Permission granted for access without clicking the extension button each time");

    } else {
        logWithConfigMsg("Permission denied for access without clicking the extension button each time");
    }
});




async function createElementLink(sheetName) {
    if(sheetName.endsWith(".css")){
        logWithConfigMsg("Linking style name ="+sheetName);
        const stylesheetLinkElement = document.createElement('link');
        stylesheetLinkElement.rel = 'stylesheet';
        stylesheetLinkElement.type = 'text/css';
        stylesheetLinkElement.href = determinedBrowserAPI.runtime.getURL(sheetName);
        return stylesheetLinkElement;
    }else if(sheetName.endsWith(".js")){
        logWithConfigMsg("Linking script name ="+sheetName);
        const jsSheetLinkElement=document.createElement('script')
        jsSheetLinkElement.setAttribute("type","text/javascript")
        jsSheetLinkElement.setAttribute("src", determinedBrowserAPI.runtime.getURL(sheetName))
        return jsSheetLinkElement;
    }
    // primary stylesheetLinkElement;
}


let helperFunctions;


helperFunctions = createElementLink("injection_partsconsole.log/helper_functions.js");
document.head.appendChild(helperFunctions);

/* Video link windows inside the player that show up during playtime */

script.innerHTML = `
    function applyGeneratedScripts(){
        console.log("[`+projectConfiguration.log_header+`]: Activator call was received");
    `;

if(PROPER_DATES){
    script.innerHTML += `
        let elementsOfFirstRowInDetails = document.getElementsByClassName("style-scope yt-formatted-string bold");
        for(let i = 0; i < elementsOfFirstRowInDetails.length; i++){
            if(elementsOfFirstRowInDetails[i].innerText.endsWith("ago")){//If the element was the one that needs to be replaced with the formatted date
                elementsOfFirstRowInDetails[i].textContent = document.querySelectorAll("yt-formatted-string.style-scope.ytd-video-primary-info-renderer")[2].textContent;
            }
        }
    `;
}


script.innerHTML+=` };`;

injectedDiv.appendChild(script);


/* Run the scrips again that were added to the page using this as YouTube switches videos
   in a way that makes it difficult to just see if the page url changes. This also means
   we do not need to worry about losing the function we created between different pages. */
activator.innerHTML = `
    let video = document.getElementsByTagName('video')[0];
    let lastSrc = "-1";
    video.addEventListener('playing', function() {
        if(video.src !== lastSrc){
            lastSrc = video.src;
            applyGeneratedScripts();
        }
    });
    
`;

let injectedInvisibleClickable = document.createElement("button");
injectedInvisibleClickable.id = "returnYoutubeUI_invisibleClickable";
injectedInvisibleClickable.nodeName = "returnYoutubeUI_invisibleClickable";
document.body.appendChild(injectedInvisibleClickable);
activator.innerHTML+= `
    document.getElementById("returnYoutubeUI_invisibleClickable").addEventListener("click", function(){
        console.log("[`+projectConfiguration.log_header+`]: injectedInvisibleClickable was 'clicked'");
        applyGeneratedScripts();
    });
`;

document.body.appendChild(injectedDiv);
document.body.appendChild(activator);

document.getElementById("returnYoutubeUI_invisibleClickable").addEventListener("change", function(){
    logWithConfigMsg("injectedInvisibleClickableChangeListener was triggered");
});