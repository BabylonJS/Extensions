from .logger import *
from .package_level import *

from .f_curve_animatable import *
from .armature import *
from .material import *
from .particle_hair import *
from .shape_key_group import *

import bpy
import math
from mathutils import Vector
import shutil

# output related constants
MAX_VERTEX_ELEMENTS = 65535
MAX_VERTEX_ELEMENTS_32Bit = 16777216
COMPRESS_MATRIX_INDICES = True

# used in Mesh & Node constructors, defined in BABYLON.AbstractMesh
BILLBOARDMODE_NONE = 0
#BILLBOARDMODE_X = 1
#BILLBOARDMODE_Y = 2
#BILLBOARDMODE_Z = 4
BILLBOARDMODE_ALL = 7

# used in Mesh constructor, defined in BABYLON.PhysicsImpostor
SPHERE_IMPOSTER = 1
BOX_IMPOSTER = 2
#PLANE_IMPOSTER = 3
MESH_IMPOSTER = 4
CAPSULE_IMPOSTER = 5
CONE_IMPOSTER = 6
CYLINDER_IMPOSTER = 7
PARTICLE_IMPOSTER = 8

DEFAULT_SHAPE_KEY_GROUP = 'GROUPSONLY'
SHAPE_KEY_GROUPS_ALLOWED = True

TREAT_AS_MESH = 'AS_MESH'
TREAT_AS_HAIR = 'AS_HAIR'

JUST_MAKE_VISIBLE = 'JUST_MAKE_VISIBLE' # not actually passed, since default & unnecessary for meshes not QI.Mesh
GATHER            = 'QI.GatherEntrance'
EXPAND            = 'QI.ExpandEntrance'
FIRE              = 'QI.FireEntrance'
TELEPORT          = 'QI.TeleportEntrance'
POOF              = 'QI.PoofEntrance'
CUSTOM            = 'Module.Class'

GATHER_DUR        = '[250]'
EXPAND_DUR        = '[250, 400]'
FIRE_DUR          = '[400]'
TELEPORT_DUR      = '[1500]'
POOF_DUR          = '[1500]'
CUSTOM_DUR        = '[250]'

