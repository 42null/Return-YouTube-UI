# Return YouTube UI

An extension aimed at making YouTube look like it did before they made everything rounded. Firefox officially supported, not all features currently compatible with Chromium-based browsers.


_Major releases are published to the Firefox Add-Ons page as an extension ([addons.mozilla.org/...](https://addons.mozilla.org/en-US/firefox/addon/return-youtube-ui/)) and will receive new updates as the settings are moved to an Add-On window and more features are flushed out. To install another version or your own fork, visit [firefox-source-docs.mozilla.org/...](https://firefox-source-docs.mozilla.org/devtools-user/about_colon_debugging/index.html) for instructions (or just enter [about:debugging#/runtime/this-firefox](https://addons.mozilla.org/en-US/firefox/addon/return-youtube-ui/)) into your url-bar._

<div style="text-align: center;">
<img src="./icons/ReturnYoutubeUIIconV2R2_512.png" alt="[Return Youtube UI Logo]" width="128" height="auto" />
</div>

---

## Customization Flags

Implemented/In Progress/Planned fixes to revert the UI to pre-"circle crazy" times, these flags can be changed at the very top of "_returnYoutubeUI.js_".

#### DEFAULT ON (Core principles of return)
| OPTION                   | STATUS                                  | DESCRIPTION                                                                                                                                 |
|--------------------------|-----------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| UN_ROUNDED_VIEWS         | Most notice elements covered            | Makes thumbnails&views cornered like they were originally, including others from the search box to notification bar and everything between. |
| PROPER_DATES             | Works in some cases                     | Changes main video date info from "<#> years/months/etc. ago" to it's published date.                                                       |
| SUBSCRIBE_BUTTON_COLOR   | **Working**                             | Changes subscribe button from white/black to the original red (newer notification settings also taken care of).                             |
| SAVE_VISIBLE_BEFORE_CLIP | Under development (works in some cases) | Places save action before the clip action.                                                                                                  |

#### EXTRAS
| OPTION                             | STATUS      | DESCRIPTION                                                                                               |
|------------------------------------|-------------|-----------------------------------------------------------------------------------------------------------|
| SHOW_VIDEO_LENGTH_IN_NOTIFICATIONS | Planned     | Shows video length in notifications like it does in thumbnail views.                                      |
| PERCENT_MORE_SPACE_TO_ACTIONS_BAR  | **Working** | +5 for adding one more option, for example, showing share, clip, and save instead of just share and clip. |

#### DEBUGGING
| OPTION                   | STATUS  | DESCRIPTION                                               |
|--------------------------|---------|-----------------------------------------------------------|
| SHOW_CHANGES_BACKGROUNDS | Planned | Changes background color of all changed places to orange. |

<hr/>

## How You Can Help

If you try it out, please let me know if the changes feels natural on your device/aspect ratio.

**In addition, any screenshots or saved pages from before the UI change would be appreciated if you have them. Finding differences that could be applied without creating the old view from scratch would simplify the process.**

Feel free to message me with any questions or suggestions! :)
