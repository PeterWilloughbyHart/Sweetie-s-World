# Sweetie's Beach Day

Sweetie's Beach Day is a cozy, phone-first virtual pet game about caring for Sweetie, a cheerful blond long-haired dachshund enjoying a sunny day by the ocean. Pet her, share tiny hot dog treats, play fetch, take naps, and build a lasting bond at an unhurried pace.

The game uses only HTML, CSS, and vanilla JavaScript. It has no dependencies, build step, account, or server.

> **Current milestone:** Lightweight Audio Manager. See [CHANGELOG.md](CHANGELOG.md) for the completed scope and deferred features.

## How to run

Open `index.html` in any modern browser. It runs directly as a local file, so an internet connection is not required.

## How to play

Use the large care buttons to spend time with Sweetie:

- **Pet Sweetie** raises Joy and Bond.
- **Give hot dog treat** uses one treat and raises Fullness, Joy, and Bond.
- **Give water** gives Sweetie a small Energy boost.
- **Play fetch** raises Joy and Bond but uses Energy. When Sweetie is tired, she proudly substitutes a seashell instead.
- **Nap** restores Energy and lowers Fullness a little.
- **Visit hot dog stand** prompts a short line from the duck vendor and adds three treats. The duck needs 45 seconds to arrange the next batch.
- **Outfits** and **Tricks** show Phase 1 previews.
- **Sweetie's Dream Quest** is locked until Bond reaches 75, then reveals a coming-soon preview.
- **Inspect sparkly seashell** appears at Bond 75 and reveals the hidden dedication placeholder.
- **Reset save** returns the game to its comfortable starting state.

## Stats and moods

- **Joy** reflects Sweetie's cheerful mood.
- **Fullness** reflects how ready she is for another snack.
- **Energy** powers playtime and is restored by naps and water.
- **Bond** grows through affection and play. It only increases and never decays.

The stats create five gentle moods: Happy, Snackish, Sleepy, Playful, and Calm. Fullness and Energy decrease very slowly while the page is open. Joy only drifts down when Fullness or Energy is low. Every low stat can be restored with ordinary care actions.

## Cozy design philosophy

There is no game over, illness, abandonment, guilt, or permanent penalty. Low stats are requests for care rather than failures. Sweetie is always recoverable, Bond never decreases, and optional future challenges will return the player safely to the beach with a funny alternate result or consolation reward.

Closing the game is completely safe. No offline decay is applied, so time away never reduces Sweetie's stats.

## Saving

Progress saves automatically in the browser with `localStorage`. The save includes all four stats, the hot dog treat count, the stand cooldown, whether the hidden note was discovered, and whether the welcome screen has been completed. The sound preference is stored separately under its own local key, so resetting game progress does not force a sensory preference change. Reloading `index.html` restores the save on the same browser and device and shows a gentle return message.

The **Reset save** button asks for confirmation, clears the saved state, and begins a fresh beach day.

## Current Phase 1 features

- Responsive, phone-first interface with large touch controls
- Sunny CSS beach scene with ocean, umbrella, towel, seashells, and hot dog stand
- Asset-rendered blond long-haired dachshund character with mood reactions
- Occasional no-penalty ambient strolls between the home area and waterline
- Joy, Fullness, Energy, and always-growing Bond stats
- Happy, Snackish, Sleepy, Playful, and Calm moods
- Six working care and outing actions
- Hot dog treat inventory, a gentle stand cooldown, and lightweight duck-vendor dialogue
- More than 25 randomized affectionate reactions
- Slow on-page stat decay with no offline penalty
- Local saving, save migration, and reset
- Outfits and Tricks placeholders
- Locked Dream Quest structure
- Unlockable hidden dedication placeholder
- Accessible labels, keyboard-friendly buttons, and reduced-motion support

## Phase 1.5 visual feedback

Phase 1.5 keeps the original care loop and makes every action easier to read and feel:

- Sweetie's CSS character art now has a longer, lower dachshund silhouette, shorter legs, larger gentle eyes, feathered ears and tail, and a cream chest ruff inspired by her reference photo.
- Petting, treats, water, fetch, low-energy shell inspecting, naps, and hot dog stand visits each have distinct character motion and a visible prop.
- Reusable floating hearts, sparkles, labels, and stat callouts reinforce what each action changed.
- Changed stat meters pulse, the picnic basket reacts to treat changes, and the message card responds whenever new text appears.
- Happy, Snackish, Sleepy, Playful, and Calm moods now affect Sweetie's pose and nearby visual cue.
- The phone layout keeps the pet scene prominent while preserving large touch targets and compact stats.

## Phase 1.6 cohesive art direction

