# Beach prop assets

Place optional transparent prop PNGs in this folder using these exact names:

- `beach_umbrella.png`
- `beach_towel.png`
- `shell_01.png`
- `shell_02.png`
- `shell_03.png`
- `hot_dog_stand.png`
- `hot_dog_stand_talk.png` (optional talking frame)
- `hot_dog_stand_talk_02.png` (optional second talking frame)
- `stand_owner.png` (future optional white duck vendor overlay)

Loaded PNGs render at full opacity with normal blending. The matching CSS-constructed prop is completely hidden only after the PNG preloads successfully. Missing files retain the original CSS fallback.

The current `hot_dog_stand.png` may include the white duck vendor baked into the artwork. `stand_owner.png` is registered for a future separate vendor layer but is not required; a missing owner file is never assigned to the visible image element. Use the owner overlay with a duck-free stand composition to avoid duplicating the vendor. The stand speech bubble is rendered separately in HTML/CSS.

Both loaded PNGs and their CSS fallbacks inherit depth from the same prop container. Depth is calculated from the prop's measured ground/base Y position; larger base Y values render closer to the player. The second shell carries a small negative offset so it stays behind the umbrella pole.

## Stand/vendor NPC system

The hot dog stand is a lightweight NPC interaction point anchored to the existing `.hot-dog-stand.stand-npc` scene container. Using **Visit hot dog stand** selects one short duck-vendor line and displays it in the stand's own speech bubble. This bubble is separate from Sweetie's thought bubble, remains anchored above the stand, ignores pointer input, and does not follow Sweetie.

The dialogue pools live under `hotDogStand.dialogue` in `content/game-copy.js`. Successful restocks choose from the general, Sweetie-specific, and worldbuilding groups; cooldown visits use the cooldown group. A line remains visible for 4.2 seconds. Repeated visits replace the current text and restart the same timer, so bubbles never stack. At the same time, the stand runs a 250ms frame sequence: all three stand images produce idle -> talk -> talk 02 -> talk -> idle, only the first talking image produces idle/talk alternation, and no talking images leaves the idle frame unchanged. Repeated visits cancel and restart one frame timer, and every sequence restores the idle PNG.

All stand frames are loaded and decoded off-screen before playback. The live stand image stays fully opaque, uses one stable bottom-aligned container, and is never cleared between frames. A repeated visit cancels the existing timer and keeps the current valid frame visible while the sequence restarts. Missing or undecodable talking frames leave the idle stand and dialogue behavior intact. Idle and talking artwork should use exactly matching canvas dimensions, visual scale, and ground alignment; the browser logs one diagnostic warning when loaded frames differ.

### Stand interaction assets

- `assets/props/hot_dog_stand.png`: default idle stand artwork; it may include the white duck vendor baked into the image.
- `assets/props/hot_dog_stand_talk.png`: optional first full-stand talking expression.
- `assets/props/hot_dog_stand_talk_02.png`: optional second full-stand talking expression.
- `assets/props/stand_owner.png`: future optional white duck overlay for a duck-free stand composition.
- `assets/treats/hot_dog.png`: optional hot dog artwork used at the stand and in action feedback.
- `assets/treats/treat_crumbs.png`: optional crumbs used in treat feedback.

Every path is preload-and-decode-gated. Missing stand artwork keeps the CSS stand fallback, and the NPC dialogue continues to work. Missing talking variants silently reduce or disable only the mouth animation. Missing treat artwork keeps its CSS feedback. Missing `stand_owner.png` is silent, leaves no broken image icon, and assumes the vendor is already part of the stand art.

The single `visitStand()` handler is the intended future extension point for shells, cash, points, hot dog purchases, and accessory or outfit shopping. None of those systems are active: there is no currency, pricing, purchasing, shop menu, inventory, accessory data, or outfit implementation in this pass. The current interaction remains the existing free three-treat restock with its Joy bonus and 45-second cooldown.

## Responsive display boxes

- Umbrella: `clamp(190px, 24vw, 220px)` square canvas box
- Towel: `clamp(190px, 28vw, 245px)` wide footprint with an 86-108px scene height
- Hot dog stand: `clamp(205px, 24vw, 245px)` square canvas box
- Optional stand owner: 42% overlay inside the stand anchor
- Shells: `clamp(34px, 4vw, 46px)` square canvas boxes

The source PNGs currently use square canvases with transparent padding. The loaded-image CSS compensates for that padding independently rather than enlarging every prop equally. The towel keeps its existing rotation/skew so it reads as a mat lying on the sand.

Keep transparent padding modest, preserve a consistent ground contact point, and avoid shadows that extend far outside the artwork. Decorative images use empty alternative text because the scene already provides its accessible description.
