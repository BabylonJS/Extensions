import dts from "vite-plugin-dts";

export default {
    plugins: [
        dts({ rollupTypes: true }), 
    ],
    build: {
        lib: {
            entry: 'index.ts',
            name: 'babylon-htmlmesh',
            fileName: (format) => `${format}/babylon-htmlmesh.js`
        },
        rollupOptions: {
            external: [
                '@babylonjs/core', 
                '@babylonjs/inspector', 
                '@babylonjs/loaders'
            ],
            output: {
                globals: {
                    '@babylonjs/core': 'BABYLON',
                    '@babylonjs/inspector': 'BABYLON',
                    '@babylonjs/loaders': 'BABYLON'
                }
            }
        }
    },
    optimizeDeps: {
        exclude: [
            "@babylonjs/core",
            "@babylonjs/inspector",
            "@babylonjs/loaders"        
        ]
    }
}