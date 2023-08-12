//canopies number of leaf sections, height of tree, materials
export const simplePineGenerator = (canopies, height, trunkMaterial, leafMaterial, scene) => {
    const curvePoints = (l, t) => {
        const path = [];
        const step = l / t;
        for (let i = 0; i < l; i += step) {
            path.push(new BABYLON.Vector3(0, i, 0));
            path.push(new BABYLON.Vector3(0, i, 0));
        }
        return path;
    };
    const nbL = canopies + 1;
    const nbS = height;
    const curve = curvePoints(nbS, nbL);
    const radiusFunction = (i, distance) => {
        let fact = 1;
        if (i % 2 == 0) {
            fact = .5;
        }
        const radius = (nbL * 2 - i - 1) * fact;
        return radius;
    };
    const leaves = BABYLON.Mesh.CreateTube("tube", curve, 0, 10, radiusFunction, 1, scene);
    const trunk = BABYLON.Mesh.CreateCylinder("trunk", nbS / nbL, nbL * 1.5 - nbL / 2 - 1, nbL * 1.5 - nbL / 2 - 1, 12, 1, scene);
    leaves.material = leafMaterial;
    trunk.material = trunkMaterial;
    const tree = BABYLON.Mesh.CreateBox('', 1, scene);
    tree.isVisible = false;
    leaves.parent = tree;
    trunk.parent = tree;
    return tree;
}
