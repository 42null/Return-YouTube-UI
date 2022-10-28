const style = document.createElement('style');
style.innerHTML = `
    #thumbnail{
        border-radius: 0 !important;
    }
    #container.ytd-searchbox {
        border-radius: 2px 0px 0px 2px  !important;
    }
    button#search-icon-legacy {
        border-radius: 0px 2px 2px 0px !important;
    }
    `;
/* Still Need to polish

*/

document.head.appendChild(style);