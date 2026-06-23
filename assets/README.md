# Sweetie's Beach Day asset manifest

This is the authoritative, project-wide checklist for every PNG path currently registered in `game.js`. The game expects **58 distinct PNG filenames**:

- 37 Sweetie character files
- 10 layered background and sky-decoration files
- 9 fixed beach prop files
- 2 treat prop files

Only `assets/sweetie/sweetie_idle.png` is strictly required. Every other PNG is optional and has a safe fallback. Adding only part of the optional collection will not break the game.

Audio files are tracked separately in `AUDIO_ASSETS`. The two current MP3 paths are optional and are not included in the 58-PNG total below.

## Status legend

- **Present**: the PNG currently exists in this repository.
- **Pending**: the game knows the exact path, but the PNG is not currently present.
- **Required**: the baseline character fallback that should always remain available.
- **Complete group**: every frame in that animation group must load before the sequence is used.

The status column is a repository snapshot as of June 23, 2026: 38 PNGs are present and 20 are pending. The filename and path columns are the lasting source of truth.

## Expected folder tree

```text
assets/
|-- README.md
|-- audio/
|   |-- README.md
|   |-- ocean_waves_loop.mp3
|   `-- duck_quack_01.mp3
|-- backgrounds/
|   |-- beach_sky.png
|   |-- sun.png
|   |-- cloud_01.png
|   |-- cloud_02.png
|   |-- cloud_03.png
|   |-- beach_sand.png
|   |-- distant_shore.png
|   |-- ocean_water_texture.png
|   |-- wave_foam_01.png
|   `-- wave_foam_02.png
|-- props/
|   |-- beach_umbrella.png
|   |-- beach_towel.png
|   |-- shell_01.png
|   |-- shell_02.png
|   |-- shell_03.png
|   |-- hot_dog_stand.png
|   |-- hot_dog_stand_talk.png
|   |-- hot_dog_stand_talk_02.png
|   `-- stand_owner.png
|-- treats/
|   |-- hot_dog.png
|   `-- treat_crumbs.png
`-- sweetie/
    |-- sweetie_idle.png
    |-- sweetie_happy.png
    |-- sweetie_happy_01.png
    |-- sweetie_happy_02.png
    |-- sweetie_snackish.png
    |-- sweetie_sleepy.png
    |-- sweetie_playful.png
    |-- sweetie_pet.png
    |-- sweetie_treat.png
    |-- sweetie_drink.png
    |-- sweetie_fetch.png
    |-- sweetie_nap.png
    |-- sweetie_idle_01.png
    |-- sweetie_idle_02.png
    |-- sweetie_pet_01.png
    |-- sweetie_pet_02.png
    |-- sweetie_pet_03.png
    |-- sweetie_treat_01.png
    |-- sweetie_treat_02.png
    |-- sweetie_treat_03.png
    |-- sweetie_drink_01.png
    |-- sweetie_drink_02.png
    |-- sweetie_drink_03.png
    |-- sweetie_fetch_01.png
    |-- sweetie_fetch_02.png
    |-- sweetie_fetch_03.png
    |-- sweetie_nap_01.png
    |-- sweetie_nap_02.png
    |-- sweetie_nap_03.png
    |-- sweetie_walk_01.png
    |-- sweetie_walk_02.png
    |-- sweetie_walk_03.png
    |-- sweetie_walk_04.png
    |-- sweetie_run_01.png
    |-- sweetie_run_02.png
    |-- sweetie_run_03.png
    `-- sweetie_run_04.png
```

## Ground-anchored scene depth

Fixed props and Sweetie are depth-sorted from their ground contact point rather than their DOM order. A larger normalized base Y means the object is closer to the player and receives a higher z-index within the 100-500 scene-object range. Sweetie's feet-anchor depth changes continuously during ambient stroll transitions.

The umbrella uses its pole-to-sand contact as its anchor. `shell_02.png` has a small negative depth offset so it remains behind that pole. PNG replacements and CSS fallbacks share the same parent element, so both follow the same depth value. Mood props, thought bubbles, floating feedback, and the scene caption intentionally use the separate 700-850 overlay range.
## Sweetie baseline and single-pose files

These paths are registered in `SWEETIE_ASSETS`. Single action poses are fallbacks when a numbered animation sequence is incomplete.

