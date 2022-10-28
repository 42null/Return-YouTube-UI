const style = document.createElement('style');
style.innerHTML = `
*{
    border-radius: 0 !important;
}

#voice-search-button{
    background-color: red !important;
    border-radius: 100% !important;
}
#search{
    border-radius: 1px !important;
}
#avatar > img{
    background-color: red !important;
    border-radius: 100vh !important;
}
    `;

// style-scope ytd-topbar-menu-button-renderer no-transition

/* Still Need to polish

#search

*/

document.head.appendChild(style);