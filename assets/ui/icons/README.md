# Sweetie's Beach Day UI icon assets

This folder is the drop-in home for optional PNG icons used by the stats panel and action buttons. The game keeps the existing CSS cards, buttons, labels, borders, and responsive layout; these PNGs only replace the small decorative icon artwork inside each existing icon badge.

No icon PNG is required. If a file is missing, the game logs one console warning for that path and keeps the current CSS or text fallback without showing a broken image.

## Folder structure

```text
assets/ui/icons/
|-- README.md
|-- stats/
|   |-- stat_joy.png
|   |-- stat_fullness.png
|   |-- stat_energy.png
|   |-- stat_bond.png
|   `-- stat_treats.png
|-- actions/
|   |-- action_pet.png
|   |-- action_treat.png
|   |-- action_water.png
|   |-- action_nap.png
|   |-- action_play.png
|   `-- action_visit_stand.png
`-- misc/
    |-- icon_shell_words.png
    |-- icon_outfits.png
    |-- icon_tricks.png
    |-- icon_settings.png
    |-- icon_currency.png
    |-- icon_nav_left.png
    `-- icon_nav_right.png
```

## Expected stat icons

| Path | UI element |
| --- | --- |
| `assets/ui/icons/stats/stat_joy.png` | Joy stat badge |
| `assets/ui/icons/stats/stat_fullness.png` | Fullness stat badge |
| `assets/ui/icons/stats/stat_energy.png` | Energy stat badge |
| `assets/ui/icons/stats/stat_bond.png` | Bond stat badge |
| `assets/ui/icons/stats/stat_treats.png` | Picnic basket / treat count icon |

## Expected action icons

| Path | UI element |
| --- | --- |
| `assets/ui/icons/actions/action_pet.png` | Pet Sweetie button |
| `assets/ui/icons/actions/action_treat.png` | Give hot dog treat button |
| `assets/ui/icons/actions/action_water.png` | Give water button |
| `assets/ui/icons/actions/action_nap.png` | Nap button |
| `assets/ui/icons/actions/action_play.png` | Play fetch button |
| `assets/ui/icons/actions/action_visit_stand.png` | Visit hot dog stand button |

## Misc future-ready paths

These paths are registered for current or likely future UI affordances. Only rendered elements are checked at runtime.

| Path | Intended use |
| --- | --- |
| `assets/ui/icons/misc/icon_shell_words.png` | Shell Words button |
| `assets/ui/icons/misc/icon_outfits.png` | Outfits placeholder button |
| `assets/ui/icons/misc/icon_tricks.png` | Tricks placeholder button |
| `assets/ui/icons/misc/icon_settings.png` | Future settings icon |
| `assets/ui/icons/misc/icon_currency.png` | Future currency/reward icon |
| `assets/ui/icons/misc/icon_nav_left.png` | Future left navigation artwork |
| `assets/ui/icons/misc/icon_nav_right.png` | Future right navigation artwork |

## Art recommendations

- Use transparent PNGs.
- Square canvases are easiest to align. `128x128`, `256x256`, or another consistent square size is recommended.
- Keep important artwork away from the outer 8-12% edge so it does not feel cramped inside the rounded badge.
- Both styles are supported: a complete circular/badge-like icon PNG, or a transparent glyph-style PNG that sits inside the existing CSS badge.
- Icons render with `object-fit: contain`, so they should not stretch or crop.
- The PNGs are decorative. Button labels and stat labels remain the accessible text.

## Runtime behavior

The registry lives in `UI_ICON_ASSETS` in `game.js`. Each rendered icon slot has a `data-ui-icon` key such as `stats.joy` or `actions.pet`.

At startup, the game tries to load and decode each rendered icon. A successful icon receives `asset-ready`, the parent icon badge receives `has-ui-icon-asset`, and the CSS/text fallback is hidden. Missing files keep the fallback visible and do not create broken image placeholders.