Phase 1.6 gives the existing game a unified soft storybook-vector finish without changing its mechanics:

- The palette now uses warm cream paper, butter yellow, softened coral, seafoam, muted teal, and chocolate-brown linework throughout.
- Sweetie is larger and more central, with warmer facial shading, affectionate eyes and smile, softer blond ears, clearer paws, layered chest fluff, and a feathery tail.
- Background props share lighter line weights, soft cast shadows, lower saturation, and rounded hand-drawn shapes so Sweetie remains the focal point.
- Cards, meters, badges, and action buttons use consistent soft borders, corners, and shadows instead of heavy arcade-like outlines.
- On phones, the beach scene appears before the stat panel, while compact two-column stats and actions keep the screen calm and tap-friendly.
- Idle breathing, blinking, and occasional tail wags are restrained, and the Phase 1.5 action feedback uses gentler movement.

## Phase 1.7 living Sweetie and care tray

Phase 1.7 makes the existing beach companion and controls feel more alive without adding new gameplay systems:

- Sweetie now chooses from eleven gentle autonomous behaviors, including glances, sniffing, shell inspection, stretching, tiny steps, settling, and proud little bounces.
- Idle moments use randomized nine-to-sixteen-second pauses, stay within a small home area, pause when the page is hidden, and never change stats.
- Player actions immediately cancel idle behavior and use clearer full-body anticipation, contact, and recovery poses for affection, treats, water, fetch, shell inspecting, and naps.
- The action area is now a tactile care tray grouped into Daily Care, Play, and Coming Soon sections.
- Playable actions use larger custom storybook icons, individual soft color personalities, and satisfying press feedback.
- Outfits, Tricks, and Dream Quest use a quieter dashed teaser treatment so they remain charming without competing with working care actions.
- The tray remains phone-first, cozy, low-stress, and free of new penalties or timers.

## Phase 1.8 Sweetie sprite overhaul

Phase 1.8 replaces Sweetie's internal CSS-shape construction with a cleaner inline SVG character while preserving the existing game and animation systems:

- Sweetie now uses a front-facing 3/4 pose that keeps her long, low dachshund body while bringing her face toward the player.
- Both eyes are open, larger, warmly shaded, highlighted, and readable on a phone screen.
- The head, brows, muzzle, nose, cheeks, and smile form a clearer affectionate expression.
- Long feathered ears frame the face as intentional SVG paths without the old pseudo-element fringe artifacts.
- The chest is one scalloped ruff, and all four legs use distinct shaped paws, removing the confusing orb-like forms beneath the head.
- The blond body, cream chest, short legs, and soft tail retain the established storybook palette and dachshund silhouette.
- Existing moods, blinking, tail wagging, autonomous idle behaviors, and care-action animations now target the new SVG groups.
- No gameplay mechanics, penalties, or future systems were added.

## Asset-based Sweetie pipeline

Sweetie renders from image assets in `assets/sweetie/` inside the dedicated, bottom-anchored `.sweetie-character` frame. The centralized `SWEETIE_ASSETS` registry in `game.js` lists every expected mood and action sprite using browser-relative paths.

Existing moods request happy, snackish, sleepy, playful, or idle artwork. Pet, treat, drink, fetch, and nap reactions temporarily take priority, then return to the best available mood sprite. Assets are checked off-screen before display, missing files log one console warning, and fallback continues through mood, idle, and finally a neutral placeholder without showing a broken image or reviving legacy dog layers. See `assets/sweetie/README.md` for filenames and artwork requirements.

Optional three-frame action sequences now play through the same stable container only after every registered frame loads and decodes. The current frame remains visible during swaps, frame images do not fade to transparent, and mismatched canvas sizes produce a one-time console diagnostic. A two-frame idle sequence provides naturally randomized blinks; actions interrupt it immediately and restore the correct mood or idle artwork afterward.

## Ambient Sweetie strolling

After a calm 12-to-24-second idle period, Sweetie may wander from her home/care position toward a smaller waterline lane, cross most of the beach, briefly pass beyond both scene edges, re-enter, and return home. The movement is visual only: it never changes stats, saves, messages, or care outcomes.

The outer `.sweetie-roam-layer` owns responsive scene movement and distance scaling while the inner `.sweetie-character` keeps existing blink and care animations. Any player action cancels the stroll, restores Sweetie to full-size home position immediately, and then plays the requested reaction. Ambient strolling is disabled when reduced motion is preferred.

Optional walking art uses `assets/sweetie/sweetie_walk_01.png` through `sweetie_walk_04.png`. The walk cycle runs only when all four frames load; otherwise the current mood or idle sprite travels with a very subtle CSS bob. See `assets/sweetie/README.md` for shared-canvas and feet-anchor requirements.

