// This function is taken from https://stackoverflow.com/a/61511955/16041898
function waitForElm(selector){
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

    });
}


waitForElm('#actions-inner').then((elm) => {
    logWithConfigMsg("Element is ready");
    save_visible_before_clip(true);
});


/**
 * Moves the save button before the clip button.
 * @param apply if null or true it applies, false it undoes.
 */
function save_visible_before_clip(apply){
    let actionsRightOfDislike = document.querySelectorAll(".ytd-menu-renderer>ytd-button-renderer.style-scope.ytd-menu-renderer");
    let actionsRightOfDislikeHidden = document.querySelectorAll("tp-yt-paper-item.style-scope.ytd-menu-service-item-renderer");
    let shareButton  = null;
    let saveButton   = null;
    let thanksButton = null;
    let clipButton   = null;
    let hiddenSaveButton = null;
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
    for (let i = 0; i < actionsRightOfDislikeHidden.length; i++){
        const actionRightOfDislikeHidden = actionsRightOfDislike[i].textContent;
        if(actionRightOfDislikeHidden.includes("Save")){
            if(hiddenSaveButton){
                hiddenSaveButton = actionsRightOfDislikeHidden[i];
                break;
            }
        }
    }

    logWithConfigMsg("Save visible before clip function called");

    /*Need to check to avoid error on null, checks all just for completeness and just
     in case something get changed by another extension or a different view setting*/
    if(apply === true){
        // alert("1");
        if(saveButton && shareButton){
            actionsRightOfDislike[0].parentNode.insertBefore(saveButton, shareButton);
            // saveButton.style.backgroundColor = "red";
            if(hiddenSaveButton){
                hiddenSaveButton.style.backgroundColor = "orange";
                hiddenSaveButton.remove();
            }
        }
            // shareButton.before(saveButton);
    }else{
        // alert("2");

        if(saveButton && shareButton)
            actionsRightOfDislike[0].parentNode.insertAfter(shareButton, saveButton);
    }

    // alert(actionsRightOfDislike.length);

}

