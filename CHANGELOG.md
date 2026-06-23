# Changelog

## PNG Animation Playback Stability

**Date:** June 22, 2026  
**Status:** Current completed milestone

- Upgraded shared PNG preloading to wait for browser decode before a frame can be used
- Kept the previous Sweetie or stand frame visible while the next decoded frame is selected
- Removed opacity transitions and fade-to-transparent behavior from frame-swapped images
- Kept stand talking restarts on one cancelable timer without briefly forcing idle while frames are prepared
- Added one-time console warnings when a frame group uses mismatched canvas dimensions
- Preserved the 250ms stand sequence, Sweetie action timings, gameplay, stats, saving, dialogue, audio, and animated ocean
- Documented decoded preloading, safe missing-frame fallback, matching canvases, and stable feet/ground anchors

## Lightweight Audio Manager

**Date:** June 22, 2026  
**Status:** Superseded by PNG Animation Playback Stability

- Added centralized optional `AUDIO_ASSETS` paths for looping ocean waves and a duck quack
- Added a cached audio manager with sound enable/disable, one-shot playback, ambient start/stop, toggle, autoplay-safe unlock, and warn-once failure handling
- Added a quiet header sound toggle with editable labels and a separately persisted preference that defaults off
- Looped waves at 0.25 volume only after a valid user gesture, paused them on hidden tabs, and resumed them when appropriate
- Triggered a 0.60-volume duck quack on hot dog stand visits with a 450ms anti-overlap cooldown
- Preserved all stand dialogue, restocking, Sweetie care actions, stats, saves, animations, and animated ocean visuals
- Added `assets/audio/README.md` and documented optional formats, volume guidance, missing-file behavior, and future extension paths

## Hot Dog Stand Talking Variants

**Date:** June 22, 2026  
**Status:** Superseded by Lightweight Audio Manager

- Moved the enlarged hot dog stand from 46% to 37% scene top on larger screens and from 47% to 39% on phones, closer to the waterline
- Kept stand depth derived from its measured ground contact so Sweetie and props continue to layer naturally
- Registered optional `hot_dog_stand_talk.png` and `hot_dog_stand_talk_02.png` full-stand talking frames
- Added a restartable 250ms frame controller supporting idle/talk/talk-02 and idle/talk fallback sequences
- Restored `hot_dog_stand.png` after every sequence, repeated click, page hide, or reduced-motion interruption
- Kept missing talking variants silent and never assigned an unverified source to the visible stand image
- Preserved the vendor bubble, free three-treat restock, Joy bonus, cooldown, saves, Sweetie actions, and animated ocean
- Updated the asset manifest from 50 to 52 expected PNG paths

## Hot Dog Stand NPC Interaction

**Date:** June 22, 2026  
**Status:** Superseded by Hot Dog Stand Talking Variants

- Enlarged the loaded hot dog stand from a 160-190px box to a responsive 205-245px box while keeping Sweetie visually primary
- Added a separate, timed vendor speech bubble anchored above the stand with randomized visit and cooldown dialogue from `content/game-copy.js`
- Preserved the existing free three-treat restock, Joy bonus, 45-second cooldown, messages, feedback, and saving
- Registered optional `assets/props/stand_owner.png` as a separately preload-gated white duck overlay without requiring the file or hiding the stand fallback
- Kept the stand in the ground-anchored scene depth system and kept vendor dialogue separate from Sweetie's thought bubble
- Added one stand NPC handler as a future economy extension point without adding currency, prices, purchasing, inventory, outfits, accessories, or a shop
- Preserved Sweetie's care mechanics and animations, ambient strolling, reduced motion, scene layering, and animated ocean
- Updated the root README, editable copy guide, prop guide, and project-wide asset manifest from 49 to 50 expected PNG paths

## Ground-Anchored Scene Depth

**Date:** June 22, 2026  
**Status:** Superseded by Hot Dog Stand NPC Interaction