## Hot dog stand NPC interaction

The enlarged hot dog stand is a lightweight NPC interaction point. Visiting it shows one short, randomized line from the cheerful duck vendor in a dedicated bubble anchored above the stand, then preserves the existing free three-treat restock and 45-second cooldown. Repeated visits replace the current line and restart its short timer instead of stacking bubbles. The stand bubble is separate from Sweetie's occasional thought bubble. The stand now sits farther up the sand near the waterline while remaining in the ground-anchored depth system.

`assets/props/hot_dog_stand.png` is the idle frame and may include the duck vendor baked into the artwork. Optional `assets/props/hot_dog_stand_talk.png` and `assets/props/hot_dog_stand_talk_02.png` provide full-stand talking expressions. With both present, visits play idle, talk, talk 02, talk, idle at 250ms intervals; with only the first, idle and talk alternate; with neither, the idle stand and dialogue bubble continue normally. The optional, preload-gated `assets/props/stand_owner.png` path is registered for a future separate white duck layer; it is not required and its absence cannot create a broken image. Optional `assets/treats/hot_dog.png` and `assets/treats/treat_crumbs.png` artwork continues through the existing prop fallback pipeline. This handler is an intentional future extension point for shell, cash, or points purchases, but no economy, currency, prices, shop, inventory, outfits, or accessories are implemented.

## Beach scene and prop asset pipeline

Non-Sweetie artwork now has centralized optional paths in `BEACH_SCENE_ASSETS` and `BEACH_PROP_ASSETS` in `game.js`. Drop correctly named PNGs into `assets/backgrounds/`, `assets/props/`, or `assets/treats/` and reload the page. A path activates only after its file preloads successfully, so missing or partial asset sets keep the existing CSS scene without broken images or layout shifts.

The scene remains layered rather than flattened: sky, animated ocean, sand, fixed props, Sweetie, feedback, then UI. The base ocean gradient, moving CSS waves, and shoreline foam remain active. Optional `ocean_water_texture.png`, `wave_foam_01.png`, and `wave_foam_02.png` add independently drifting overlays; reduced-motion mode freezes those overlays. They are not a full-scene background or frame animation.

The broad `beach_sky.png` layer now supports separate optional `sun.png` and `cloud_01.png` through `cloud_03.png` decorations. Successfully loaded artwork rotates or drifts gently behind the ocean; missing files retain the existing CSS sun and clouds. Reduced-motion mode leaves the decorations visible and static.

See `assets/README.md` and each asset folder's README for exact filenames, transparent-canvas guidance, fallbacks, and layer rules.

Scene props and Sweetie now share a ground-anchored 2.5D depth range. Larger base Y values are closer to the player and receive higher z-index values. Sweetie's depth interpolates while she approaches or leaves the waterline; floating feedback and scene UI remain in a separate higher layer.
## Editable game copy

All player-facing wording is organized in `content/game-copy.js`, which loads before `game.js` and works when the game is opened directly from `index.html`. Edit button labels and subtitles under `actions`, randomized reactions under `messages`, and dynamic templates in their related sections. See `content/README.md` for key and placeholder guidance.
## Lightweight audio manager

Audio is optional and defaults to off. A quiet **Sound: Off / Sound: On** control sits beside the save indicator in the header. The preference is restored on reload, but browser audio never autoplays before a valid user gesture. Enabling sound, starting the beach day, or using a game action unlocks playback.

`AUDIO_ASSETS` in `game.js` currently registers `assets/audio/ocean_waves_loop.mp3` for looping ambience at 0.25 volume and `assets/audio/duck_quack_01.mp3` for the hot dog stand. Waves stop when sound is disabled, pause while the page is hidden, and resume when appropriate. Stand visits request one quack through a cached element with a 450ms cooldown so rapid visits do not stack effects.

Both MP3s are optional. Missing files and rejected playback promises are handled with one console warning per asset and no visible error. The audio manager also exposes small `setSoundEnabled`, `getSoundEnabled`, `toggleSound`, `playSound`, `startAmbient`, and `stopAmbient` helpers for future effects. No music or additional sound design is implemented. See `assets/audio/README.md` for file and volume guidance.

## Suggested future phases

- Additional Sweetie animations
- Additional Sweetie expression and pose variants
- Outfits
- Dog tricks
- Beach collectibles
- Word games
- Duck easter eggs
- Weightlifting-themed accessories or mini-events
- Musical-theater-inspired witty achievement names, without using copyrighted lyrics
- Sweetie's Dream Quest fantasy minigame
- Hidden personalized dedication
- Additional sound effects and optional music