WHOOSH_SND        = 'QI.Whoosh(scene)'
TELEPORT_SND      = 'QI.Teleport(scene)'
#===============================================================================
class Mesh(FCurveAnimatable):
    def __init__(self, object, scene, startFace, forcedParent, nameID, exporter):
        self.name = object.name + str(nameID)
        Logger.log('processing begun of mesh:  ' + self.name)
        self.define_animations(object, True, True, True)  #Should animations be done when forcedParent

        # Tower of Babel specific members
        self.legalName = legal_js_identifier(self.name)
        if (len(self.legalName) == 0):
            self.legalName = 'Unknown' + str(exporter.nNonLegalNames)
            exporter.nNonLegalNames = exporter.nNonLegalNames + 1
        self.userSuppliedBaseClass = object.data.baseClass

        self.needEntrance = object.data.grandEntrance != JUST_MAKE_VISIBLE
        if self.needEntrance:
            self.entranceClass = object.data.entranceClass
            self.entranceDur   = object.data.entranceDur
            self.entranceSnd   = object.data.entranceSnd
            self.disposeSound  = object.data.disposeSound

        self.isVisible = not object.hide_render
        self.isEnabled = not object.data.loadDisabled
        self.useFlatShading = scene.export_flatshadeScene or object.data.useFlatShading
        self.checkCollisions = object.data.checkCollisions
        self.receiveShadows = object.data.receiveShadows
        self.castShadows = object.data.castShadows
        self.freezeWorldMatrix = object.data.freezeWorldMatrix
        self.layer = getLayer(object) # used only for lights with 'This Layer Only' checked, not exported

        # hasSkeleton detection & skeletonID determination
        hasSkeleton = False
        objArmature = None      # if there's an armature, this will be the one!
        if len(object.vertex_groups) > 0 and not object.data.ignoreSkeleton:
            objArmature = object.find_armature()
            if objArmature != None:
                hasSkeleton = True
                # used to get bone index, since could be skipping IK bones
                self.skeleton = exporter.get_skeleton(objArmature.name)
                i = 0
                for obj in scene.objects:
                    if obj.type == "ARMATURE":
                        if obj == objArmature:
                            self.skeletonId = i
                            break
                        else:
                            i += 1

        # determine Position, rotation, & scaling
        if forcedParent is None:
            # Use local matrix
            locMatrix = object.matrix_local
            if objArmature != None:
                # unless the armature is the parent
                if object.parent and object.parent == objArmature:
                    locMatrix = object.matrix_world * object.parent.matrix_world.inverted()

            loc, rot, scale = locMatrix.decompose()
            self.position = loc
            if object.rotation_mode == 'QUATERNION':
                self.rotationQuaternion = rot
            else:
                self.rotation = scale_vector(rot.to_euler('XYZ'), -1)
            self.scaling  = scale
        else:
            # use defaults when not None
            self.position = Vector((0, 0, 0))
            self.rotation = scale_vector(Vector((0, 0, 0)), 1) # isn't scaling 0's by 1 same as 0?
            self.scaling  = Vector((1, 1, 1))

        # ensure no unapplied rotation or scale, when there is an armature
        self.hasUnappliedTransforms = (self.scaling.x != 1 or self.scaling.y != 1 or self.scaling.z != 1 or
                (hasattr(self, 'rotation'          ) and (self.rotation          .x != 0 or self.rotation          .y != 0 or self.rotation          .z != 0)) or
                (hasattr(self, 'rotationQuaternion') and (self.rotationQuaternion.x != 0 or self.rotationQuaternion.y != 0 or self.rotationQuaternion.z != 0 or self.rotationQuaternion.w != 1))
                )

        # determine parent & dataName
        if forcedParent is None:
            self.dataName = object.data.name # used to support shared vertex instances in later passed
            if object.parent and object.parent.type != 'ARMATURE':
                self.parentId = object.parent.name
        else:
            self.dataName = self.name
            self.parentId = forcedParent.name

        # Physics
        if object.rigid_body != None:
            shape_items = {'SPHERE'     : SPHERE_IMPOSTER,
                           'BOX'        : BOX_IMPOSTER,
                           'MESH'       : MESH_IMPOSTER,
                           'CAPSULE'    : CAPSULE_IMPOSTER,
                           'CONE'       : CONE_IMPOSTER,
                           'CYLINDER'   : CYLINDER_IMPOSTER,
                           'CONVEX_HULL': PARTICLE_IMPOSTER}

            shape_type = shape_items[object.rigid_body.collision_shape]
            self.physicsImpostor = shape_type
            
            mass = object.rigid_body.mass
            if mass < 0.005:
                mass = 0
            self.physicsMass = mass
            self.physicsFriction = object.rigid_body.friction
            self.physicsRestitution = object.rigid_body.restitution

        # Get if this will be an instance of another, before processing materials, to avoid multi-bakes
        sourceMesh = exporter.getSourceMeshInstance(self.dataName)
        if sourceMesh is not None:
            #need to make sure rotation mode matches, since value initially copied in InstancedMesh constructor
            if hasattr(sourceMesh, 'rotationQuaternion'):
                instRot = None
                instRotq = rot
            else:
                instRot = scale_vector(rot.to_euler('XYZ'), -1)
                instRotq = None

            instance = MeshInstance(self, instRot, instRotq)
            sourceMesh.instances.append(instance)
            Logger.log('mesh is an instance of :  ' + sourceMesh.name + '.  Processing halted.', 2)
            return
        else:
            self.instances = []

        # process all of the materials required
        maxVerts = MAX_VERTEX_ELEMENTS if scene.force64Kmeshes else MAX_VERTEX_ELEMENTS_32Bit # change for multi-materials or shapekeys
        recipe = BakingRecipe(object)
        self.billboardMode = BILLBOARDMODE_ALL if recipe.isBillboard else BILLBOARDMODE_NONE

        if recipe.needsBaking:
            if recipe.multipleRenders:
                Logger.warn('Mixing of Cycles & Blender Render in same mesh not supported.  No materials exported.', 2)
            else:
                bakedMat = BakedMaterial(exporter, object, recipe)
                exporter.materials.append(bakedMat)
                self.materialId = bakedMat.name

        else:
            bjs_material_slots = []
            for slot in object.material_slots:
                # None will be returned when either the first encounter or must be unique due to baked textures
                material = exporter.getMaterial(slot.name)
                if (material != None):
                    Logger.log('registered as also a user of material:  ' + slot.name, 2)
                else:
                    material = StdMaterial(slot, exporter, object)
                    exporter.materials.append(material)

                bjs_material_slots.append(material)

            if len(bjs_material_slots) == 1:
                self.materialId = bjs_material_slots[0].name

            elif len(bjs_material_slots) > 1:
                multimat = MultiMaterial(bjs_material_slots, len(exporter.multiMaterials), exporter.nameSpace)
                self.materialId = multimat.name
                exporter.multiMaterials.append(multimat)
                maxVerts = MAX_VERTEX_ELEMENTS_32Bit
            else:
                Logger.warn('No materials have been assigned: ', 2)

        # Get mesh
        mesh = object.to_mesh(scene, True, 'PREVIEW')

        # Triangulate mesh if required
        Mesh.mesh_triangulate(mesh)

        # Getting vertices and indices
        self.positions  = []
        self.normals    = []
        self.uvs        = [] # not always used
        self.uvs2       = [] # not always used
        self.colors     = [] # not always used
        self.indices    = []
        self.subMeshes  = []

        hasUV = len(mesh.tessface_uv_textures) > 0
        if hasUV:
            which = len(mesh.tessface_uv_textures) - 1 if recipe.needsBaking else 0
            UVmap = mesh.tessface_uv_textures[which].data

        hasUV2 = len(mesh.tessface_uv_textures) > 1 and not recipe.needsBaking
        if hasUV2:
            UV2map = mesh.tessface_uv_textures[1].data

        hasVertexColor = len(mesh.vertex_colors) > 0
        if hasVertexColor:
            Colormap = mesh.tessface_vertex_colors.active.data

        if hasSkeleton:
            weightsPerVertex = []
            indicesPerVertex = []
            influenceCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0] # 9, so accessed orign 1; 0 used for all those greater than 8
            totalInfluencers = 0
            highestInfluenceObserved = 0

        hasShapeKeys = False
        if object.data.shape_keys and not object.data.ignoreShapeKeys:
            for block in object.data.shape_keys.key_blocks:
                if (block.name == 'Basis'):
                    hasShapeKeys = True
                    keyOrderMap = []
                    basis = block
                    maxVerts = MAX_VERTEX_ELEMENTS_32Bit
                    break

            if not hasShapeKeys:
                Logger.warn('Basis key missing, shape-key processing NOT performed', 2)

        deferNormals = object.data.deferNormals
        if (deferNormals and hasShapeKeys and self.useFlatShading):
            Logger.warn('Deferring Normals not possible when using shapekey and flatshading. Ignored', 2)
            deferNormals = False

        # used tracking of vertices as they are received
        alreadySavedVertices = []
        vertices_Normals = []
        vertices_UVs = []
        vertices_UV2s = []
        vertices_Colors = []
        vertices_indices = []
        vertices_sk_weights = []
        vertices_sk_indices = []

        self.offsetFace = 0

        for v in range(0, len(mesh.vertices)):
            alreadySavedVertices.append(False)
            vertices_Normals.append([])
            vertices_UVs.append([])
            vertices_UV2s.append([])
            vertices_Colors.append([])
            vertices_indices.append([])
            vertices_sk_weights.append([])
            vertices_sk_indices.append([])

        materialsCount = 1 if recipe.needsBaking else max(1, len(object.material_slots))
        verticesCount = 0
        indicesCount = 0

        for materialIndex in range(materialsCount):
            if self.offsetFace != 0:
                break

            subMeshVerticesStart = verticesCount
            subMeshIndexStart = indicesCount

            for faceIndex in range(startFace, len(mesh.tessfaces)):  # For each face
                face = mesh.tessfaces[faceIndex]

                if face.material_index != materialIndex and not recipe.needsBaking:
                    continue

                if verticesCount + 3 > maxVerts:
                    self.offsetFace = faceIndex
                    break

                for v in range(3): # For each vertex in face
                    vertex_index = face.vertices[v]

                    vertex = mesh.vertices[vertex_index]
                    position = vertex.co

                    if not deferNormals:
                        normal = face.normal if self.useFlatShading else vertex.normal

                    #skeletons
                    if hasSkeleton:
                        matricesWeights = []
                        matricesIndices = []

                        # Getting influences
                        for group in vertex.groups:
                            index = group.group
                            weight = group.weight

                            for bone in objArmature.pose.bones:
                                if object.vertex_groups[index].name == bone.name:
                                    matricesWeights.append(weight)
                                    matricesIndices.append(self.skeleton.get_index_of_bone(bone.name))

                    # Texture coordinates
                    if hasUV:
                        vertex_UV = UVmap[face.index].uv[v]

                    if hasUV2:
                        vertex_UV2 = UV2map[face.index].uv[v]

                    # Vertex color
                    if hasVertexColor:
                        if v == 0:
                            vertex_Color = Colormap[face.index].color1
                        if v == 1:
                            vertex_Color = Colormap[face.index].color2
                        if v == 2:
                            vertex_Color = Colormap[face.index].color3

                    # Check if the current vertex is already saved
                    alreadySaved = alreadySavedVertices[vertex_index] and not self.useFlatShading
                    if alreadySaved:
                        alreadySaved = False

                        # UV
                        index_UV = 0
                        for savedIndex in vertices_indices[vertex_index]:
                            if not deferNormals:
                                vNormal = vertices_Normals[vertex_index][index_UV]
                                if not same_vertex(normal, vNormal):
                                    continue;

                            if hasUV:
                                vUV = vertices_UVs[vertex_index][index_UV]
                                if not same_array(vertex_UV, vUV):
                                    continue

                            if hasUV2:
                                vUV2 = vertices_UV2s[vertex_index][index_UV]
                                if not same_array(vertex_UV2, vUV2):
                                    continue

                            if hasVertexColor:
                                vColor = vertices_Colors[vertex_index][index_UV]
                                if vColor.r != vertex_Color.r or vColor.g != vertex_Color.g or vColor.b != vertex_Color.b:
                                    continue

                            if hasSkeleton:
                                vSkWeight = vertices_sk_weights[vertex_index]
                                vSkIndices = vertices_sk_indices[vertex_index]
                                if not same_array(vSkWeight[index_UV], matricesWeights) or not same_array(vSkIndices[index_UV], matricesIndices):
                                    continue

                            if vertices_indices[vertex_index][index_UV] >= subMeshVerticesStart:
                                alreadySaved = True
                                break

                            index_UV += 1

                    if (alreadySaved):
                        # Reuse vertex
                        index = vertices_indices[vertex_index][index_UV]
                    else:
                        # Export new one
                        index = verticesCount
                        alreadySavedVertices[vertex_index] = True

                        if not deferNormals:
                            vertices_Normals[vertex_index].append(normal)
                            self.normals.append(normal)

                        if hasUV:
                            vertices_UVs[vertex_index].append(vertex_UV)
                            self.uvs.append(vertex_UV[0])
                            self.uvs.append(vertex_UV[1])
                        if hasUV2:
                            vertices_UV2s[vertex_index].append(vertex_UV2)
                            self.uvs2.append(vertex_UV2[0])
                            self.uvs2.append(vertex_UV2[1])
                        if hasVertexColor:
                            vertices_Colors[vertex_index].append(vertex_Color)
                            self.colors.append(vertex_Color.r)
                            self.colors.append(vertex_Color.g)
                            self.colors.append(vertex_Color.b)
                            self.colors.append(1.0)
                        if hasSkeleton:
                            vertices_sk_weights[vertex_index].append(matricesWeights)
                            vertices_sk_indices[vertex_index].append(matricesIndices)
                            nInfluencers = len(matricesWeights)
                            totalInfluencers += nInfluencers
                            if nInfluencers <= 8:
                                influenceCounts[nInfluencers] += 1
                            else:
                                influenceCounts[0] += 1
                            highestInfluenceObserved = nInfluencers if nInfluencers > highestInfluenceObserved else highestInfluenceObserved
                            weightsPerVertex.append(matricesWeights)
                            indicesPerVertex.append(matricesIndices)

                        if hasShapeKeys:
                            keyOrderMap.append([vertex_index, len(self.positions)]) # use len positions before it is append to convert from 1 to 0 origin

                        vertices_indices[vertex_index].append(index)

                        self.positions.append(position)

                        verticesCount += 1
                    self.indices.append(index)
                    indicesCount += 1

            self.subMeshes.append(SubMesh(materialIndex, subMeshVerticesStart, subMeshIndexStart, verticesCount - subMeshVerticesStart, indicesCount - subMeshIndexStart))

        if verticesCount > MAX_VERTEX_ELEMENTS:
            Logger.warn('Due to multi-materials, Shapekeys, or exporter settings & this meshes size, 32bit indices must be used.  This may not run on all hardware.', 2)

        BakedMaterial.meshBakingClean(object)

        Logger.log('num positions      :  ' + str(len(self.positions)), 2)
        Logger.log('num normals        :  ' + str(len(self.normals  )), 2)
        Logger.log('num uvs            :  ' + str(len(self.uvs      )), 2)
        Logger.log('num uvs2           :  ' + str(len(self.uvs2     )), 2)
        Logger.log('num colors         :  ' + str(len(self.colors   )), 2)
        Logger.log('num indices        :  ' + str(len(self.indices  )), 2)

        if hasSkeleton:
            Logger.log('Skeleton stats:  ', 2)
            self.toFixedInfluencers(weightsPerVertex, indicesPerVertex, object.data.maxInfluencers, highestInfluenceObserved)

            if (COMPRESS_MATRIX_INDICES):
                self.skeletonIndices = Mesh.packSkeletonIndices(self.skeletonIndices)
                if (self.numBoneInfluencers > 4):
                    self.skeletonIndicesExtra = Mesh.packSkeletonIndices(self.skeletonIndicesExtra)

            Logger.log('Total Influencers:  ' + format_f(totalInfluencers), 3)
            Logger.log('Avg # of influencers per vertex:  ' + format_f(totalInfluencers / len(self.positions)), 3)
            Logger.log('Highest # of influencers observed:  ' + str(highestInfluenceObserved) + ', num vertices with this:  ' + format_int(influenceCounts[highestInfluenceObserved if highestInfluenceObserved < 9 else 0]), 3)
            Logger.log('exported as ' + str(self.numBoneInfluencers) + ' influencers', 3)
            nWeights = len(self.skeletonWeights) + (len(self.skeletonWeightsExtra) if hasattr(self, 'skeletonWeightsExtra') else 0)
            Logger.log('num skeletonWeights and skeletonIndices:  ' + str(nWeights), 3)

        numZeroAreaFaces = self.find_zero_area_faces()
        if numZeroAreaFaces > 0:
            Logger.warn('# of 0 area faces found:  ' + str(numZeroAreaFaces), 2)

        # shape keys for mesh
        if hasShapeKeys:
            Mesh.sort(keyOrderMap)
            self.rawShapeKeys = []
            groupNames = []
            Logger.log('Shape Keys:', 2)

            # process the keys in the .blend
            for block in object.data.shape_keys.key_blocks:
                # perform name format validation, before processing
                keyName = block.name

                # the Basis shape key is a member of all groups, processed in 2nd pass
                if keyName == 'Basis': continue

                if keyName.find('-') <= 0 and SHAPE_KEY_GROUPS_ALLOWED:
                    if object.data.defaultShapeKeyGroup != DEFAULT_SHAPE_KEY_GROUP:
                        keyName = object.data.defaultShapeKeyGroup + '-' + keyName
                    else: continue

                group = None
                state = keyName
                if SHAPE_KEY_GROUPS_ALLOWED:
                    temp = keyName.upper().partition('-')
                    group = temp[0]
                    state = temp[2]
                self.rawShapeKeys.append(RawShapeKey(block, group, state, keyOrderMap, basis))

                if SHAPE_KEY_GROUPS_ALLOWED:
                    # check for a new group, add to groupNames if so
                    newGroup = True
                    for group in groupNames:
                        if temp[0] == group:
                            newGroup = False
                            break
                    if newGroup:
                       groupNames.append(temp[0])

            # process into ShapeKeyGroups, when rawShapeKeys found and groups allowed (implied)
            if len(groupNames) > 0:
                self.shapeKeyGroups = []
                basis = RawShapeKey(basis, None, 'BASIS', keyOrderMap, basis)
                for group in groupNames:
                    self.shapeKeyGroups.append(ShapeKeyGroup(group,self.rawShapeKeys, basis.vertices))
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def setFactoryIdx(self, factoryIdx):
        self.factoryIdx = factoryIdx
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def find_zero_area_faces(self):
        nFaces = int(len(self.indices) / 3)
        nZeroAreaFaces = 0
        for f in range(nFaces):
            faceOffset = f * 3
            p1 = self.positions[self.indices[faceOffset    ]]
            p2 = self.positions[self.indices[faceOffset + 1]]
            p3 = self.positions[self.indices[faceOffset + 2]]

            if same_vertex(p1, p2) or same_vertex(p1, p3) or same_vertex(p2, p3): nZeroAreaFaces += 1

        return nZeroAreaFaces
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    @staticmethod
    # ShapeKeyGroup depends on AffectedIndices being in asending order, so sort it, probably nothing to do
    def sort(keyOrderMap):
        notSorted = True
        while(notSorted):
            notSorted = False
            for idx in range(1, len(keyOrderMap)):
                if keyOrderMap[idx - 1][1] > keyOrderMap[idx][1]:
                    tmp = keyOrderMap[idx]
                    keyOrderMap[idx    ] = keyOrderMap[idx - 1]
                    keyOrderMap[idx - 1] = tmp
                    notSorted = True
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    @staticmethod
    def mesh_triangulate(mesh):
        try:
            import bmesh
            bm = bmesh.new()
            bm.from_mesh(mesh)
            bmesh.ops.triangulate(bm, faces = bm.faces)
            bm.to_mesh(mesh)
            mesh.calc_tessface()
            bm.free()
        except:
            pass
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def toFixedInfluencers(self, weightsPerVertex, indicesPerVertex, maxInfluencers, highestObserved):
        if (maxInfluencers > 8 or maxInfluencers < 1):
            maxInfluencers = 8
            Logger.warn('Maximum # of influencers invalid, set to 8', 3)

        self.numBoneInfluencers = maxInfluencers if maxInfluencers < highestObserved else highestObserved
        needExtras = self.numBoneInfluencers > 4

        maxInfluencersExceeded = 0

        fixedWeights = []
        fixedIndices = []

        fixedWeightsExtra = []
        fixedIndicesExtra = []

        for i in range(len(weightsPerVertex)):
            weights = weightsPerVertex[i]
            indices = indicesPerVertex[i]
            nInfluencers = len(weights)

            if (nInfluencers > self.numBoneInfluencers):
                maxInfluencersExceeded += 1
                Mesh.sortByDescendingInfluence(weights, indices)

            for j in range(4):
                fixedWeights.append(weights[j] if nInfluencers > j else 0.0)
                fixedIndices.append(indices[j] if nInfluencers > j else 0  )

            if needExtras:
                for j in range(4, 8):
                    fixedWeightsExtra.append(weights[j] if nInfluencers > j else 0.0)
                    fixedIndicesExtra.append(indices[j] if nInfluencers > j else 0  )

        self.skeletonWeights = fixedWeights
        self.skeletonIndices = fixedIndices

        if needExtras:
            self.skeletonWeightsExtra = fixedWeightsExtra
            self.skeletonIndicesExtra = fixedIndicesExtra

        if maxInfluencersExceeded > 0:
            Logger.warn('Maximum # of influencers exceeded for ' + format_int(maxInfluencersExceeded) + ' vertices, extras ignored', 3)
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    # sorts one set of weights & indices by descending weight, by reference
    # not shown to help with MakeHuman, but did not hurt.  In just so it is not lost for future.
    @staticmethod
    def sortByDescendingInfluence(weights, indices):
        notSorted = True
        while(notSorted):
            notSorted = False
            for idx in range(1, len(weights)):
                if weights[idx - 1] < weights[idx]:
                    tmp = weights[idx]
                    weights[idx    ] = weights[idx - 1]
                    weights[idx - 1] = tmp

                    tmp = indices[idx]
                    indices[idx    ] = indices[idx - 1]
                    indices[idx - 1] = tmp

                    notSorted = True
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    # assume that toFixedInfluencers has already run, which ensures indices length is a multiple of 4
    @staticmethod
    def packSkeletonIndices(indices):
        compressedIndices = []

        for i in range(math.floor(len(indices) / 4)):
            idx = i * 4
            matricesIndicesCompressed  = indices[idx    ]
            matricesIndicesCompressed += indices[idx + 1] <<  8
            matricesIndicesCompressed += indices[idx + 2] << 16
            matricesIndicesCompressed += indices[idx + 3] << 24

            compressedIndices.append(matricesIndicesCompressed)

        return compressedIndices
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def to_script_file(self, file_handler, typescript_file_handler, kids, indent, exporter):
        isRootMesh = not hasattr(self, 'parentId')

        baseClass = mesh_node_common_script(file_handler, typescript_file_handler, self, isRootMesh, kids, indent, exporter.logInBrowserConsole)

        hasShapeKeys = hasattr(self, 'shapeKeyGroups')
        var = 'this' if isRootMesh else 'ret'
        indent2 = indent + ('        ' if isRootMesh else '    ')

        # flag for onTexturesLoaded(), to be sure constructor is done before doing GrandEntrance prematurely; causes sound to play too early
        file_handler.write(indent2 + var + '.initComplete = false;\n')
        
        # section that is not done for clones
        file_handler.write(indent2 + 'if (!cloning){\n')
        indent2A = indent2 + '    '
        indent3A = indent2A + '    '
        if exporter.logInBrowserConsole:
            file_handler.write(indent2A + 'geo = _B.Tools.Now;\n')
        file_handler.write(indent2A + var + '.setVerticesData(_B.VertexBuffer.PositionKind, new Float32Array([\n')
        file_handler.write(indent3A + format_vector_array(self.positions, indent3A) + '\n')
        file_handler.write(indent2A + ']),\n')
        file_handler.write(indent2A + format_bool(hasShapeKeys) + ');\n\n')

        file_handler.write(indent2A + 'var _i;//indices & affected indices for shapekeys\n')
        writeIndexArray(file_handler, '_i', indent2A, self.indices, False)
        file_handler.write(indent2A + var + '.setIndices(_i);\n\n')

        if len(self.normals) > 0:
            file_handler.write(indent2A + var + '.setVerticesData(_B.VertexBuffer.NormalKind, new Float32Array([\n')
            file_handler.write(indent3A + format_vector_array(self.normals, indent3A) + '\n')
            file_handler.write(indent2A + ']),\n')
            file_handler.write(indent2A + format_bool(hasShapeKeys) + ');\n\n')
        else:
            if self.useFlatShading:
                file_handler.write(indent2A + var + '.convertToFlatShadedMesh();\n')
            else:
                file_handler.write(indent2A + 'var positions = ' + var + '.getVerticesData(_B.VertexBuffer.PositionKind);\n')
                file_handler.write(indent2A + 'var indices   = ' + var + '.getIndices();\n')
                file_handler.write(indent2A + 'var normals   = new Float32Array(' + format_int(len(self.positions) * 3) + ');\n')
                file_handler.write(indent2A + '_B.VertexData.ComputeNormals(positions, indices, normals);\n')
                file_handler.write(indent2A + var + '.setVerticesData(_B.VertexBuffer.NormalKind, normals,' + format_bool(hasShapeKeys) + ');\n\n')

        if len(self.uvs) > 0:
            file_handler.write(indent2A + var + '.setVerticesData(_B.VertexBuffer.UVKind, new Float32Array([\n')
            file_handler.write(indent3A + format_array(self.uvs, indent3A) + '\n')
            file_handler.write(indent2A + ']),\n')
            file_handler.write(indent2A + 'false);\n\n')

        if len(self.uvs2) > 0:
            file_handler.write(indent2A + var + '.setVerticesData(_B.VertexBuffer.UV2Kind, new Float32Array([\n')
            file_handler.write(indent3A + format_array(self.uvs2, indent3A) + '\n')
            file_handler.write(indent2A + ']),\n')
            file_handler.write(indent2A + 'false);\n\n')

        if len(self.colors) > 0:
            file_handler.write(indent2A + var + '.setVerticesData(_B.VertexBuffer.ColorKind, new Float32Array([\n')
            file_handler.write(indent3A + format_array(self.colors, indent3A) + '\n')
            file_handler.write(indent2A + ']),\n')
            file_handler.write(indent2A + 'false);\n\n')

        if hasattr(self, 'skeletonWeights'):
            writeRepeatableArray(file_handler, '_i', indent2A, self.skeletonWeights, 'Float32Array', False)
            file_handler.write(indent2A + var + '.setVerticesData(_B.VertexBuffer.MatricesWeightsKind, _i, false);\n\n')

            writeRepeatableArray(file_handler, '_i', indent2A, self.skeletonIndices, 'Uint32Array', False)
            file_handler.write(indent2A + var + '.setVerticesData(_B.VertexBuffer.MatricesIndicesKind, UNPACK(_i), false);\n\n') # UNPACK defined in package_level

        if hasattr(self, 'skeletonWeightsExtra'):
            writeRepeatableArray(file_handler, '_i', indent2A, self.skeletonWeightsExtra, 'Float32Array', False)
            file_handler.write(indent2A + var + '.setVerticesData(_B.VertexBuffer.MatricesWeightsExtraKind, _i, false);\n\n')

            writeRepeatableArray(file_handler, '_i', indent2A, self.skeletonIndicesExtra, 'Uint32Array', False)
            file_handler.write(indent2A + var + '.setVerticesData(_B.VertexBuffer.MatricesIndicesExtraKind, UNPACK(_i), false);\n\n') # UNPACK defined in package_level

        if exporter.logInBrowserConsole:
            file_handler.write(indent2A + 'geo = (_B.Tools.Now - geo) / 1000;\n')

        if hasattr(self, 'materialId'): file_handler.write(indent2A + var + '.setMaterialByID("' + self.materialId + '");\n')
        # this can be in core, since submesh is same for both JS & TS
        file_handler.write(indent2A + var + '.subMeshes = [];\n')
        for subMesh in self.subMeshes:
            subMesh.to_script_file(file_handler, var, indent2A)

        # only set when not default for a QI.Mesh; child QI.Meshes do not need & BABYLON.Meshes do not have (a BABYLON.Mesh can have a grandEntrance() though)
        # done after geo code, since FireMaterial for FireGrandEntrance needs UV
        if self.needEntrance:
            file_handler.write(indent2 + var + '.entranceMethod = new ' + self.entranceClass + '(this, ' + self.entranceDur)
            # sound is optional so check before writing
            if len(self.entranceSnd) > 0:
                file_handler.write(', ' + self.entranceSnd)
                file_handler.write(', ' + format_bool(self.disposeSound))
            file_handler.write(');\n')

        # Octree, cannot predetermine since something in scene; break down and write an if
        file_handler.write(indent2A + 'if (scene._selectionOctree) {\n')
        file_handler.write(indent3A + 'scene.createOrUpdateSelectionOctree();\n')
        file_handler.write(indent2A + '}\n')

        if (hasShapeKeys):
            if exporter.logInBrowserConsole:
                file_handler.write(indent2A + 'shape = _B.Tools.Now;\n')
            file_handler.write(indent2A + 'var shapeKeyGroup;\n')
            for shapeKeyGroup in self.shapeKeyGroups:
                shapeKeyGroup.to_script_file(file_handler, var, indent2A) # assigns the previously declared js variable 'shapeKeyGroup'
                file_handler.write(indent2A + var + '.addShapeKeyGroup(shapeKeyGroup);\n\n')
            if exporter.logInBrowserConsole:
                file_handler.write(indent2A + 'shape = (_B.Tools.Now - shape) / 1000;\n')

        super().to_script_file(file_handler, var, indent2A) # Animations

        # close no cloning section
        file_handler.write(indent2 + '}\n')
        
        # geo needs to be defined before physics imposter
        writeImposter(file_handler, self, var, indent2)

        # add hook for postConstruction(), if found in super class
        file_handler.write(indent2 + 'if (this.postConstruction) this.postConstruction();\n')
        
        # flag for onTexturesLoaded(), to be sure constructor is done before doing GrandEntrance prematurely; causes sound to play too early
        file_handler.write(indent2 + var + '.initComplete = true;\n')
        
        if exporter.logInBrowserConsole:
            file_handler.write(indent2 + 'load = (_B.Tools.Now - load) / 1000;\n')
            file_handler.write(indent2 + '_B.Tools.Log("defined mesh: " + ' + var + '.name + (cloning ? " (cloned)" : "") + " completed:  " + load.toFixed(2) + ", geometry:  " + geo.toFixed(2) + ", skey:  " + shape.toFixed(2) + " secs");\n')

        if self.isVisible and isRootMesh:
            # meshes shot at doing grand entrance, when no initScene, and materials / texture retrieved before constructor complete
            file_handler.write(indent2 + 'if (matLoaded && !_sceneTransitionName){\n')
            file_handler.write(indent2 + '    if (typeof ' + var + '.grandEntrance == "function") ' + var + '.grandEntrance();\n')
            file_handler.write(indent2 + '    else makeVisible(' + var + ');\n\n')
            file_handler.write(indent2 + '} else waitingMeshes.push(' + var + ');\n')

        # end of constructor; other methods for root mesh, or return for child meshes
        if isRootMesh:
            file_handler.write(indent + '    }\n')

            file_handler.write('\n')
            file_handler.write(indent + '    ' + self.legalName + '.prototype.dispose = function (doNotRecurse) {\n')
            file_handler.write(indent + '        _super.prototype.dispose.call(this, doNotRecurse);\n')
            file_handler.write(indent + '        if (this.skeleton) this.skeleton.dispose();\n')
            if hasattr(self,'factoryIdx'):
                file_handler.write(indent + '        clean(' + str(self.factoryIdx) + ');\n')
            file_handler.write(indent + '    };\n')

            # instances handled as a separate function when a root mesh
            if len(self.instances) > 0:
                file_handler.write('\n')
                file_handler.write(indent + '    ' + self.legalName + '.prototype.makeInstances = function (positionOffset) {\n')
                self.writeMakeInstances(file_handler, var, indent + '        ')
                file_handler.write(indent + '    };\n')

            file_handler.write(indent + '    return ' + self.legalName + ';\n')
            file_handler.write(indent + '})(' + baseClass + ');\n')
            file_handler.write(indent + exporter.nameSpace + '.' + self.legalName + ' = ' + self.legalName + ';\n')
        else:
            # instances handled as inline code when a child mesh
            if len(self.instances) > 0:
                self.writeMakeInstances(file_handler, var, indent + '    ')
            file_handler.write(indent + '    return ret;\n')
            file_handler.write(indent + '}\n')
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def writeMakeInstances(self, file_handler, var, indent):
        file_handler.write(indent + 'var instance;\n')
        for instance in self.instances:
            file_handler.write(indent + 'instance =  ' + var + '.createInstance("' + instance.name + '");\n')
            writePosRotScale(file_handler, instance, 'instance', indent)
            writeImposter(file_handler, instance, 'instance', indent, True)
            file_handler.write(indent + 'if (positionOffset) instance.position.addInPlace(positionOffset);\n')
            file_handler.write(indent + 'instance.checkCollisions = ' + format_bool(self.checkCollisions) + ';\n')
            if self.animationsPresent:
                for idx in range(0, len(self.animations)):
                    file_handler.write(indent + 'instance.animations.push(' + var + '.animations[' + format_int(idx) + '].clone() );\n')
