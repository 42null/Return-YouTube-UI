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







// setTimeout(function(){
//     console.log("Executed after 1 second");
//     test();
// }, 5000);