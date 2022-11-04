//TODO:
// The ability to inject JavaScript or CSS into the tab programmatically, using browser.tabs.executeScript() and browser.tabs.insertCSS()
//https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/permissions


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
        color: var(--yt-spec-static-brand-white) !important;
        background-color: var(--yt-spec-brand-button-background) !important;/*Bring back the red instead of the white*/
        border-radius: 2px !important;
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

/* Delay of 1 second*/
setTimeout(function(){
    let elements = document.getElementsByClassName("style-scope yt-formatted-string bold");
    for(let i = 0; i < elements.length; i++){
        if(elements[i].innerText.endsWith("ago")){
            elements[i].style.border = "dotted red 1px";

            let datePublished = document.querySelectorAll("meta[itemprop='datePublished']")[0].getAttribute("content");
            elements[i].innerText = datePublished;

            /*
            const words = elements[i].innerText.split(" ");
            const timeUnitsAmount = words[0];
            const timeUnit = words[1];

            //Oct 18, 2022
            const date = new Date();

            let day = date.getDate();
            let month = date.getMonth() + 1;
            let year = date.getFullYear();
            switch(timeUnit) {
                case "hours":
                    break;
                case "years":
                    // elements[i].innerText = year-timeUnitsAmount;
                    break;
                case "months":
                    break;
                default:
                // code block
            }*/

        }
    }
}, 1000);//Figure out how to make on load

document.head.appendChild(style);