#===============================================================================
#  module level since called from Mesh & Node
def mesh_node_common_script(file_handler, typescript_file_handler, meshOrNode, isRoot, kids, indent, logInBrowserConsole):
    isRootMesh = not hasattr(meshOrNode, 'parentId')
    baseClass = get_base_class(meshOrNode)
    var = ''
    indent2 = ''
    if isRootMesh:
        var = 'this'
        indent2 = indent + '        '

        # declaration of class & member kids
        typescript_file_handler.write('\n' + indent + 'class ' + meshOrNode.legalName + ' extends ' + baseClass + ' {\n')
        for kid in kids:
            typescript_file_handler.write(indent + '    public ' + kid.legalName + ' : ' + get_base_class(kid) + ';\n')

        typescript_file_handler.write(indent + '    constructor(name: string, scene: BABYLON.Scene, materialsRootDir: string = "./", source? : ' + meshOrNode.legalName + ');\n')

        # define makeInstances, a node will not have this
        if isRootMesh and hasattr(meshOrNode, 'instances') and len(meshOrNode.instances) > 0:
            typescript_file_handler.write(indent + '    makeInstances(): void ;\n')
        typescript_file_handler.write(indent + '}\n')
        # - - - - - - - - - - -
        file_handler.write('\n' + indent + 'var ' + meshOrNode.legalName + ' = (function (_super) {\n')
        file_handler.write(indent + '    __extends(' + meshOrNode.legalName + ', _super);\n')
        file_handler.write(indent + '    function ' + meshOrNode.legalName + '(name, scene, materialsRootDir, source) {\n')
        file_handler.write(indent2 + '_super.call(this, name, scene, null, source, true);\n\n')

        file_handler.write(indent2 + 'if (!materialsRootDir) { materialsRootDir = "./"; }\n')

        file_handler.write(indent2 + 'defineMaterials(scene, materialsRootDir); //embedded version check\n')

    else:
        var = 'ret'
        indent2 = indent + '    '
        file_handler.write('\n' + indent + 'function child_' + meshOrNode.legalName + '(scene, parent, source){\n')
        file_handler.write(indent2 + 'var ' + var + ' = new ' + baseClass + '(parent.name + ".' + meshOrNode.legalName + '", scene, parent, source);\n')

    file_handler.write(indent2 + "var cloning = source && source !== null;\n")

    if logInBrowserConsole:
        file_handler.write(indent2 + 'var load = _B.Tools.Now;\n')
        file_handler.write(indent2 + 'var geo = 0;\n')
        file_handler.write(indent2 + 'var shape = 0;\n')

    writePosRotScale(file_handler, meshOrNode, var, indent2)

    # Geometry, prior to kids, so can set to parent's (node cannot have skeletons)
    if hasattr(meshOrNode, 'skeleton'):
        if isRootMesh:
            file_handler.write(indent2 + var + '.skeleton = ' + meshOrNode.skeleton.functionName + '(name, scene);\n')
        else:
            file_handler.write(indent2 + var + '.skeleton = parent.skeleton;\n')

        file_handler.write(indent2 + var + '.numBoneInfluencers = ' + format_int(meshOrNode.numBoneInfluencers) + ';\n\n')

    # not part of root mesh test to allow for nested parenting
    for kid in kids:
        nm = kid.legalName
        func = 'child_' + nm
        file_handler.write(indent2 + var + '.' + nm + ' = cloning ? ' + func + '(scene, ' + var + ', source.' + nm +') : ' + func + '(scene, ' + var + ');\n')
    file_handler.write('\n')

    file_handler.write(indent2 + var + '.id = ' + var + '.name;\n')
    file_handler.write(indent2 + var + '.billboardMode  = ' + format_int(meshOrNode.billboardMode) + ';\n')
    file_handler.write(indent2 + var + '.isVisible  = false; //always false; evaluated again at bottom\n')
    file_handler.write(indent2 + var + '.setEnabled(' + format_bool(meshOrNode.isEnabled) + ');\n')
    file_handler.write(indent2 + var + '.checkCollisions = ' + format_bool(meshOrNode.checkCollisions) + ';\n')
    file_handler.write(indent2 + var + '.receiveShadows  = ' + format_bool(meshOrNode.receiveShadows) + ';\n')
    file_handler.write(indent2 + var + '.castShadows  = ' + format_bool(meshOrNode.castShadows) + ';\n')

    return baseClass
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
#  module level since called from Mesh & Node, and also for instances
def writePosRotScale(file_handler, object, var, indent):
    # these need to be written prior to freezing
    # this also needs to be called in parent, prior to children instancing, so freeze works for them too
    # remember switching y with z at the same time
    file_handler.write(indent + var + '.position.x  = ' + format_f(object.position.x) + ';\n')
    file_handler.write(indent + var + '.position.y  = ' + format_f(object.position.z) + ';\n')
    file_handler.write(indent + var + '.position.z  = ' + format_f(object.position.y) + ';\n')
    if hasattr(object, 'rotation'):
        file_handler.write(indent + var + '.rotation.x  = ' + format_f(object.rotation.x) + ';\n')
        file_handler.write(indent + var + '.rotation.y  = ' + format_f(object.rotation.z) + ';\n')
        file_handler.write(indent + var + '.rotation.z  = ' + format_f(object.rotation.y) + ';\n')
    else:
        file_handler.write(indent + var + '.rotationQuaternion  = new _B.Quaternion(' + format_quaternion(object.rotationQuaternion) + ');\n')
    file_handler.write(indent + var + '.scaling.x   = ' + format_f(object.scaling.x) + ';\n')
    file_handler.write(indent + var + '.scaling.y   = ' + format_f(object.scaling.z) + ';\n')
    file_handler.write(indent + var + '.scaling.z   = ' + format_f(object.scaling.y) + ';\n')

    # need to check if present, since Node has no freezeWorldMatrix
    if hasattr(object, 'freezeWorldMatrix') and object.freezeWorldMatrix:
        file_handler.write(indent + var + '.freezeWorldMatrix();\n')
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
def writeImposter(file_handler, object, var, indent, isInstance = False):
    if hasattr(object, 'physicsImpostor'):
        if not isInstance:
            file_handler.write(indent + 'if (!scene.isPhysicsEnabled()) {\n')
            file_handler.write(indent + '\tscene.enablePhysics();\n')
            file_handler.write(indent + '}\n')
        file_handler.write(indent + var + '.physicsImpostor = new _B.PhysicsImpostor(' + var + ', ' +
                                                                                           format_int(object.physicsImpostor) + 
                                                                                        ', { mass: '      + format_f(object.physicsMass) +
                                                                                        ', friction: '    + format_f(object.physicsFriction) +
                                                                                        ', restitution: ' + format_f(object.physicsRestitution) + '}, scene);\n\n')
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
def get_base_class(meshOrNode):
     # do not abbreviate to '_B' for BABYLON, since will also be written to .d.ts
    if hasattr(meshOrNode, 'isNode'): return 'BABYLON.Mesh'

    if len(meshOrNode.userSuppliedBaseClass) > 0: return meshOrNode.userSuppliedBaseClass
    else: return 'QI.Mesh' if hasattr(meshOrNode, 'shapeKeyGroups') or hasattr(meshOrNode, 'skeletonWeights') or meshOrNode.needEntrance else 'BABYLON.Mesh'
