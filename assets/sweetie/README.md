# Sweetie character assets

This folder is the single home for Sweetie sprite artwork. Browser code references these files through relative paths in the centralized `SWEETIE_ASSETS` and `SWEETIE_ANIMATIONS` registries in `game.js`.

## Single-pose files

- `sweetie_idle.png`
- `sweetie_happy.png`
- `sweetie_happy_01.png`
- `sweetie_happy_02.png`
- `sweetie_snackish.png`
- `sweetie_sleepy.png`
- `sweetie_playful.png`
- `sweetie_pet.png`
- `sweetie_treat.png`
- `sweetie_drink.png`
- `sweetie_fetch.png`
- `sweetie_nap.png`

Only `sweetie_idle.png` is required. Existing single-pose files remain the fallback for missing animation sequences. `sweetie_happy.png` remains the happy mood fallback even when optional numbered happy frames are added.

## Optional happy mood tail wag

- `sweetie_happy_01.png`: happy pose, tail-wag frame 01
- `sweetie_happy_02.png`: happy pose, tail-wag frame 02

When both files load and decode, Sweetie loops them at 450ms per frame while she is in the happy mood and no higher-priority animation is active. Player actions, return-home run, ambient walk/stroll, temporary idle behaviors, and other action sequences all stop or block the happy loop. If either frame is missing or undecodable, the game uses `sweetie_happy.png`, then the normal mood, idle, and placeholder fallback chain.

Reduced-motion mode does not run the loop; it keeps Sweetie on a static happy pose. The two numbered frames should use the same canvas size, Sweetie scale, body position, paws/feet anchor, face/head placement, and transparent padding. Only the tail should meaningfully change position, so the result reads as a tail wag rather than whole-character jitter.

Do not add empty or fake PNG files to complete the group.

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

The animation player supports the same frame-array structure and optional looping, so future two-frame mood micro-animations such as sleepy or playful can be added to `SWEETIE_ANIMATIONS` later without changing the image container.

## Optional ambient walk cycle

- `sweetie_walk_01.png`
- `sweetie_walk_02.png`
- `sweetie_walk_03.png`
- `sweetie_walk_04.png`

When all four files load, the ambient stroll controller loops them at 180ms per frame while Sweetie moves. If any frame is missing, the game keeps the current mood or idle image and adds only a subtle CSS bob; no broken frame is displayed.

Walking artwork must use the same transparent canvas dimensions, visual scale, and ground/feet anchor as every other Sweetie asset. Keep enough transparent space around the body for horizontal mirroring: the stroll layer flips the image when Sweetie changes direction.

The stroll itself is configured in `SWEETIE_STROLL_CONFIG` in `game.js`. It starts only after a calm idle window, pauses idle blinking, never changes stats, returns to the home anchor, and is disabled under `prefers-reduced-motion`.

## Optional return-home front run cycle

- `sweetie_run_01.png`
- `sweetie_run_02.png`
- `sweetie_run_03.png`
- `sweetie_run_04.png`

These optional frames are for Sweetie scampering back toward the player after an ambient stroll. When all four files load and decode, the return-home controller loops them at 150ms per frame while the roam layer moves and scales Sweetie back to the home/care position. If any frame is missing, the game keeps the current valid mood or idle image and still performs the smooth return without showing a broken frame.

Direct care actions clicked while Sweetie is strolling are held as one pending action. Care buttons are temporarily marked unavailable, Sweetie returns home first, then the queued action animation plays from the normal full-size home position. Additional care clicks during the return keep the first queued action rather than stacking a queue.

Return-home run artwork should be front-facing or front-leaning, use the same transparent canvas dimensions as other Sweetie frames, and keep the feet/ground anchor stable as the sprite scales up toward home. Do not add empty or fake PNG files to complete the group.

## Asset requirements

- Use transparent PNGs with real alpha channels.
- Keep the same canvas dimensions across every pose and frame.
- Keep Sweetie at the same visual scale across frames.
- Use one consistent ground and feet anchor point.
- Keep the full body visible inside the canvas.
- Use lowercase snake_case names and two-digit frame numbers such as `_01`.

Do not add empty or fake PNG files. Missing files are expected and produce a one-time console warning without interrupting gameplay.