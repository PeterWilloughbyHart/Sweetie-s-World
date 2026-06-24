# Editable game copy

This folder stores editable content for Sweetie's Beach Day. The main copy file is `game-copy.js`, which loads before `game.js` and works when `index.html` is opened directly without a local server. Shell Words puzzle data lives in `shell-words-puzzles.js`, which also loads before `game.js`.

## Editing text

Edit the quoted string values in `game-copy.js`. Keep property names such as `actions.pet.label` unchanged unless you also update the matching lookup in `game.js`.

Button copy is grouped under `actions`. Each button normally has a `label` and `subtitle` value. Dynamic subtitles, including Dream Quest locks, hot dog stand cooldowns, and the hidden note, live in their related sections.

Random reaction pools are arrays under `messages`. Add, remove, or rewrite quoted entries; the game chooses one entry each time that reaction occurs. Keep at least one message in each pool.

Hot dog stand vendor lines live under `hotDogStand.dialogue`. General, Sweetie-specific, and world lines are combined for a successful restock visit; `cooldown` lines are used while the duck prepares the next batch. Keep at least one line in every group.


## Shell Words puzzles

Edit `shell-words-puzzles.js` to add or revise the curated Shell Words mini-game rounds. The game does not use a dictionary, so every accepted word must be listed explicitly.

Each puzzle should include:

- `id`: stable unique identifier for future reward hooks
- `title`: short display name shown in the modal
- `letters`: six or seven single-letter strings
- `minimumLength`: usually `3`
- `wordsToWin`: currently `5`
- `acceptedWords`: at least ten normal target words that can be made from the letters
- `bonusWords`: optional extra words that do not count toward completion

Keep every accepted or bonus word buildable from the supplied letters, respecting repeated letters. For example, a word with two `e` characters needs two `E` entries in `letters`.

## Placeholders

Text such as `"The duck needs {seconds}s"` contains a placeholder. The game replaces the word inside braces at runtime. Keep the braces and placeholder name intact:

- `{seconds}`: remaining hot dog stand cooldown
- `{bond}`: Bond required to unlock Dream Quest
- `{mood}`: current mood in Sweetie's accessible label
- `{stat}`: stat name used by a meter
- `{minimum}`: minimum Shell Words length
- `{word}`: submitted Shell Words entry
- `{title}`: Shell Words puzzle title
- `{found}`: number of target words found
- `{target}`: number of target words needed to complete the puzzle
- `{bonus}`: number of optional bonus words found
- `{tier}`: future reward tier placeholder

The HTML and JavaScript retain small fallback strings so an accidental missing key does not stop the game, but `game-copy.js` is the intended place to edit visible wording.

Sound-toggle labels live under `audio.soundOn` and `audio.soundOff`. Changing these labels does not affect the saved sound preference or playback behavior.
Shell Words labels and validation text live under `shellWords` in `game-copy.js`. Puzzle letters and accepted word lists live in `shell-words-puzzles.js`.
