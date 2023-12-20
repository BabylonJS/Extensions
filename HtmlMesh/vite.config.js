export default {
    build: {
        lib: {
            entry: 'index.js',
            name: 'babylon-htmlmesh',
            fileName: (format) => `${format}/babylon-htmlmesh.js`
        },
    },
    optimizeDeps: {
        exclude: [
            "@babylonjs/core",
            "@babylonjs/inspector",
            "@babylonjs/loaders",
        ]
    }
}