import dts from "vite-plugin-dts";
import { externalizeDeps } from "vite-plugin-externalize-deps";

export default {
    plugins: [
        dts({ rollupTypes: true }), 
        externalizeDeps(),
    ],
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
    optimizeDeps: {
        exclude: [
            "@babylonjs/core"
        ],
    },
};
