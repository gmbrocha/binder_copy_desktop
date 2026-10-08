# Bundled deterministic scenery

The five PNGs in assets/backgrounds are rasterizations of the original renderBackdropSvg in the frozen PWA/domain source f35163d (shared helper snapshot b04e673), at 1000 x 1500. They contain no cards, personal content or paid-generated artwork. Native Image stretches them using the same viewBox geometry as export. Used only for legacy pages whose backdropMode is absent and which have no generated backdrop. Explicit Color mode remains solid.

These bundled assets avoid introducing different SVG implementations on iPhone and macOS. Regenerate from the shared source renderer with Sharp when that renderer changes, and compare to exported backgrounds before release.

October 8 light-preset update: re-rasterized the same deterministic scenery from contract/domain 0.2.2 at backend 4cdf8e8. Native legacy previews now match server exports using pale preset colors. Solid custom colors bypass scenery and use the shared pagePalette resolver. No image-generation API was used.
