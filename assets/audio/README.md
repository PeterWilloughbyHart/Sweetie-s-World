# Sweetie's Beach Day audio guide

This folder contains optional audio for Sweetie's Beach Day. Audio is an enhancement, never a gameplay requirement: the game remains fully playable when this folder contains only this README.

The audio system is intentionally small. It currently supports one looping ambience track and one short sound effect through the centralized manager in `game.js`. There is no music playlist, mixer UI, spatial audio, or large sound-effect library yet.

## Quick start

1. Add files using the exact names below.
2. Reload `index.html`.
3. Press **Sound: Off** in the header so it becomes **Sound: On**.
4. The waves should begin after that user gesture.
5. Use **Visit hot dog stand** to test the quack.

No build command or asset import step is required.

## Current registered assets

| Registry key | Exact path | Status | Runtime role | Manager level |
| --- | --- | --- | --- | --- |
| `oceanWaves` | `assets/audio/ocean_waves_loop.mp3` | Pending, optional | Continuous beach ambience while sound is enabled | `0.25` |
| `duckQuack` | `assets/audio/duck_quack_01.mp3` | Pending, optional | One-shot effect when **Visit hot dog stand** is used | `0.60` |

The executable source of truth is `AUDIO_ASSETS` near the top of `game.js`:

```js
const AUDIO_ASSETS = {
  oceanWaves: "assets/audio/ocean_waves_loop.mp3",
  duckQuack: "assets/audio/duck_quack_01.mp3"
};
```

Do not rename a registered file without updating the matching registry value and this guide.

## What the manager does

The audio manager creates one cached `Audio` element per registry key and exposes a small API:

| Method | Purpose |
| --- | --- |
| `setSoundEnabled(boolean)` | Saves the preference and starts or stops eligible audio |
| `getSoundEnabled()` | Returns the current preference |
| `toggleSound()` | Switches between enabled and disabled |
| `playSound(key)` | Plays a registered one-shot effect when audio is enabled and unlocked |
| `startAmbient(key)` | Starts a registered looping ambience track |
| `stopAmbient(key)` | Pauses a registered ambience track |

Audio elements are created lazily. Merely opening the game does not construct or play them.

### Current runtime behavior

- Sound defaults to off.
- The preference is stored separately in `localStorage` under `sweeties-beach-day-sound-v1`.
- Resetting Sweetie's game progress does not reset the sound preference.
- The header toggle controls ambience and effects together.
- Disabling sound pauses every cached audio element immediately.
- Ocean waves use `loop = true` and volume `0.25`.
- The quack uses `loop = false`, volume `0.60`, and a 450ms cooldown.
- Accepted quacks restart the cached effect from the beginning instead of creating overlapping copies.
- Waves pause while the page is hidden and resume when it becomes visible if sound is still enabled and browser playback has been unlocked.

## Autoplay and user gestures

Browsers commonly block audio that starts before a user gesture. The game therefore never attempts autoplay on initial page load.

A valid interaction such as pressing the sound toggle, starting the beach day, or using a game action unlocks the manager. If a saved preference restores **Sound: On**, the UI can show that preference immediately, but waves still wait for the next valid interaction before playback is attempted.

Calling `setSoundEnabled(true)` from the console updates the preference but does not bypass browser autoplay rules.

## Missing-file and playback fallback

Every audio file is optional.

If a path is missing, unsupported, or blocked:

- gameplay continues normally;
- Sweetie's actions and stats still update;
- the hot dog stand still restocks treats and displays dialogue;
- the animated ocean remains visual and unchanged;
- no player-facing error or broken UI appears;
- a helpful console warning is emitted at most once for that asset.

Playback promises and synchronous playback errors are caught. Do not add empty or fake audio files just to silence a missing-file warning.

## Choosing a file format

### MP3

Preferred for the current registry because it offers broad browser support and compact files. Use MP3 for the waves and the default quack filenames.

### WAV

A good option for short effects when maximum editing quality matters, but files are substantially larger. Using WAV requires changing the relevant `AUDIO_ASSETS` path and extension.

### OGG

Potentially useful for efficient loops, but the current manager registers one URL per sound and does not provide multi-source format negotiation. Using MP3 plus OGG fallbacks would require a small manager enhancement or `<audio><source>` handling.

Do not place multiple formats in this folder and expect the manager to select between them automatically.

## Preparing the wave loop

Recommended characteristics for `ocean_waves_loop.mp3`:

- seamless start and end points;
- no spoken voices, music, gull shrieks, or sudden foreground events;
- a stable, gentle noise floor that can repeat for long sessions;
- stereo is appropriate for broad ambience;
- 44.1kHz or 48kHz sample rate;
- restrained mastering with no harsh peaks;
- enough duration to avoid an obviously repetitive short cycle;
- modest file size suitable for a local browser game.

MP3 encoding can introduce tiny boundary padding. Audition the exported file on repeat in a browser and adjust the edit or encoder settings if a click, dip, or gap is audible.

The manager sets playback volume to `0.25`, but the source itself should still be mastered quietly and evenly. A loud source reduced in code can remain fatiguing.

## Preparing the duck quack

Recommended characteristics for `duck_quack_01.mp3`:

- one short, cheerful farm-duck quack;
- tightly trimmed leading and trailing silence;
- no background conversation or environmental noise;
- mono or narrow stereo is sufficient;
- no clipping or sharp transient spike;
- short enough to feel responsive on repeated stand visits.

The manager plays it at `0.60` volume and throttles requests for 450ms. The cooldown limits playback requests; it does not edit or shorten the source, so keep the file concise.

## Soft and cozy volume philosophy

Audio should support the beach scene rather than compete with Sweetie.

- Ambience should sit comfortably behind all interaction sounds.
- Effects should be readable but never startling.
- Avoid aggressive compression, excessive bass, and bright transient peaks.
- Test with laptop speakers, phone speakers, and headphones.
- Check both quiet and normal system-volume settings.
- Prefer lowering the source level before raising manager volume values.

The current manager has one ambient level and one effects level. Per-sound sliders, buses, ducking, and a master-volume control are not implemented.

## Adding another sound later

The manager is ready for additional registry entries such as:

```js
const AUDIO_ASSETS = {
  oceanWaves: "assets/audio/ocean_waves_loop.mp3",
  duckQuack: "assets/audio/duck_quack_01.mp3",
  sweetieBark: "assets/audio/sweetie_bark_01.mp3"
};
```

Adding a path only makes the asset available. It does not decide when the sound plays. The relevant action handler must explicitly call:

```js
audioManager.playSound("sweetieBark");
```

For another looping ambience track, use `startAmbient(key)` and `stopAmbient(key)` and decide how simultaneous loops should behave. The current manager does not automatically crossfade, prioritize, or mix multiple ambience tracks.

### Future filename ideas

These files are examples only and are not currently registered or triggered:

- `sweetie_bark_01.mp3`
- `treat_chomp.mp3`
- `water_slurp.mp3`
- `sleepy_sigh.mp3`
- `stand_sale_ding.mp3`
- `beach_day_theme_loop.mp3`

There is no music system in the current version. Adding `beach_day_theme_loop.mp3` to the folder alone will do nothing.

## Naming conventions

- Use lowercase snake_case filenames.
- Use two-digit suffixes for variants, such as `_01`, `_02`, and `_03`.
- Include `_loop` in ambience filenames intended to repeat.
- Keep names descriptive of the event rather than the UI control.
- Avoid spaces, uppercase extensions, and punctuation in filenames.

## Runtime inspection

The browser console exposes the current registry and manager helpers:

```js
window.sweetiesGame.getAudioAssets();
window.sweetiesGame.audio.getSoundEnabled();
window.sweetiesGame.audio.setSoundEnabled(true);
window.sweetiesGame.audio.toggleSound();
window.sweetiesGame.audio.playSound("duckQuack");
window.sweetiesGame.audio.startAmbient("oceanWaves");
window.sweetiesGame.audio.stopAmbient("oceanWaves");
```

Remember that browser playback still requires a real user gesture even when a console command changes the saved preference.

## Test checklist

After adding or replacing audio:

1. Reload the game with sound off and confirm nothing plays automatically.
2. Enable sound and confirm the toggle reads **Sound: On**.
3. Confirm the waves begin quietly and loop without a click or obvious gap.
4. Hide and restore the browser tab; confirm the waves pause and resume.
5. Visit the hot dog stand; confirm one quack plays without delaying dialogue or treat restocking.
6. Tap the stand repeatedly; confirm quacks do not pile up.
7. Disable sound while waves or a quack are playing; confirm playback stops immediately.
8. Reload with the saved preference on; confirm audio waits for a new user gesture.
9. Temporarily rename an audio file; confirm gameplay continues and only one helpful warning appears.
10. Test on a phone-sized screen and at a comfortable device volume.

## Troubleshooting

### The toggle says On, but nothing plays

Interact with the page once to satisfy autoplay policy. Then check the browser console and confirm the filename, extension, and relative path exactly match `AUDIO_ASSETS`.

### The waves play once and stop

Confirm the sound was started through `startAmbient("oceanWaves")`. The manager sets `loop` automatically for ambience; calling `playSound` is intended for one-shot effects.

### The loop clicks or pauses at the boundary

The manager cannot repair an imperfect source boundary. Re-edit and re-export the loop, then test the encoded MP3 itself in a browser.

### Quacks overlap or feel too frequent

The current manager reuses one audio element and applies a 450ms cooldown. Shorten the source if its tail is unusually long, or adjust `duckQuackCooldownMs` in `AUDIO_CONFIG` if the interaction design changes.

### Audio works over HTTP but not from a local file

Browser media policies vary. Confirm a user gesture occurred, inspect the console warning, and test through a simple local web server if the browser restricts media playback from `file://` pages.

## Licensing and provenance

Only add audio you created, commissioned, or have permission to redistribute. Keep source attribution or license notes alongside project documentation when required. Avoid embedding personal recordings or third-party material without clear rights.

## Source-of-truth note

`game.js` is the executable source of truth for asset keys, paths, volumes, cooldowns, and runtime behavior. Update this README whenever `AUDIO_ASSETS`, `AUDIO_CONFIG`, trigger behavior, or the sound-toggle lifecycle changes.