import * as BABYLON from '@babylonjs/core'

export const QuickTreeGenerator = (
    sizeBranch: number,
    sizeTrunk: number,
    radius: number,
    trunkMaterial: BABYLON.Material,
    leafMaterial: BABYLON.Material,
    scene?: BABYLON.Scene
) => {
    const tree = new BABYLON.Mesh('tree', scene)

    const leaves = BABYLON.MeshBuilder.CreateSphere('sphere', { segments: 2, diameter: sizeBranch })
    console.log(leaves.getBoundingInfo().boundingSphere.radius)

    const positions = leaves.getVerticesData(BABYLON.VertexBuffer.PositionKind)
    const indices = leaves.getIndices()
    if (!positions) {
        return tree
    }
    const numberOfPoints = positions.length / 3

    const map: any[] = []

    const max: BABYLON.Vector3[] = []

    for (let i = 0; i < numberOfPoints; i++) {
        const p = new BABYLON.Vector3(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2])

        if (p.y >= sizeBranch / 2) {
            max.push(p)
        }

        let found = false
        for (let index = 0; index < map.length && !found; index++) {
            const array = map[index]
            const p0 = array[0] as BABYLON.Vector3
            if (p0.equals(p) || p0.subtract(p).lengthSquared() < 0.01) {
                array.push(i * 3)
                found = true
            }
        }
        if (!found) {
            const array: any[] = []
            array.push(p, i * 3)
            map.push(array)
        }
    }

    const randomNumber = (min: number, max: number) => {
        if (min == max) {
            return min
        }
        const random = Math.random()
        return random * (max - min) + min
    }

    map.forEach(function (array) {
        const min = -sizeBranch / 10
        const max = sizeBranch / 10
        const rx = randomNumber(min, max)
        const ry = randomNumber(min, max)
        const rz = randomNumber(min, max)

        for (let index = 1; index < array.length; index++) {
            const i = array[index] as number
            positions[i] += rx
            positions[i + 1] += ry
            positions[i + 2] += rz
        }
    })

    leaves.setVerticesData(BABYLON.VertexBuffer.PositionKind, positions)
    const normals = [] as BABYLON.FloatArray
    BABYLON.VertexData.ComputeNormals(positions, indices, normals)
    leaves.setVerticesData(BABYLON.VertexBuffer.NormalKind, normals)
    leaves.convertToFlatShadedMesh()

    leaves.material = leafMaterial

    const trunk = BABYLON.MeshBuilder.CreateCylinder('trunk', {
        height: sizeTrunk,
        diameterTop: radius - 2 < 1 ? 1 : radius - 2,
        diameterBottom: radius,
        tessellation: 10,
        subdivisions: 2,
    })

    trunk.material = trunkMaterial
    trunk.convertToFlatShadedMesh()

    leaves.parent = tree
    trunk.parent = tree

    leaves.position.y = (sizeTrunk + sizeBranch) / 2 - 2

    return tree
}
