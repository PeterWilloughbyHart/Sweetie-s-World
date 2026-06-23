# Treat prop assets

Place optional transparent treat PNGs in this folder using these exact names:

- `hot_dog.png`: used by the small stand hot dog and treat/stand feedback prop
- `treat_crumbs.png`: optional subtle crumbs around the treat feedback prop

The loaded hot dog uses a responsive `clamp(68px, 8vw, 86px)` square source box. Its artwork is narrow inside the square canvas, producing a readable approximately 53-67px-wide hot dog at full opacity on desktop and phones.

These files affect scene and feedback props only. They do not replace or modify Sweetie's `sweetie_treat_01.png` through `sweetie_treat_03.png` character animation.

Missing files keep the existing CSS hot dog and feedback shapes. Loaded files fully replace those shapes instead of blending with them.
