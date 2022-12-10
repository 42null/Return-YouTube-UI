# Return YouTube UI

An extension aimed at making YouTube look like it did before they made everything rounded. Firefox officially supported, not all features currently compatible with Chromium-based browsers.


_Coming to the Firefox Add-Ons page as an extension once the settings are moved to an Add-On window and a logo is decided on._

<div style="text-align: center;">
<img src="./icons/ReturnYoutubeUIIconV2R2_512.png" alt="[Return Youtube UI Logo]" width="128" height="auto" />
</div>

---

## Customization Flags

Implemented/In Progress/Planned fixes to revert the UI to pre-"circle crazy" times, these flags can be changed at the very top of "_returnYoutubeUI.js_".

#### DEFAULT ON (Core principles of return)
OPTION | STATUS | DESCRIPTION
-------|--------|------------
UN_ROUNDED_VIEWS | Most noticle elements covered | Makes views squared like they were originally, also includes fixed search box at this time.
PROPER_DATES | Works in some cases | Changes main video date info from "<#> years/months/etc. ago" to it's formatted date.
SUBSCRIBE_BUTTON_COLOR | **Working** | Changes subscribe button from white/black to the original red.
SAVE_VISIBLE_BEFORE_CLIP | Under development (works in some cases) | Places save action before the clip action.


#### EXTRAS
OPTION | STATUS | DESCRIPTION
-------|--------|------------
SHOW_VIDEO_LENGTH_IN_NOTIFICATIONS | Planned | Shows video length in notifications like it does in thumbnail views.
PERCENT_MORE_SPACE_TO_ACTIONS_BAR | **Working** | +5 for adding one more option, for example, showing share, clip, and save instead of just share and clip.

#### DEBUGGING
OPTION | STATUS | DESCRIPTION
-------|--------|------------
SHOW_CHANGES_BACKGROUNDS | Planned | Changes background color of all changed places to orange.

<hr/>

## How You Can Help

If you try it out, please let me know if the changes feels natural on your device/aspect ratio.

**In addition, any screenshots or saved pages from before the UI change would be appreciated if you have them. Finding diffrences that could be applied without creating the old view from scratch would simplifly the process.**

Feel free to message me with any questions or suggestions! :)
