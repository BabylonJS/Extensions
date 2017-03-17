// Injects the shaders in BJS shader store :-)
(function() {
    // Inject all the spectre shader in the babylon shader store.
    for (var key in BABYLONX.AsciiArtRenderer.ShadersStore) {
        // Allow to override shaders in place.
        BABYLON.Effect.ShadersStore[key] = BABYLONX.AsciiArtRenderer.ShadersStore[key];
    }
})();