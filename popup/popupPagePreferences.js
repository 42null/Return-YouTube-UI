// let popupPageCSS = document.getElementsByTagName('head')[0].querySelector("#popup-style");
let popupPageCSSRoot = document.querySelector(':root');

popupPageCSSRoot.style.setProperty('--md_primary', projectConfiguration.popup_page.colors.primary);
popupPageCSSRoot.style.setProperty('--md_light', projectConfiguration.popup_page.colors.primary_light);
popupPageCSSRoot.style.setProperty('--md_dark', projectConfiguration.popup_page.colors.primary_dark);
popupPageCSSRoot.style.setProperty('--md_greyBack', projectConfiguration.popup_page.colors.primary_light_background);
popupPageCSSRoot.style.setProperty('--md_greyFore', projectConfiguration.popup_page.colors.primary_light_foreground);
popupPageCSSRoot.style.setProperty('--md_textOnP', projectConfiguration.popup_page.colors.primary_text);
popupPageCSSRoot.style.setProperty('--md_sliderBack', projectConfiguration.popup_page.colors.slider_background);
popupPageCSSRoot.style.setProperty('--md_sliderFill', projectConfiguration.popup_page.colors.slider_fill);