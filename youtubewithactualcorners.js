const style = document.createElement('style');
style.innerHTML = `
/*THUMBNAILS*/
    #thumbnail{
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
    .ytp-ce-element.ytp-ce-video.ytp-ce-element-show.ytp-ce-medium-round.ytp-ce-top-left-quad.ytp-ce-size-640{
        border-radius: 0px !important;
    }
    `;
/* Still Need to polish

*/

document.head.appendChild(style);