# Return YouTube UI

An extension aimed at making YouTube look like it did before they made everything rounded. Firefox officially supported, not all features currently compatible with Chromium-based browsers.


_Major releases are published to the Firefox Add-Ons page as an extension ([addons.mozilla.org/...](https://addons.mozilla.org/en-US/firefox/addon/return-youtube-ui/)) and will receive new updates as the settings are moved to the popup window along with new features. To install another version or your own fork, visit [firefox-source-docs.mozilla.org/...](https://firefox-source-docs.mozilla.org/devtools-user/about_colon_debugging/index.html) for instructions (or just enter [about:debugging#/runtime/this-firefox](https://addons.mozilla.org/en-US/firefox/addon/return-youtube-ui/)) into your url-bar._

<div style="text-align: center;">
    <img src="./icons/ReturnYouTubeUIIconV2R2_512.png" alt="[Return YouTube UI Logo]" width="128" height="auto" />
    <img src="./Screenshots/PopupPageFullSettings_latestTOP.png" alt="[Return YouTube UI Logo]" width="128" height="auto" />
</div>

---

## Settings & Customization Flags

Settings control is being migrated to the extension popup page. With the latest versions, some settings have been moved while others are still only available to be set as static variables before installation. Those values can be adjusted by setting flags at the very top of "_returnYouTubeUI.js_".

#### Items that are the core principles of return are on by default
| Setting                            | Default & Location     | Description                                                                                                                                      |
|------------------------------------|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|
| Search Bar                         | true (popup)           | Reverts the radius of search bar back to how it was before.                                                                                      |
| Subscribe Color                    | true (popup)           | Brings back the red to the subscribe color.                                                                                                      |
| Subscribe Shape                    | true (popup)           | Brings back the shape subscribe color.                                                                                                           |
| Menus                              | true (popup)           | Un-rounds borders in all (found) menus.                                                                                                          |
| Thumbnails                         | true (popup)           | Hardens corners for thumbnails mini-players everywhere.                                                                                          |
| Action Buttons                     | true (popup)           | Removes borders on action bar buttons.                                                                                                           |
| SAVE_VISIBLE_BEFORE_CLIP           | true (static)          | Places save action before the clip action, not yet working in all environments.                                                                  |
| PROPER_DATES                       | true (static)          | Works in some cases, not active priority. Changes main video date info from "<#> years/months/etc. ago" to it's published date.                  |
| PERCENT_MORE_SPACE_TO_ACTIONS_BAR  | 0 (static/extras)      | +5 for adding one more action, for example, showing share, clip, and save instead of just share and clip. +5 recommended by personal preference. |
| SHOW_VIDEO_LENGTH_IN_NOTIFICATIONS | Planned (false/extras) | Shows video length in notifications like it does in thumbnail views.                                                                             |
| SHOW_CHANGES_BACKGROUNDS           | Planned (false/extras) | Changes background color of all changed elements for demonstration.                                                                              |

<hr/>

## How You Can Help

If you try it out, please let me know if the changes feels natural on your device/aspect ratio.

**In addition, any screenshots or saved pages from before the UI change would be appreciated if you have them. Finding differences that could be applied without creating the old view from scratch would simplify the process.**

Feel free to message me with any questions or suggestions! :)
