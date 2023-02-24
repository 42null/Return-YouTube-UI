function unroundLinkWindows() {
    let windows = document.querySelectorAll('.ytp-ce-covering-overlay');

    for (let i = 0; i < windows.length; i++) {
        windows[i].parentElement.style.borderRadius = '0px';
    }
}

unroundLinkWindows();