const style = document.createElement('style');
style.innerHTML = `
#ttttttt{
    border-radius: 0 !important;
}

#ttttttvoice-search-button{
    background-color: red !important;
    border-radius: 100% !important;
}
#search{
    border-radius: 1px !important;
}
#ttttttavatar-btn > img{
    background-color: red !important;
    border-radius: 100vh !important;
}
#thumbnail{
    background-color: red !important;
    border-radius: 0 !important;
}
    `;

// style-scope ytd-topbar-menu-button-renderer no-transition

/* Still Need to polish

#search

*/

document.head.appendChild(style);