| Exact path | Status | Runtime role |
| --- | --- | --- |
| `assets/sweetie/sweetie_idle.png` | **Present, required** | Final character fallback and neutral/calm pose |
| `assets/sweetie/sweetie_happy.png` | Present | Happy mood pose |
| `assets/sweetie/sweetie_snackish.png` | Present | Snackish mood pose |
| `assets/sweetie/sweetie_sleepy.png` | Pending | Sleepy mood pose |
| `assets/sweetie/sweetie_playful.png` | Present | Playful mood pose |
| `assets/sweetie/sweetie_pet.png` | Pending | Pet action fallback |
| `assets/sweetie/sweetie_treat.png` | Pending | Treat action fallback |
| `assets/sweetie/sweetie_drink.png` | Pending | Water/drink action fallback |
| `assets/sweetie/sweetie_fetch.png` | Pending | Fetch and fetch-shell action fallback |
| `assets/sweetie/sweetie_nap.png` | Pending | Nap action fallback |

### Single-pose fallback order

1. Requested action pose, when relevant
2. Current mood pose
3. `sweetie_idle.png`
4. Neutral heart placeholder

No broken image icon is displayed at any stage.

## Sweetie animation sequences

Numbered sequences are registered in `SWEETIE_ANIMATIONS`. A sequence is activated only when **every registered frame in that group** loads and decodes successfully. The live sprite is not faded or cleared between decoded frames. A one-time console warning identifies frame groups with mismatched canvas dimensions, though the stable wrapper still prevents document layout shifts. Do not add blank or fake PNGs to complete a group.

### Happy mood tail-wag animation, incomplete optional group

| Exact path | Status | Frame role |
| --- | --- | --- |
| `assets/sweetie/sweetie_happy_01.png` | **Pending** | Happy pose, wag frame 01 |
| `assets/sweetie/sweetie_happy_02.png` | **Pending** | Happy pose, wag frame 02 |

Timing: 450ms per frame in a gentle loop while Sweetie is in the happy mood and no higher-priority animation is active. Both frames must load and decode before the loop is used. If either frame is missing, Sweetie uses `sweetie_happy.png`, then the normal mood-to-idle fallback chain. Under reduced motion, the loop is disabled and Sweetie remains on a static happy pose.

### Idle blink, complete group

| Exact path | Status | Frame role |
| --- | --- | --- |
| `assets/sweetie/sweetie_idle_01.png` | Present | Normal open-eyed idle |
| `assets/sweetie/sweetie_idle_02.png` | Present | Brief closed-eye blink |

Timing: frame 02 appears for about 140ms at randomized three-to-eight-second intervals. If either file is missing, the game uses `sweetie_idle.png` without blinking.

### Pet animation, complete group

| Exact path | Status |
| --- | --- |
| `assets/sweetie/sweetie_pet_01.png` | Present |
| `assets/sweetie/sweetie_pet_02.png` | Present |
| `assets/sweetie/sweetie_pet_03.png` | Present |

Timing: 240ms per frame. The numbered sequence falls back to `sweetie_pet.png`, then the current mood, then idle.

### Treat animation, complete group

| Exact path | Status |
| --- | --- |
| `assets/sweetie/sweetie_treat_01.png` | Present |
| `assets/sweetie/sweetie_treat_02.png` | Present |
| `assets/sweetie/sweetie_treat_03.png` | Present |

Timing: 160ms per frame. The numbered sequence falls back to `sweetie_treat.png`, then the current mood, then idle.

### Drink animation, complete group

| Exact path | Status |
| --- | --- |
| `assets/sweetie/sweetie_drink_01.png` | Present |
| `assets/sweetie/sweetie_drink_02.png` | Present |
| `assets/sweetie/sweetie_drink_03.png` | Present |

Timing: 160ms per frame. The numbered sequence falls back to `sweetie_drink.png`, then the current mood, then idle.

### Fetch animation, incomplete group

| Exact path | Status |
| --- | --- |
| `assets/sweetie/sweetie_fetch_01.png` | **Pending** |
| `assets/sweetie/sweetie_fetch_02.png` | **Pending** |
| `assets/sweetie/sweetie_fetch_03.png` | **Pending** |

Timing: 140ms per frame once complete. Until then, fetch falls back to `sweetie_fetch.png`; because that single pose is also pending, it currently continues to the current mood or idle pose.

### Nap animation, complete group

| Exact path | Status |
| --- | --- |
| `assets/sweetie/sweetie_nap_01.png` | Present |
| `assets/sweetie/sweetie_nap_02.png` | Present |
| `assets/sweetie/sweetie_nap_03.png` | Present |

Timing: 220ms per frame. The numbered sequence falls back to `sweetie_nap.png`, then the current mood, then idle.