#===============================================================================
class MeshInstance:
     def __init__(self, instancedMesh, rotation, rotationQuaternion):
        self.name = instancedMesh.name
        if hasattr(instancedMesh, 'parentId'): self.parentId = instancedMesh.parentId
        self.position = instancedMesh.position
        if rotation is not None:
            self.rotation = rotation
        if rotationQuaternion is not None:
            self.rotationQuaternion = rotationQuaternion
        self.scaling = instancedMesh.scaling
        self.freezeWorldMatrix = instancedMesh.freezeWorldMatrix
        
        if hasattr(instancedMesh, 'physicsImpostor'):
            self.physicsImpostor = instancedMesh.physicsImpostor
            self.physicsMass = instancedMesh.physicsMass
            self.physicsFriction = instancedMesh.physicsFriction
            self.physicsRestitution = instancedMesh.physicsRestitution
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
     def to_scene_file(self, file_handler):
        file_handler.write('{')
        write_string(file_handler, 'name', self.name, True)
        if hasattr(self, 'parentId'): write_string(file_handler, 'parentId', self.parentId)
        write_vector(file_handler, 'position', self.position)
        if hasattr(self, 'rotation'):
            write_vector(file_handler, 'rotation', self.rotation)
        else:
            write_quaternion(file_handler, 'rotationQuaternion', self.rotationQuaternion)

        write_vector(file_handler, 'scaling', self.scaling)
        # freeze World Matrix currently ignored for instances
        write_bool(file_handler, 'freezeWorldMatrix', self.freezeWorldMatrix)

        if hasattr(self, 'physicsImpostor'):
            write_int(file_handler, 'physicsImpostor', self.physicsImpostor)
            write_float(file_handler, 'physicsMass', self.physicsMass)
            write_float(file_handler, 'physicsFriction', self.physicsFriction)
            write_float(file_handler, 'physicsRestitution', self.physicsRestitution)
            
        file_handler.write('}')