- Added a centralized 100-500 scene-object depth range based on normalized ground/base Y
- Depth-sorted the umbrella, towel, three shells, hot dog stand, and Sweetie independently of DOM order
- Interpolated Sweetie's z-index while she travels between her 99% home anchor and 62.5% waterline lane
- Added an umbrella ground-contact offset and a negative offset for shell two so the shell stays behind the pole
- Recomputed fixed prop depth after responsive resizing and optional PNG activation
- Reserved 700-850 for mood props, thought bubbles, action feedback, and the scene caption
- Applied identical depth behavior to PNG props and CSS fallbacks through their shared containers
- Preserved the animated ocean, reduced motion, Sweetie animations, care actions, stats, saving, and UI


## Animated Sky Decoration Asset Support

**Date:** June 22, 2026  
**Status:** Superseded by Ground-Anchored Scene Depth

- Registered optional `sun.png` and `cloud_01.png` through `cloud_03.png` background paths
- Added separate preload-gated sky overlays while retaining `beach_sky.png` as the broad static layer
- Added an 80-second sun rotation and three subtle cloud drift profiles from 64 to 118 seconds
- Kept the existing CSS sun and clouds as missing-file fallbacks without broken image paths
- Ensured all decorative sky overlays ignore pointer input and remain behind the ocean and gameplay layers
- Disabled sky-decoration motion under `prefers-reduced-motion` while keeping loaded artwork visible
- Preserved the animated ocean, Sweetie animations, care actions, stats, saving, and UI
- Updated the asset manifest from 45 to 49 expected PNG paths

## Beach Scene and Prop Asset Paths

**Date:** June 22, 2026  
**Status:** Superseded by Animated Sky Decoration Asset Support

- Added centralized `BEACH_SCENE_ASSETS` and `BEACH_PROP_ASSETS` registries
- Added safe preload-before-display activation with one-time missing-file warnings and CSS fallbacks
- Prepared optional sky, sand, distant shore, ocean texture, and two wave foam paths
- Prepared optional umbrella, towel, three shell, hot dog stand, hot dog, and treat crumb paths
- Preserved the existing animated CSS ocean and layered optional texture/foam motion over it
- Added stable decorative image hooks with empty alternative text and no loading-time layout shifts
- Explicitly paused optional ocean overlay motion under `prefers-reduced-motion`
- Added `assets/backgrounds/`, `assets/props/`, and `assets/treats/` guides
- Kept Sweetie animations, care outcomes, stats, saving, messages, and UI unchanged


## Ambient Sweetie Strolling

**Date:** June 22, 2026  
**Status:** Superseded by Beach Scene and Prop Asset Paths

- Added a small six-state ambient stroll controller with centralized timing and scene-position configuration
- Sweetie now occasionally leaves her home anchor, scales down toward the waterline, walks two or three safe shoreline passes, and returns home
- Added left/right facing, responsive transform-based positioning, and a stable outer roam layer that does not disturb care animations
- Registered optional `sweetie_walk_01.png` through `sweetie_walk_04.png` frames at 180ms per frame
- Added a mood/idle sprite fallback with a subtle bob when the complete walk sequence is unavailable
- Player actions, page hiding, and reduced-motion changes cancel strolling and restore the full-size home position before feedback begins
- Idle blinking pauses during walking and resumes after Sweetie returns home
- Preserved care results, stats, saves, messages, inventory, cooldowns, and the no-punishment design

## Editable Game Copy

**Date:** June 21, 2026  
**Status:** Superseded by Ambient Sweetie Strolling

- Added `content/game-copy.js` as the editable source for static and runtime player-facing text
- Added safe dot-path lookup, message-list fallback, and simple `{placeholder}` formatting
- Externalized headings, stats, actions, moods, messages, feedback, cooldowns, dialogs, locks, hidden-note copy, and practical accessibility labels
- Added 66 markup bindings while retaining current HTML strings as local-file-safe fallbacks
- Added `content/README.md` with editing and placeholder guidance
- Preserved mechanics, saves, Sweetie assets, and animation behavior
## Sweetie Animation Sequences

**Date:** June 21, 2026  
**Status:** Superseded by Editable Game Copy