### Ambient walk animation, complete group

| Exact path | Status |
| --- | --- |
| `assets/sweetie/sweetie_walk_01.png` | Present |
| `assets/sweetie/sweetie_walk_02.png` | Present |
| `assets/sweetie/sweetie_walk_03.png` | Present |
| `assets/sweetie/sweetie_walk_04.png` | Present |

Timing: 180ms per frame in a loop while Sweetie moves. If the group becomes incomplete, the stroll uses the current mood or idle image with a subtle CSS bob.

### Return-home front run animation, incomplete optional group

| Exact path | Status |
| --- | --- |
| `assets/sweetie/sweetie_run_01.png` | Present |
| `assets/sweetie/sweetie_run_02.png` | Present |
| `assets/sweetie/sweetie_run_03.png` | Present |
| `assets/sweetie/sweetie_run_04.png` | **Pending** |

Timing: 150ms per frame in a loop while Sweetie returns from a stroll to the home/care position. The run group is optional and only plays when all four frames load and decode. Until then, Sweetie still returns smoothly using the current valid mood or idle sprite. Do not add blank placeholder PNGs.

## Background layer PNGs

These paths are registered in `BEACH_SCENE_ASSETS`. All are optional. They activate independently after preloading and sit over the existing CSS layer rather than replacing the whole beach scene.

| Exact path | Status | Intended behavior |
| --- | --- | --- |
| `assets/backgrounds/beach_sky.png` | Pending | Broad static sky art behind all sun and cloud decorations |
| `assets/backgrounds/sun.png` | Present | Larger upper-right transparent sun overlay; rotates once every 110 seconds |
| `assets/backgrounds/cloud_01.png` | Present | Transparent cloud; gentle 72-second left-to-right drift |
| `assets/backgrounds/cloud_02.png` | Present | Transparent cloud; slower 96-second right-to-left drift |
| `assets/backgrounds/cloud_03.png` | Present | Transparent cloud; tiny 124-second side-to-side float |
| `assets/backgrounds/beach_sand.png` | Pending | Static sand artwork over the CSS sand base |
| `assets/backgrounds/distant_shore.png` | Pending | Transparent distant shoreline band inside the ocean |
| `assets/backgrounds/ocean_water_texture.png` | Pending | Horizontally repeating water texture with slow drift |
| `assets/backgrounds/wave_foam_01.png` | Pending | Transparent foreground foam band with slow horizontal drift |
| `assets/backgrounds/wave_foam_02.png` | Pending | Secondary foam band at a different depth, direction, and speed |

### Animated sky decoration rule

`beach_sky.png` remains the broad static sky layer. `sun.png` and the three cloud PNGs are separate overlays and activate independently. The loaded sun is intentionally larger than the CSS fallback and rotates very slowly; the cloud overlays drift on independent slow cycles so the sky feels alive without stealing attention. A missing sun, cloud 01, or cloud 02 keeps its existing CSS fallback visible; missing cloud 03 simply omits that extra decoration. Every sky decoration uses `pointer-events: none`.

Under `prefers-reduced-motion`, loaded sky decorations remain visible and static while their rotation and drift are disabled.
### Ocean rule

The CSS ocean gradient and moving CSS waves always remain the base water. The texture and foam PNGs are optional overlays, not a static ocean replacement and not a frame-by-frame full-scene animation. Reduced-motion mode freezes their drift.

## Fixed beach prop PNGs

These paths are registered in `BEACH_PROP_ASSETS`. Loaded PNGs use responsive, asset-specific boxes that compensate for their square transparent canvases without shifting the surrounding document layout.

| Exact path | Status | Loaded PNG display box |
| --- | --- | --- |
| `assets/props/beach_umbrella.png` | Present | 190-220px square; visual art is roughly 149-172px wide |
| `assets/props/beach_towel.png` | Present | 190-245px wide with an 86-108px flat scene footprint |
| `assets/props/shell_01.png` | Present | 34-46px square |
| `assets/props/shell_02.png` | Present | 34-46px square |
| `assets/props/shell_03.png` | Present | 34-46px square |
| `assets/props/hot_dog_stand.png` | Present | Default/idle stand frame in a 205-245px square box |
| `assets/props/hot_dog_stand_talk.png` | Present, optional | First full-stand talking frame |
| `assets/props/hot_dog_stand_talk_02.png` | Present, optional | Second full-stand talking frame |
| `assets/props/stand_owner.png` | **Pending, optional** | Future white duck vendor overlay; not required when the duck is baked into the stand art |

