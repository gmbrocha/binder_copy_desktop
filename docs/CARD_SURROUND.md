# Card surround

Implementation source: Build > Backdrop > Card surround, when the backend advertises `surroundConfigured`. Select a card, Create surround, then preview/Keep surround. A single-card page selects it automatically. One original center card and eight generated art panels use a dedicated 3x3 layout. Page ID/name survive; Undo restores the prior layout. Return to grid clears the surround. Normal generated backdrops remain independent. No external export is added.

The source integrates six-stage backend jobs and recovery; it does not call image providers from the device. The existing loading animation covers polling and rendered media. The shared source contract is 0.2.5; deploy the compatible backend first. Existing installed builds do not yet contain this option.

Canonical runner, original experiment archive, masking/prompt details, monthly reservation behavior, limitations and activation gates: the backend repository `docs/CARD_SURROUND.md`. New generations with the API model and actual native UI need verification before release. This checkpoint does not replace Apple build 12 or modify the frozen PWA.
