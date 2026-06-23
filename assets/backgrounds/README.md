# Background assets

Place optional beach background PNGs in this folder using these exact names:

## Static broad layers

- `beach_sky.png`: broad static sky artwork behind every sun and cloud layer
- `beach_sand.png`: static sand artwork over the CSS sand base
- `distant_shore.png`: transparent distant shoreline band near the top of the ocean

## Animated sky decorations

- `sun.png`: transparent upper-right sun overlay with an 80-second rotation
- `cloud_01.png`: transparent cloud with a gentle 64-second left-to-right drift
- `cloud_02.png`: transparent cloud with a slower 92-second right-to-left drift
- `cloud_03.png`: transparent cloud with a tiny 118-second side-to-side float

The sun and clouds activate independently. If a PNG is missing, the existing CSS sun or matching CSS cloud remains visible. Cloud 03 has no constructed fallback, so the sky simply uses the other decorations when it is absent. All decoration layers ignore pointer input and remain behind the ocean, props, Sweetie, feedback, and UI.

Reduced-motion mode keeps successfully loaded sun and cloud PNGs visible but disables their rotation and drift.

## Animated ocean overlays

- `ocean_water_texture.png`: seamless or wide transparent texture that repeats and drifts slowly
- `wave_foam_01.png`: transparent repeating foam band near the front of the water
- `wave_foam_02.png`: transparent repeating secondary foam band at a different depth and speed

All files are optional. Missing files keep the current CSS sky, CSS sun and clouds, sand, ocean gradient, and animated waves.

The ocean texture and foam files are overlays, not replacements. Do not supply a full static beach screenshot or full-frame ocean animation here. The animated ocean remains independent from the sky-decoration system.
