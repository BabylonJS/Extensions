import { externalizeDeps } from "vite-plugin-externalize-deps";

export default {
    build: {
        lib: {
            entry: "./src/index.ts",
            name: "babylon-htmlmesh",
            fileName: (format) => `${format}/babylon-htmlmesh.js`,
        },
        rollupOptions: {
            output: {
                globals: (moduleId) =>
                    moduleId.startsWith("@babylonjs") ? "BABYLON" : undefined,
            },
        },
    },
    plugins: [
        externalizeDeps(),
    ],
    optimizeDeps: {
        exclude: [
            "@babylonjs/core",
            "@babylonjs/inspector",
            "@babylonjs/loaders",
        ],
    },
};
