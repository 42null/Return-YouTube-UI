/* SETTINGS */

/*
   Settings are established by default to reset YouTube to look how it did just before the circular UI rework,
   leave all settings true to return to how it used to be, this changes shapes but also some other things such
   as colors and text.
*/

/*DISCLAIMER! At current state not all variables are used, functionally will be added as the project progresses*/
const UN_ROUNDED_EXPANDING_HOVER = true; //Makes all website expanding link descriptions inside the video frame square like they were originally.
const               PROPER_DATES = true; //Changes main video date info from "<#> years/months/etc. ago" to it's formatted date
const   SAVE_VISIBLE_BEFORE_CLIP = true; //Places save action before the clip action

/* Extras (Disabled by default) */
const PERCENT_MORE_SPACE_TO_ACTIONS_BAR = 0;//+5 for adding one more option, for example, showing share, clip, and save instead of just share and clip


//Created pages to inject
let style = document.createElement('style');
let script = document.createElement('script');
let activator = document.createElement('script');


//Element to hold injected items and insert within
let injectedDiv = document.createElement("div");


function createElementLink(sheetName) {
    console.log("Linking name ="+sheetName);
    if(sheetName.endsWith(".css")){
        const stylesheetLinkElement = document.createElement('link');
        stylesheetLinkElement.rel = 'stylesheet';
        stylesheetLinkElement.type = 'text/css';
        stylesheetLinkElement.href = browser.runtime.getURL(sheetName);
        return stylesheetLinkElement;
    }else if(sheetName.endsWith(".js")){
        const jsSheetLinkElement=document.createElement('script')
        jsSheetLinkElement.setAttribute("type","text/javascript")
        jsSheetLinkElement.setAttribute("src", browser.runtime.getURL(sheetName))
        return jsSheetLinkElement;
    }
    // return stylesheetLinkElement;
}

let helperFunctions;

let unroundedLinkWindowsJS;
let saveVisibleBeforeClip;


helperFunctions = createElementLink("injection_partsconsole.log/helper_functions.js");
document.head.appendChild(helperFunctions);

/* Video link windows inside the player that show up during playtime */

script.innerHTML = `
    function applyGeneratedScripts(){
        console.log("[Return Youtube UI]: Activator call was received");
    `;


/* Website link windows inside the player that show up during playtime are square but when
 they expand after being hovered over, they expand to have rounded corners after the UI update,
 if this setting is true, then the corners will be removed to their original state. */
if(UN_ROUNDED_EXPANDING_HOVER){
    script.innerHTML += `
        let expandingDescriptions = document.querySelectorAll('.ytp-ce-expanding-overlay-background');
    
        for (let i = 0; i < expandingDescriptions.length; i++) {
            expandingDescriptions[i].parentElement.style.borderRadius = '0px';
            expandingDescriptions[i].style.borderRadius = 'inherit';//Allows it to also cover channel links which are not always caught
        }
    `;
}

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

if(SAVE_VISIBLE_BEFORE_CLIP){
    saveVisibleBeforeClip = createElementLink("injection_parts/return/save_visible_before_clip.js");
    document.head.appendChild(saveVisibleBeforeClip);
}


if(PERCENT_MORE_SPACE_TO_ACTIONS_BAR !== 0){
    script.innerHTML += `
        let elements3 = document.getElementById("actions");
        elements3.style.minWidth = "calc(5"+`+PERCENT_MORE_SPACE_TO_ACTIONS_BAR+`+"% - 6px)";
        elements3.style.marginLeft = "-"+`+PERCENT_MORE_SPACE_TO_ACTIONS_BAR+`+"%";
    `;
}

script.innerHTML+=` unroundLinkWindows();`;
script.innerHTML+=` };`;

//Append id's so the injected-ids can be located
style.id = "returnYoutubeUI_style";

injectedDiv.appendChild(style);
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
    // document.getElementById("returnYoutubeUI_invisibleClickable").addEventListener("change", function(){
    //     alert("returnYoutubeUI_invisibleClickable");
    //     console.log(("returnYoutubeUI_invisibleClickable"));
    // });
    
`;
//TODO: Above commented out code is not executing, possible removal

let injectedInvisibleClickable = document.createElement("button");
injectedInvisibleClickable.id = "returnYoutubeUI_invisibleClickable";
injectedInvisibleClickable.nodeName = "returnYoutubeUI_invisibleClickable";
document.body.appendChild(injectedInvisibleClickable);
activator.innerHTML+= `
    document.getElementById("returnYoutubeUI_invisibleClickable").addEventListener("click", function(){
        console.log("[Return Youtube UI]: injectedInvisibleClickable was 'clicked'");
        applyGeneratedScripts();
    });
`;

document.body.appendChild(injectedDiv);
document.body.appendChild(activator);

document.getElementById("returnYoutubeUI_invisibleClickable").addEventListener("change", function(){
    console.log("[Return Youtube UI]: injectedInvisibleClickableChangeListener");
});