- Added centralized optional frame sequences for pet, treat, drink, fetch, and nap
- Added a randomized two-frame idle blink using `sweetie_idle_01.png` and `sweetie_idle_02.png`
- Complete sequences play once and hold through the existing reaction timing
- Incomplete sequences fall back to single-pose action, mood, idle, then the neutral placeholder
- Player actions interrupt blinking and prior sequences without changing game mechanics
- Documented two-to-four-frame naming, shared canvas, and feet-anchor requirements
## Sweetie-only Asset Pipeline

**Date:** June 20, 2026  
**Status:** Superseded by Sweetie Animation Sequences

This focused integration replaces the constructed in-scene Sweetie artwork with the supplied idle image while preserving the existing care loop, feedback, and beach composition.

### Complete in this milestone

- Rendered Sweetie from `assets/sweetie/sweetie_idle.png`
- Isolated the asset in a dedicated .sweetie-character wrapper so legacy CSS/SVG/HTML dog layers cannot render
- Removed the old oval text fallback, leaving exactly one Sweetie image in the scene
- Added a stable, responsive character frame so future poses share one anchor point
- Preserved existing mood, idle, care-action, and floating-effect hooks on the character wrapper
- Realigned nearby labels, props, hearts, sparkles, and mood effects around the new artwork
- Centralized all ten expected mood and action paths in `SWEETIE_ASSETS`
- Added off-screen asset checks, one-time missing-file warnings, and action > mood > idle > placeholder priority
- Mapped the existing pet, treat, water, fetch, and nap reactions to temporary sprite states
- Mapped Happy, Snackish, Sleepy, Playful, and Calm moods to their registered sprite states
- Added safe idle resolution for unavailable poses and a no-label image error state
- Kept stats, saving, messages, inventory, cooldown, and all game mechanics unchanged

### Verification status

- JavaScript syntax and structure checks pass.
- The supplied idle image is present and connected to the scene through the registry.
- Existing care behavior remains covered by the local functional harness.

## Phase 1.8 — Sweetie Sprite Overhaul and Cleanup

**Date:** June 20, 2026  
**Status:** Superseded by Sweetie-only Asset Pipeline

This focused character-art pass rebuilds Sweetie as a clean inline SVG sprite with a more emotionally present 3/4 pose. Existing care mechanics, idle behavior, action feedback, and the care tray remain unchanged.

### Complete in this milestone

- Replaced the layered CSS-span sprite with a maintainable inline SVG character
- Shifted Sweetie from a side-facing pose to a front-facing 3/4 composition
- Enlarged and opened both eyes with warm irises, dark pupils, highlights, and soft eye rims
- Refined the forehead, brows, muzzle, nose, cheeks, and smile for a warmer default expression
- Rebuilt both ears as explicit long feathered SVG paths that frame the face cleanly
- Removed the old ear pseudo-element fringe and other trailing artifact shapes
- Replaced the two ambiguous chest or paw orbs with one scalloped chest ruff and four clearly shaped legs and paws
- Improved the neck, chest, body, and front-leg transitions while preserving the long low dachshund silhouette
- Preserved blond and cream coloring, soft shading, chocolate-brown linework, short legs, and a feathery tail
- Adapted blinking, mood expressions, tail wagging, idle behavior, and all player-action animations to SVG transform origins
- Increased mobile face readability without changing the beach scene or care systems

### Intentionally unchanged

- Stats, saving, moods, inventory, cooldown, messages, and care actions
- Phase 1.7 idle scheduler and care tray
- Dream Quest, Outfits, and Tricks placeholders
- Cozy no-punishment philosophy

### Verification status

- The inline SVG parses as valid XML and renders successfully in isolation.
- Structural checks verify two open eye groups, four leg groups, one chest ruff, unique IDs, and no legacy ear or chest span layers.
- Existing functional checks continue to cover care mechanics, idle priority, and action feedback.

## Phase 1.7 — Living Sweetie + Care Tray UI

**Date:** June 20, 2026  
**Status:** Superseded by Phase 1.8

This focused polish pass makes Sweetie feel like a calm living beach companion and turns the action panel into a tactile, clearly grouped care tray. No new gameplay systems, penalties, or stressful mechanics were added.

### Complete in this milestone

