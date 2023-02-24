waitForElm('.ytd-menu-renderer>ytd-button-renderer.style-scope.ytd-menu-renderer').then((elm) => {
    console.log('[Return YouTube UI]: Element is ready');
    save_visible_before_clip();
});

function save_visible_before_clip() {
    let actionsRightOfDislike = document.querySelectorAll(".ytd-menu-renderer>ytd-button-renderer.style-scope.ytd-menu-renderer");

    let shareButton = null;
    let saveButton = null;
    let thanksButton = null;
    let clipButton = null;
    for (let i = 0; i < actionsRightOfDislike.length; i++){
        const actionRightOfDislike = actionsRightOfDislike[i].textContent;
        if(actionRightOfDislike.includes("Share")){
            if(!shareButton)
                shareButton = actionsRightOfDislike[i];
        }else if(actionRightOfDislike.includes("Thanks")){
            if(!thanksButton)
                thanksButton = actionsRightOfDislike[i];
        }else if(actionRightOfDislike.includes("Clip")){
            if(!clipButton)
                clipButton = actionsRightOfDislike[i];
        }else if(actionRightOfDislike.includes("Save")){
            if(!saveButton)
                saveButton = actionsRightOfDislike[i];
        }

    }

    console.log("[Return YouTube UI]: save visible before clip");

    /*Need to check to avoid error on null, checks all just for completeness and just
     in case something get changed by another extension or a different view setting*/
    if(saveButton && shareButton)
        actionsRightOfDislike[0].parentNode.insertBefore(saveButton, shareButton);//.parentNode.firstChild
    // if(!clipButton)
    // if(!thanksButton)

    // MOVE and not just  set
}


// save_visible_before_clip();