When one of these images loads, the matching CSS-constructed prop is hidden. If it is absent, the CSS prop remains fully visible.

### Hot dog stand NPC art

`hot_dog_stand.png` is the default idle frame and may include the white duck vendor baked directly into the artwork. Optional `hot_dog_stand_talk.png` and `hot_dog_stand_talk_02.png` are preload-and-decode-gated full-stand talking expressions. With both, visits use idle -> talk -> talk 02 -> talk -> idle; with only the first, visits alternate idle and talk; with neither, dialogue still works on the idle image. The optional `stand_owner.png` path remains a separate future overlay for a duck-free stand composition. Missing variants are never assigned, so no broken image appears. The vendor speech bubble is HTML/CSS UI anchored to the stand, not part of any PNG.

## Treat prop PNGs

These are also registered in `BEACH_PROP_ASSETS`, but live in their own folder.

| Exact path | Status | Runtime role |
| --- | --- | --- |
| `assets/treats/hot_dog.png` | Present | Small hot dog at the stand and treat/stand feedback; 68-86px square source box |
| `assets/treats/treat_crumbs.png` | Pending | Optional crumbs around treat feedback |

These files do not replace Sweetie's numbered treat animation. Missing treat prop PNGs keep the existing CSS hot dog and crumb-free feedback.

## Optional audio files

Audio paths live in `AUDIO_ASSETS`, separate from the PNG registries:

| Exact path | Status | Runtime role |
| --- | --- | --- |
| `assets/audio/ocean_waves_loop.mp3` | Pending, optional | Quiet looping ambience at 0.25 volume while sound is enabled |
| `assets/audio/duck_quack_01.mp3` | Pending, optional | Throttled one-shot when the hot dog stand is visited |

Sound is strictly opt-in and waits for a user gesture before playback. Missing files, autoplay rejection, and unsupported audio never interrupt the game or create visible errors. See `assets/audio/README.md` for format, looping, volume, and future-file guidance.

## Artwork requirements

### Sweetie character artwork

- Use PNG files with real transparency.
- Keep the same canvas dimensions across every Sweetie pose and frame.
- Keep Sweetie at the same visual scale and location across frames.
- Use one consistent ground and feet anchor.
- Keep the full body inside the canvas.
- Leave enough transparent room for horizontal mirroring during walking.
- Use lowercase snake_case filenames and two-digit frame suffixes such as `_01`.

### Background artwork

- `beach_sky.png` and `beach_sand.png` may be opaque layer art.
- `sun.png` and all three cloud PNGs should use transparent canvases and remain separate from `beach_sky.png`.
- `distant_shore.png`, `ocean_water_texture.png`, and both foam files should use transparency.
- Make ocean textures horizontally tileable or wide enough to repeat cleanly.
- Keep the shoreline and foam bands separate from the sky and sand.
- Do not create one flattened, full-scene background image.

### Prop and treat artwork

- Use transparent PNGs with tight, consistent padding.
- Center artwork inside its canvas.
- Preserve a stable ground contact point for umbrella and stand art.
- Avoid shadows that extend far outside the canvas.
- Keep small shells and treats readable at phone size.
- Decorative scene images intentionally use empty alternative text.

## Runtime loading and fallback behavior

1. The browser preloads a registered path off-screen.
2. A successful file activates its image or background layer.
3. A missing file logs one console warning for that path; the intentionally optional stand owner and talking-frame paths stay silent.
4. Missing scene and prop artwork keeps its CSS fallback.
5. Missing Sweetie sequences fall through the character fallback chain.
6. The page never assigns a missing path to a visible decorative image.

Reload the page after adding or replacing PNG files. No build command is required.

## Runtime inspection helpers

Open the browser console and use:

```js
window.sweetiesGame.getSweetieAssets();
window.sweetiesGame.getSweetieAssetStatus();
window.sweetiesGame.getSweetieAnimations();
window.sweetiesGame.getBeachSceneAssets();
window.sweetiesGame.getBeachPropAssets();
window.sweetiesGame.getBeachAssetStatus();
```

`getBeachAssetStatus()` reports `ready`, `loading`, `missing`, or `unknown` for every scene and prop registry entry. Sweetie sequence membership and frame order are available through `getSweetieAnimations()`.

## Source-of-truth note

`game.js` is the executable source of truth. If a filename is added, removed, or renamed in `SWEETIE_ASSETS`, `SWEETIE_ANIMATIONS`, `BEACH_SCENE_ASSETS`, or `BEACH_PROP_ASSETS`, update this manifest in the same change.