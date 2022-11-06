//TODO:
// The ability to inject JavaScript or CSS into the tab programmatically, using browser.tabs.executeScript() and browser.tabs.insertCSS()
//https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/permissions

/* SETTINGS */
/*
   Settings are established by default to reset YouTube to look how it did just before the circular UI rework,
   leave all settings true to return to how it used to be, this changes shapes but also some other things such
   as colors and text.
*/

/*At current state not all variables are used, functionally will be added as the project progresses*/
const         UN_ROUNDED_VIEWS = true; //Makes views squared
const             PROPER_DATES = true; //Changes main video date info from "<#> years/months/etc. ago" to it's formatted date
const   SUBSCRIBE_BUTTON_COLOR = true; //Changes subscribed button from white to the original red
const SAVE_VISIBLE_BEFORE_CLIP = true;

/* Extras (Disabled by default) */
const SHOW_VIDEO_LENGTH_IN_NOTIFICATIONS = false;


const style = document.createElement('style');

style.innerHTML = `
/*THUMBNAILS*/
    #thumbnail{
        border-radius: 0 !important;
    }
    .ytp-videowall-still-round-medium .ytp-videowall-still-image{
        background-color: orange !important;
        border-radius: 0 !important;
    }
/*SEARCH BOX (main)*/
    #container.ytd-searchbox {
        border-radius: 2px 0px 0px 2px  !important;
    }
    button#search-icon-legacy {
        border-radius: 0px 2px 2px 0px !important;
    }
/*VIDEO WINDOW LINK INSIDE VIDEO*/
    .ytp-ce-element.ytp-ce-video.ytp-ce-element-show.ytp-ce-size-640, .ytp-ce-video.ytp-ce-large-round, .ytp-ce-playlist.ytp-ce-large-round, .ytp-ce-large-round .ytp-ce-expanding-overlay-background {
        border-radius: 0px !important;
    }
/*FEEDBACK BUTTONS (remove background line to get corners)*/
    [aria-label='Share'], [aria-label='Dislike this video'], [aria-label^='like this video along with '], [aria-label$=' likes'], [aria-label='Clip'], [aria-label='Save to playlist']{
        border-radius: 0px !important;
        background: none !important;
    }
    /*Popup Menus*/
        /*SAVE & SHARE*/
        .ytd-popup-container{
            border-radius: 0 !important;
        }
    
/*SUBSCRIBE THINGS*/
    [aria-label^='Subscribe to ']{
        border-radius: 2px !important;
    `;
if(SUBSCRIBE_BUTTON_COLOR){
    style.innerHTML += `
        color: var(--yt-spec-static-brand-white) !important;
        background-color: var(--yt-spec-brand-button-background) !important;/*Bring back the red instead of the white*/
    `;
}
style.innerHTML += `
    }
    [aria-label^='Unsubscribe from ']{
        border-radius: 2px !important;
    }
/*PLAYLIST LIST*/
    .ytd-playlist-panel-renderer{
        border-radius: 0 !important;
    }
/*MINIPLAYER*/
    video{ /*Also does the main but this should be more efficient*/
        border-radius: 0 !important;
    }
    /*When hovering layer*/
    .ytp-miniplayer-scrim{
        border-radius: 0 !important;
    }
/*NOTIFICATIONS*/ /*Also taken care of under "Popup Menus"
    ytd-multi-page-menu-renderer{
        border-radius: 0 !important;
    }*/
        
    /*[data-layer="4"]{
        background-color: blue !important;
        background-color:red !important;
    }*/
/*ANNOTATIONS*/
/*PLAYER SETTINGS*/
    .ytp-settings-menu{
        border-radius: 0 !important;
    }

    
`;

document.head.appendChild(style);

/* Delay of 1 second*/ //Figure out how to make on load correctly
setTimeout(function(){
    
    if(PROPER_DATES){
        let elementsOfFirstRowInDetails = document.getElementsByClassName("style-scope yt-formatted-string bold");
        for(let i = 0; i < elementsOfFirstRowInDetails.length; i++){
            if(elementsOfFirstRowInDetails[i].innerText.endsWith("ago")){//If the element was the one that needs to be replaced with the formatted date
                elementsOfFirstRowInDetails[i].textContent = document.querySelectorAll("yt-formatted-string.style-scope.ytd-video-primary-info-renderer")[2].textContent;
            }
        }
    }
    if(SAVE_VISIBLE_BEFORE_CLIP){
        let elements = document.querySelectorAll('#flexible-item-buttons.style-scope.ytd-menu-renderer > ytd-button-renderer.style-scope.ytd-menu-renderer');

        for(let i = 0; i < elements.length; i++){
            elements[i].style.backgroundColor = "blue";
        }
        elements[0].style.backgroundColor = "pink";
        elements[1].style.backgroundColor = "red";
        let container = document.querySelectorAll("#flexible-item-buttons.style-scope.ytd-menu-renderer")[0];
        container.appendChild(elements[0]);

    }
}, 2000);