#===============================================================================
class Node(FCurveAnimatable):
    def __init__(self, node, includeMeshFactory):
        Logger.log('processing begun of node:  ' + node.name)
        self.define_animations(node, True, True, True)  #Should animations be done when forcedParent
        self.name = node.name
        self.isNode = True # used in meshFactory, mesh_node_common_script()  & get_base_class()

        # Tower of Babel specific member
        self.legalName = legal_js_identifier(self.name)
        if (len(self.legalName) == 0):
            self.legalName = 'Unknown' + str(exporter.nNonLegalNames)
            exporter.nNonLegalNames = exporter.nNonLegalNames + 1

        if node.parent and node.parent.type != 'ARMATURE':
            self.parentId = node.parent.name

        loc, rot, scale = node.matrix_local.decompose()

        self.position = loc if not includeMeshFactory else Vector((0, 0, 0))
        if node.rotation_mode == 'QUATERNION':
            self.rotationQuaternion = rot
        else:
            self.rotation = scale_vector(rot.to_euler('XYZ'), -1)
        self.scaling = scale
        self.isVisible = False # referenced only for .babylon
        self.isEnabled = True
        self.checkCollisions = False
        self.billboardMode = BILLBOARDMODE_NONE
        self.castShadows = False
        self.receiveShadows = False
        self.layer = -1 # nodes do not have layers attribute
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def setFactoryIdx(self, factoryIdx):
        self.factoryIdx = factoryIdx
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    # does not need exporter arg, but need same call signature as Mesh
    def to_script_file(self, file_handler, typescript_file_handler, kids, indent, exporter):
        isRootNode = not hasattr(self, 'parentId')
        mesh_node_common_script(file_handler, typescript_file_handler, self, isRootNode, kids, indent, exporter.logInBrowserConsole)

        if isRootNode:
            file_handler.write(indent + '    }\n')

            if hasattr(self,'factoryIdx'):
                file_handler.write('\n')
                file_handler.write(indent + '    ' + self.legalName + '.prototype.dispose = function (doNotRecurse) {\n')
                file_handler.write(indent + '        super.dispose(doNotRecurse);\n')
                file_handler.write(indent + '        clean(' + str(self.factoryIdx) + ');\n')
                file_handler.write(indent + '    };\n')

            file_handler.write(indent + '    return ' + self.legalName + ';\n')
            file_handler.write(indent + '})(_B.Mesh);\n')
            file_handler.write(indent + exporter.nameSpace + '.' + self.legalName + ' = ' + self.legalName + ';\n')
        else:
            file_handler.write(indent + '    return ret;\n')
            file_handler.write(indent + '}\n')
