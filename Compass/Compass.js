import { Vector3, Mesh, MeshBuilder, Color3, Scene, ArcRotateCamera, Node, DynamicTexture, StandardMaterial } from "@babylonjs/core"
/** @param rad number */
export function getCardinalDirectionLabel(rad) {
  switch (rad) {
    case 0: 
      return 'E'
    case (Math.PI * 0.25):
      return 'SE'
    case (Math.PI * 0.5):
        return 'S'
    case (Math.PI * 0.75):
      return 'SW'
    case Math.PI:
        return 'W'
    case (Math.PI * 1.25):
      return 'NW'
    case (Math.PI * 1.5):
      return 'N'
    case (Math.PI * 1.75):
      return 'NE'
    default:
      return ''
  }
}

/** @param DrawLetterParams { x: number, y: number, z: number, height: number, width: number, scene: Scene, parent?: Mesh} */
export const drawN = ({ x, y, z, height, width, scene, parent }) => {
  const z1 = z - (width * 0.5)
  const z2 = z + (width * 0.5)
  
  const basePoint = new Vector3(x, y, z1)

  const node = new Mesh(`letter_N`, scene)
  node.position = basePoint
  if (parent) {
    node.parent = parent
  }

  const stroke1 = [basePoint, new Vector3(x, y - height, z1)]
  const stroke2 = [basePoint, new Vector3(x, y - height, z2)]
  const stroke3 = [
    new Vector3(x, y - height, z2),
    new Vector3(x, y, z2),
  ]
  return [stroke1, stroke2, stroke3]
}

export const drawE = ({ x, y, z, height, width, scene, parent }) => {
  const x1 = x - (width * 0.5)
  const x2 = x + (width * 0.5)
  
  const basePoint = new Vector3(x1, y, z)

  const node = new Mesh(`letter_E`, scene)
  node.position = basePoint
  if (parent) {
    node.parent = parent
  }
  const stroke1 = [basePoint, new Vector3(x1, y - height, z)]
  const stroke2 = [basePoint, new Vector3(x2, y, z)]
  const stroke3 = [
    new Vector3(x1, y - (height * 0.5), z),
    new Vector3(x2, y - (height * 0.5), z),
  ]
  const stroke4 = [new Vector3(x1, y - height, z), new Vector3(x2, y - height, z)]
  return [stroke1, stroke2, stroke3, stroke4]
}

export const drawW = ({ x, y, z, height, width, scene, parent }) => {
  const x1 = x + (width * 0.5)
  const x1a = x1 - (width * 0.25)
  const x2 = x - (width * 0.5)
  const x2b = x2 + (width * 0.25)
  
  const basePoint = new Vector3(x1, y, z)
  const node = new Mesh(`letter_W`, scene)
  node.position = basePoint
  if (parent) {
    node.parent = parent
  }
  const stroke1 = [basePoint, new Vector3(x1a, y - height, z)]
  const stroke2 = [
    new Vector3(x1a, y - height, z),
    new Vector3(x, y, z),
  ]
  const stroke3 = [
    new Vector3(x, y, z),
    new Vector3(x2b, y - height, z),
  ]
  const stroke4 = [
    new Vector3(x2b, y - height, z),
    new Vector3(x2, y, z),
  ]
  return [stroke1, stroke2, stroke3, stroke4]
}

export const drawS = ({ x, y, z, height, width, scene, parent }) => {
  const z1 = z + (width * 0.5)
  const z2 = z - (width * 0.5)
  
  const basePoint = new Vector3(x, y, z1)
  const node = new Mesh(`letter_S`, scene)
  node.position = basePoint
  if (parent) {
    node.parent = parent
  }
  const stroke1 = [basePoint, new Vector3(x, y - height, z2)]
  const stroke2 = [basePoint, new Vector3(x, y, z2)]
  const stroke3 = [
    new Vector3(x, y, z2),
    new Vector3(x, y - (height * 0.5), z2),
  ]
  const stroke4 = [
    new Vector3(x, y - height, z2),
    new Vector3(x, y - height, z1),
  ]
  const stroke5 = [
    new Vector3(x, y - height, z1),
    new Vector3(x, y - (height * 0.5), z1),
  ]
  return [stroke1, stroke2, stroke3, stroke4, stroke5]
}
/** @param letter string  'E' | 'NE' | 'N' | 'NW' | 'W' | 'SW' | 'S' | 'SE' */
export const drawLetter = (letter, params) => {
  switch (letter) {
    case 'E':
      return drawE(params)
    case 'N':
      return drawN(params)
    case 'W':
      return drawW(params)
    case 'S':
      return drawS(params)
    default:
      return []
  }
}

