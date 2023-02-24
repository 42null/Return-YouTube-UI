/**
 * This script controls the look and available options on the popup page
 */

//TODO: Visible name correlation (make inside default?)

//VISIBLE BUTTONS
const majorButtonEditPreferences = document.getElementById("extensionPreferencesPageButton").parentElement;
const majorButtonReloadExtension = document.getElementById("reloadExtension").parentElement;


// Hide removing options
majorButtonEditPreferences.classList.add("hidden");
majorButtonReloadExtension.classList.add("hidden");

// TODO: Decide if this is the best way to do this
document.getElementById("settingsOptionsList").unhideable = true;