#===============================================================================
class SubMesh:
    def __init__(self, materialIndex, verticesStart, indexStart, verticesCount, indexCount):
        self.materialIndex = materialIndex
        self.verticesStart = verticesStart
        self.indexStart = indexStart
        self.verticesCount = verticesCount
        self.indexCount = indexCount
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def to_script_file(self, file_handler, jsMeshVar, indent):
        file_handler.write(indent + 'new _B.SubMesh(' +
                          format_int(self.materialIndex) + ', ' +
                          format_int(self.verticesStart) + ', ' +
                          format_int(self.verticesCount) + ', ' +
                          format_int(self.indexStart)    + ', ' +
                          format_int(self.indexCount)    + ', ' + jsMeshVar + ');\n')
#===============================================================================
bpy.types.Mesh.meshOrHair = bpy.props.EnumProperty(
    name='meshOrHair',
    items = (
             (TREAT_AS_MESH, "Mesh", "Exporter should process this as faces"),
             (TREAT_AS_HAIR, "Hair", "Exporter should process this as vertices")
        ),
    default = TREAT_AS_MESH
)
bpy.types.Mesh.autoAnimate = bpy.props.BoolProperty(
    name='Auto launch animations',
    description='',
    default = False
)
bpy.types.Mesh.baseClass = bpy.props.StringProperty(
    name='Base class',
    description='Explicitly specify base class, system determines if blank',
    default = ''
)
def changeEntrance(self, context):
    data = context.object.data
    if data.grandEntrance == JUST_MAKE_VISIBLE:
        data.entranceClass = ''
        data.entranceDur   = ''
        data.entranceSnd   = ''

    elif data.grandEntrance == GATHER:
        data.entranceClass = data.grandEntrance
        data.entranceDur   = GATHER_DUR
        data.entranceSnd   = WHOOSH_SND

    elif data.grandEntrance == EXPAND:
        data.entranceClass = data.grandEntrance
        data.entranceDur   = EXPAND_DUR
        data.entranceSnd   = WHOOSH_SND

    elif data.grandEntrance == FIRE:
        data.entranceClass = data.grandEntrance
        data.entranceDur   = FIRE_DUR
        data.entranceSnd   = WHOOSH_SND
        
    elif data.grandEntrance == TELEPORT:
        data.entranceClass = data.grandEntrance
        data.entranceDur   = TELEPORT_DUR
        data.entranceSnd   = TELEPORT_SND

    elif data.grandEntrance == POOF:
        data.entranceClass = data.grandEntrance
        data.entranceDur   = POOF_DUR
        data.entranceSnd   = WHOOSH_SND

    elif data.grandEntrance == CUSTOM:
        data.entranceClass = data.grandEntrance
        data.entranceDur   = CUSTOM_DUR
        data.entranceSnd   = WHOOSH_SND