export class Compass {
  pointsOnCircle // number
  radius // number
  compassMesh // Mesh
  lines // Vector3[][]
  degreesTexture // DynamicTexture
  degreesMesh // Mesh
  dirs // string[]
  sizec // number
  scene // Scene
  camera // ArcRotateCamera
  _rad2AngleScale // number
  _font = 'bold 44px monospace'

  constructor(
    radius, // number
    pointsOnCircle, // number
    yOffset = 0,
    parent, // Node | Mesh,
    scene, // Scene,
    camera, // ArcRotateCamera,
    showDegrees = false,
  ) {
    const dirs = ['E', 'N', 'W', 'S']
    const sizec = 25
    const lines = []
    const points = []
    const radp = (Math.PI * 2) / pointsOnCircle
    const compassWidth = 360

    if (showDegrees === true) { // TODO: still haven't gotten this to work right, the degrees dont show up
      const degreesMesh = MeshBuilder.CreatePlane('compass_degrees', { width: 10, height: 5, }, scene)
      this.degreesMesh = degreesMesh
      this.degreesTexture = new DynamicTexture('compass_degrees_texture', { width: 10, height: 5 }, scene)
      this.degreesTexture.hasAlpha = true
      this.degreesMesh.parent = parent
      degreesMesh.position = new Vector3(-1, 10, 100)
      const material = new StandardMaterial('degrees_material', scene)
      material.diffuseTexture = this.degreesTexture
      this.degreesTexture.drawText(`${camera.alpha}`, 0, 0, this._font, "gold", "transparent", true, true)
      this.degreesMesh.material = material
    }

    for (let i = 0; i < pointsOnCircle; i++) {
      const rad = radp * i
      const x = radius * Math.sin(rad)
      const z = radius * Math.cos(rad)
      const y = yOffset
      const pos = new Vector3(x, y, z)
      const pos2 = new Vector3(x, y - 3.5, z)
      points.push(pos)
      lines.push([pos, pos2])
      const node = new Mesh(`compass_node_${rad}`, scene)
      node.position = pos
      node.parent = parent
      const letter = getCardinalDirectionLabel(rad)
      if (letter) {
        switch(letter) { // TODO
          case 'NE':
            break
          case 'NW':
            break
          case 'SE':
            break
          case 'SW':
            break
          default:
            const letterLines = drawLetter(
              letter,
              { x, y: y - 4, z, height: 1, width: 0.5, scene }
            )
            lines.push(...letterLines)
        }
      }
    }

    points.push(points[0].clone())
    lines.push(points)

    var compassMesh = MeshBuilder.CreateLineSystem("compass_mesh", { lines, updatable: false }, scene)
    compassMesh.renderingGroupId = 2
    compassMesh.color = new Color3(1, 1, 0)
    compassMesh.parent = parent
    this.pointsOnCircle = pointsOnCircle;
    this.radius = radius
    this.compassMesh = compassMesh
    this.lines = lines
    this.dirs = dirs
    this.sizec = sizec
    this.scene = scene
    this.camera = camera
    this._rad2AngleScale = compassWidth / (2 * Math.PI)
    
    scene.registerBeforeRender(() => {
      let rad = camera.alpha
      if (rad < 0) {
        rad += (2 * Math.PI)
      }
      rad = rad % (2 * Math.PI)
      this.setCurrentAngle(rad)
    })
  }

  /** @param rad number */
  setCurrentAngle(rad) {
    this.compassMesh.rotation.y = rad

    if (this.degreesTexture) {
      const degrees = this.convertRadToAngle(rad).toFixed(1)
      this.degreesTexture.drawText(degrees, 0, 0, this._font, "gold", "transparent", true, true)
    }
  }

  /** @param rad number */
  convertRadToAngle(rad) {
    return rad * this._rad2AngleScale
  }

  hide() {
    this.compassMesh.setEnabled(false)
  }

  show() {
    this.compassMesh.setEnabled(true)
  }
}