- Eleven lightweight autonomous idle behaviors with randomized nine-to-sixteen-second cooldowns
- A bounded home-area movement system for glances, sniffing, weight shifts, tiny steps, shell inspection, stretching, perking up, settling, and proud bounces
- Visibility, welcome-screen, dialog, and player-activity guards that keep idle motion calm and appropriate
- Immediate cancellation of idle behavior whenever the player selects an action
- Stronger full-body acting for petting, treats, water, fetch, the low-Energy shell outcome, and naps
- Clearer eager, drinking, scampering, proud-return, circling, and resting poses
- Existing hot dog stand delivery, inventory pulse, and stand reaction preserved and polished
- Action controls regrouped into Daily Care, Play, and Coming Soon sections
- Tactile playable buttons with custom storybook icons, distinct soft palettes, press depth, icon bounce, and subtle color bloom
- Muted dashed styling for Outfits, Tricks, and Dream Quest so placeholders remain secondary
- Responsive two-column phone tray with large touch targets and readable labels
- Existing stats, saving, moods, cooldown, messages, and cozy no-punishment philosophy preserved

### Intentionally deferred

- Playable Dream Quest
- Functional outfits or closet system
- Learnable dog tricks
- New minigames, currencies, shops, collectibles, sounds, or penalties

### Verification status

- JavaScript syntax checks pass.
- A 53-check functional harness verifies all eleven idle classes, action priority, care-tray structure, existing care mechanics, and the low-Energy shell outcome.
- HTML IDs remain unique, CSS braces are balanced, and no external runtime dependencies were added.

## Phase 1.6 — Art Direction and Character Polish

**Date:** June 20, 2026  
**Status:** Superseded by Phase 1.7

Sweetie's Beach Day is now a complete cozy-care foundation with a cohesive storybook presentation. This milestone preserves the Phase 1 mechanics, adds readable Phase 1.5 action feedback, and completes the Phase 1.6 character and art-direction polish pass.

### Complete in this milestone

- Phone-first local browser game built with HTML, CSS, and vanilla JavaScript only
- Joy, Fullness, Energy, and always-growing Bond stats
- Happy, Snackish, Sleepy, Playful, and Calm mood states
- Pet, hot dog treat, water, fetch, nap, and hot dog stand actions
- Gentle low-Energy shell-inspector outcome for fetch
- Hot dog treat inventory and a friendly stand cooldown
- Automatic `localStorage` saving with no offline stat penalty
- Save reset and migration from the earlier save key
- More than 25 affectionate and lightly witty reaction messages
- Locked Dream Quest and hidden dedication placeholder structure
- Outfits and Tricks placeholders, with no unfinished gameplay exposed
- Action-specific props, character motion, labels, floating effects, stat pulses, inventory feedback, and message-card feedback
- Distinct visual treatment for each of Sweetie's five moods
- Refined blond long-haired dachshund silhouette with short legs, feathered ears and tail, chest fluff, warm expression, and soft shading
- Unified cream-paper, butter-yellow, coral, seafoam, muted-teal, and chocolate-brown storybook palette
- Cohesive beach props, softened linework, paper texture, gentle depth, and restrained cast shadows
- Mobile composition that places Sweetie's beach scene before the stat panel
- Subtle breathing, blinking, occasional tail wags, and reduced-motion support
- Keyboard-friendly controls, accessible labels, and large touch targets

### Intentionally deferred

These are future phases, not incomplete parts of Phase 1.6:

- Playable Dream Quest
- Functional outfits or closet system
- Learnable dog tricks
- Beach collectibles and word games
- Duck easter eggs and themed mini-events
- Personalized final dedication text
- Sound effects or music

### Verification status

- JavaScript syntax checks pass.
- Functional harness checks cover the six working care actions, stats, moods, inventory, cooldown, saving, reset, and Phase 1.5 feedback.
- HTML IDs are unique, CSS structure is balanced, and the game has no external runtime dependencies.
- Automated in-app browser capture was unavailable during the Phase 1.6 pass, so final device-level visual review remains recommended.

### Milestone files

- `index.html`
- `style.css`
- `game.js`
- `README.md`
- `CHANGELOG.md`