bpy.types.Mesh.grandEntrance = bpy.props.EnumProperty(
    name='Type',
    description='This is the grand entrance to use (meshes without parent only).  Anything other than\n\'Just Make Visible\' will require a QI.Mesh base class, if specified.',
    items = (
             (JUST_MAKE_VISIBLE, 'Just Make Visible', 'Just make this and any child meshes visible at the same time'),
             (GATHER           , 'Gather'           , 'The reverse of an explosion'),
             (EXPAND           , 'Expand'           , 'Big bang from bounding box center'),
             (FIRE             , 'Fire'             , 'Arrive in fire ball'),
             (TELEPORT         , 'Teleport'         , 'Fade in surrounded by rings'),
             (POOF             , 'Poof'             , 'Appear in a puff of smoke'),
             (CUSTOM           , 'Custom'           , 'Use custom entrance class specified below')
            ),
    default = JUST_MAKE_VISIBLE,
    update=changeEntrance
)
bpy.types.Mesh.entranceClass = bpy.props.StringProperty(
    name='CLass Name',
    description='Fully qualified entrance class name.',
    default = ''
)
bpy.types.Mesh.entranceDur = bpy.props.StringProperty(
    name='Durations',
    description='An array of the durations of the various sections.',
    default = ''
)
bpy.types.Mesh.entranceSnd = bpy.props.StringProperty(
    name='Sound Effect',
    description='Code which returns a sound (can be empty).  You may\nmake reference to the variable "scene".',
    default = ''
)
bpy.types.Mesh.disposeSound = bpy.props.BoolProperty(
    name='Dispose Sound',
    description='When True, dispose the sound once played.  For multiple appearances, use False.',
    default = True
)
bpy.types.Mesh.useFlatShading = bpy.props.BoolProperty(
    name='Use Flat Shading',
    description='Use face normals.  Increases vertices.',
    default = False
)
bpy.types.Mesh.deferNormals = bpy.props.BoolProperty(
    name='Defer Normals',
    description='Calculate normals on load for reduced media size.\nIncompatable with Flat Shading & shape keys.',
    default = False
)
bpy.types.Mesh.checkCollisions = bpy.props.BoolProperty(
    name='Check Collisions',
    description='Indicates mesh should be checked that it does not run into anything.',
    default = False
)
bpy.types.Mesh.castShadows = bpy.props.BoolProperty(
    name='Cast Shadows',
    description='',
    default = False
)
bpy.types.Mesh.receiveShadows = bpy.props.BoolProperty(
    name='Receive Shadows',
    description='',
    default = False
)
# not currently in use
bpy.types.Mesh.forceBaking = bpy.props.BoolProperty(
    name='Combine Multi-textures / resize',
    description='Also good to adjust single texture\'s size /compression.',
    default = False
)
# not currently in use
bpy.types.Mesh.usePNG = bpy.props.BoolProperty(
    name='Need Alpha',
    description='Saved as PNG when alpha is required, else JPG.',
    default = False
)
bpy.types.Mesh.bakeSize = bpy.props.IntProperty(
    name='Texture Size',
    description='Final dimensions of texture(s).  Not required to be a power of 2, but recommended.',
    default = 1024
)
bpy.types.Mesh.bakeQuality = bpy.props.IntProperty(
    name='Quality 1-100',
    description='For JPG: The trade-off between Quality - File size(100 highest quality)\nFor PNG: amount of time spent for compression',
    default = 50, min = 1, max = 100
)
bpy.types.Mesh.materialNameSpace = bpy.props.StringProperty(
    name='Name Space',
    description='Prefix to use for materials for sharing across .blends.',
    default = DEFAULT_MATERIAL_NAMESPACE
)
bpy.types.Mesh.maxSimultaneousLights = bpy.props.IntProperty(
    name='Max Simultaneous Lights 0 - 32',
    description='BJS property set on each material of this mesh.\nSet higher for more complex lighting.\nSet lower for armatures on mobile',
    default = 4, min = 0, max = 32
)
bpy.types.Mesh.checkReadyOnlyOnce = bpy.props.BoolProperty(
    name='Check Ready Only Once',
    description='When checked better CPU utilization.  Advanced user option.',
    default = False
)
bpy.types.Mesh.freezeWorldMatrix = bpy.props.BoolProperty(
    name='Freeze World Matrix',
    description='Indicate the position, rotation, & scale do not change for performance reasons',
    default = False
)
bpy.types.Mesh.loadDisabled = bpy.props.BoolProperty(
    name='Load Disabled',
    description='Indicate this mesh & children should not be active until enabled by code.',
    default = False
)
bpy.types.Mesh.attachedSound = bpy.props.StringProperty(
    name='Sound',
    description='',
    default = ''
)
bpy.types.Mesh.loopSound = bpy.props.BoolProperty(
    name='Loop sound',
    description='',
    default = True
)
bpy.types.Mesh.autoPlaySound = bpy.props.BoolProperty(
    name='Auto play sound',
    description='',
    default = True
)
bpy.types.Mesh.maxSoundDistance = bpy.props.FloatProperty(
    name='Max sound distance',
    description='',
    default = 100
)
bpy.types.Mesh.ignoreSkeleton = bpy.props.BoolProperty(
    name='Ignore',
    description='Do not export assignment to a skeleton',
    default = False
)
bpy.types.Mesh.maxInfluencers = bpy.props.IntProperty(
    name='Max bone Influencers / Vertex',
    description='When fewer than this are observed, the lower value is used.',
    default = 8, min = 1, max = 8
)
bpy.types.Mesh.ignoreShapeKeys = bpy.props.BoolProperty(
    name='Ignore',
    description='Do not export shapekeys if found',
    default = False
)
bpy.types.Mesh.defaultShapeKeyGroup = bpy.props.StringProperty(
    name='Default group',
    description='The shape key group name to export as when Shape key name is\nnot in the format:GROUP-KEY_NAME (upper case only)',
    default = DEFAULT_SHAPE_KEY_GROUP
)
bpy.types.Mesh.prefixDelimiter = bpy.props.StringProperty(
    name='restore delimiter',
    description='allow shapekeys of meshes to be restored ignoring anything prior to this character',
    default = ':'
)
#===============================================================================
class MeshPanel(bpy.types.Panel):
    bl_label = get_title()
    bl_space_type = 'PROPERTIES'
    bl_region_type = 'WINDOW'
    bl_context = 'data'
    
    @classmethod
    def poll(cls, context):
        ob = context.object
        return ob is not None and isinstance(ob.data, bpy.types.Mesh)

    def draw(self, context):
        ob = context.object
        layout = self.layout
        layout.prop(ob.data, 'meshOrHair', expand=True) 
        
        if ob.data.meshOrHair == TREAT_AS_MESH:       
            layout.prop(ob.data, 'baseClass')
            # - - - - - - - - - - - - - - - - - - - - - - - - -
            box = layout.box()
            box.label(text='Grand Entrance:')
            row = box.row()
            row.enabled = not ob.parent or not isinstance(ob.parent.data, bpy.types.Mesh)
            row.prop(ob.data, 'grandEntrance')
            row = box.row()
            row.enabled = (not ob.parent or not isinstance(ob.parent.data, bpy.types.Mesh)) and ob.data.grandEntrance and ob.data.grandEntrance == CUSTOM
            row.prop(ob.data, 'entranceClass')
            row = box.row()
            row.enabled = (not ob.parent or not isinstance(ob.parent.data, bpy.types.Mesh)) and ob.data.grandEntrance and ob.data.grandEntrance != JUST_MAKE_VISIBLE
            row.prop(ob.data, 'entranceDur')
            row = box.row()
            row.enabled = (not ob.parent or not isinstance(ob.parent.data, bpy.types.Mesh)) and ob.data.grandEntrance and ob.data.grandEntrance != JUST_MAKE_VISIBLE
            row.prop(ob.data, 'entranceSnd')
            row = box.row()
            row.enabled = (not ob.parent or not isinstance(ob.parent.data, bpy.types.Mesh)) and ob.data.grandEntrance and ob.data.grandEntrance != JUST_MAKE_VISIBLE
            row.prop(ob.data, 'disposeSound')
            # - - - - - - - - - - - - - - - - - - - - - - - - -
            row = layout.row()
            row.prop(ob.data, 'useFlatShading')
            row.prop(ob.data, 'deferNormals')
    
            row = layout.row()
            row.prop(ob.data, 'castShadows')
            row.prop(ob.data, 'receiveShadows')
    
            row = layout.row()
            row.prop(ob.data, 'freezeWorldMatrix')
            row.prop(ob.data, 'loadDisabled')
    
            row = layout.row()
            row.prop(ob.data, 'autoAnimate')
            row.prop(ob.data, 'checkCollisions')
            # - - - - - - - - - - - - - - - - - - - - - - - - -
            box = layout.box()
            box.label(text='Skeleton:')
            box.prop(ob.data, 'ignoreSkeleton')
            row = box.row()
            row.enabled = not ob.data.ignoreSkeleton
            row.prop(ob.data, 'maxInfluencers')
            # - - - - - - - - - - - - - - - - - - - - - - - - -
            box = layout.box()
            box.label(text='Shape Keys:')
            row = box.row()
            row.prop(ob.data, 'ignoreShapeKeys')
            row.prop(ob.data, 'prefixDelimiter')
    
            row = box.row()
            row.operator('tob.shape_keys_archive')
            row.operator('tob.shape_keys_restore')
    
            row = box.row()
            row.enabled = not ob.data.ignoreShapeKeys
            row.prop(ob.data, 'defaultShapeKeyGroup')
            # - - - - - - - - - - - - - - - - - - - - - - - - -
            box = layout.box()
            box.label('Materials')
            box.prop(ob.data, 'materialNameSpace')
            box.prop(ob.data, 'maxSimultaneousLights')
            box.prop(ob.data, 'checkReadyOnlyOnce')
    
            box = layout.box()
            box.label(text='Procedural Texture / Cycles Baking')
    #        box.prop(ob.data, 'forceBaking')
    #        box.prop(ob.data, 'usePNG')
            box.prop(ob.data, 'bakeSize')
            box.prop(ob.data, 'bakeQuality')
            # - - - - - - - - - - - - - - - - - - - - - - - - -
            box = layout.box()
            box.prop(ob.data, 'attachedSound')
            row = box.row()
            
            row.prop(ob.data, 'autoPlaySound')
            row.prop(ob.data, 'loopSound')
            box.prop(ob.data, 'maxSoundDistance')
        # - - - - - - - - - - - - - - - - - - - - - - - - -
        else:
            # types defined in particle_hair.py
            box = layout.box()
            box.label('Matrix Weights')
            box.prop(ob.data, 'headBone')
            box.prop(ob.data, 'spineBone')
            
            box = layout.box()
            box.label('Color')
            usingWheel = ob.data.stdColors == USE_BASE
            row = box.row()
            row.enabled = usingWheel
            row.prop(ob.data, 'baseColor')

            box.prop(ob.data, 'stdColors')
            box.prop(ob.data, 'interStrandColorSpread')
            box.prop(ob.data, 'intraStrandColorSpread')
            box.prop(ob.data, 'emissiveColorScaling')
