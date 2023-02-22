/**
 * This script controls the look and available options on the popup page
 */

//TODO: Visible name correlation (make inside default?)

//VISIBLE BUTTONS

// const majorButtons = document.querySelectorAll("div.majorButton>button");
// function getMajorButton(idString){ return majorButtons.getElementById(idString); }

// const majorButtonEditSettings = getMajorButton("settingsPageButton");

// console.log("majorButtonEditSettings ="+majorButtonEditSettings.textContent);
const majorButtonEditSettings    = document.getElementById("settingsPageButton");
const majorButtonEditPreferences = document.getElementById("extensionPreferencesPageButton").parentElement;
const majorButtonReloadExtension = document.getElementById("reloadExtension").parentElement;


// Hide removing options
majorButtonEditPreferences.classList.add("hidden");
majorButtonReloadExtension.classList.add("hidden");

// TODO: Decide if this is the best way to do this
document.getElementById("settingsOptionsList").unhideable = true;
