# Sweetie character assets

This folder is the single home for Sweetie sprite artwork. Browser code references these files through relative paths in the centralized `SWEETIE_ASSETS` and `SWEETIE_ANIMATIONS` registries in `game.js`.

## Single-pose files

- `sweetie_idle.png`
- `sweetie_happy.png`
- `sweetie_snackish.png`
- `sweetie_sleepy.png`
- `sweetie_playful.png`
- `sweetie_pet.png`
- `sweetie_treat.png`
- `sweetie_drink.png`
- `sweetie_fetch.png`
- `sweetie_nap.png`

Only `sweetie_idle.png` is required. Existing single-pose files remain the fallback for missing animation sequences.

## Optional idle blink

- `sweetie_idle_01.png`: normal open-eyed idle frame
- `sweetie_idle_02.png`: brief closed-eye blink frame

When both files exist, Sweetie uses frame 01 as her resting image and occasionally shows frame 02 for about 140ms. Blinks are randomized between roughly three and eight seconds and stop during player actions. If either frame is missing, the game uses `sweetie_idle.png`.

## Optional action sequences

Each action can use a short numbered sequence:

- `sweetie_pet_01.png` through `sweetie_pet_03.png`
- `sweetie_treat_01.png` through `sweetie_treat_03.png`
- `sweetie_drink_01.png` through `sweetie_drink_03.png`
- `sweetie_fetch_01.png` through `sweetie_fetch_03.png`
- `sweetie_nap_01.png` through `sweetie_nap_03.png`

Action sequences should generally contain two to four frames. Update that action's `frames` array in `SWEETIE_ANIMATIONS` when using a different frame count. A sequence plays only when every registered frame loads and decodes. The current valid frame stays visible until the next decoded frame is selected, and frame-swapped artwork has no opacity transition. An incomplete or undecodable sequence falls back to its single-pose action image, then the current mood image, then idle, and finally the neutral placeholder. The browser emits one diagnostic warning when a completed sequence uses mismatched canvas dimensions.

The animation player supports the same frame-array structure and optional looping, so future two-frame mood micro-animations such as happy, sleepy, or playful can be added to `SWEETIE_ANIMATIONS` later without changing the image container.

## Optional ambient walk cycle

- `sweetie_walk_01.png`
- `sweetie_walk_02.png`
- `sweetie_walk_03.png`
- `sweetie_walk_04.png`

When all four files load, the ambient stroll controller loops them at 180ms per frame while Sweetie moves. If any frame is missing, the game keeps the current mood or idle image and adds only a subtle CSS bob; no broken frame is displayed.

Walking artwork must use the same transparent canvas dimensions, visual scale, and ground/feet anchor as every other Sweetie asset. Keep enough transparent space around the body for horizontal mirroring: the stroll layer flips the image when Sweetie changes direction.

The stroll itself is configured in `SWEETIE_STROLL_CONFIG` in `game.js`. It starts only after a calm idle window, pauses idle blinking, never changes stats, returns to the home anchor, and is disabled under `prefers-reduced-motion`. Player actions always cancel it before their action pose or feedback begins.

## Asset requirements

- Use transparent PNGs with real alpha channels.
- Keep the same canvas dimensions across every pose and frame.
- Keep Sweetie at the same visual scale across frames.
- Use one consistent ground and feet anchor point.
- Keep the full body visible inside the canvas.
- Use lowercase snake_case names and two-digit frame numbers such as `_01`.

Do not add empty or fake PNG files. Missing files are expected and produce a one-time console warning without interrupting gameplay.