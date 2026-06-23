# Editable game copy

This folder stores the player-facing text for Sweetie's Beach Day. The main file is `game-copy.js`, which loads before `game.js` and works when `index.html` is opened directly without a local server.

## Editing text

Edit the quoted string values in `game-copy.js`. Keep property names such as `actions.pet.label` unchanged unless you also update the matching lookup in `game.js`.

Button copy is grouped under `actions`. Each button normally has a `label` and `subtitle` value. Dynamic subtitles, including Dream Quest locks, hot dog stand cooldowns, and the hidden note, live in their related sections.

Random reaction pools are arrays under `messages`. Add, remove, or rewrite quoted entries; the game chooses one entry each time that reaction occurs. Keep at least one message in each pool.

Hot dog stand vendor lines live under `hotDogStand.dialogue`. General, Sweetie-specific, and world lines are combined for a successful restock visit; `cooldown` lines are used while the duck prepares the next batch. Keep at least one line in every group.

## Placeholders

Text such as `"The duck needs {seconds}s"` contains a placeholder. The game replaces the word inside braces at runtime. Keep the braces and placeholder name intact:

- `{seconds}`: remaining hot dog stand cooldown
- `{bond}`: Bond required to unlock Dream Quest
- `{mood}`: current mood in Sweetie's accessible label
- `{stat}`: stat name used by a meter

The HTML and JavaScript retain small fallback strings so an accidental missing key does not stop the game, but `game-copy.js` is the intended place to edit visible wording.

Sound-toggle labels live under `audio.soundOn` and `audio.soundOff`. Changing these labels does not affect the saved sound preference or playback behavior.