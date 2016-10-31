from .package_level import *

import bpy
from json import load
from io import open
from mathutils import Vector
#===============================================================================
class ShapeKeyExporter:
    def execute(self, context, filepath):
        scene = context.scene

        selectedMeshes = getSelectedMeshes(scene)
        keyNames = ShapeKeyExporter.getDistinctKeyNames(selectedMeshes)

        file_handler = open(filepath, 'w', encoding='utf8')
        file_handler.write('{\n') # open file
        file_handler.write('"keys":[') # open keys
        first = True
        for keyName in keyNames:
            if first != True:
                file_handler.write(',')
            first = False

            file_handler.write('\n     {') # open key
            write_string(file_handler, 'name', keyName, True)
            file_handler.write(',"meshes":{') # open meshes
            ShapeKeyExporter.recordKey(file_handler, ShapeKeyExporter.getMeshesHavingKey(selectedMeshes, keyName), keyName)
            file_handler.write('\n          }') # close meshes
            file_handler.write('\n     }') # close key

        # Closing
        file_handler.write('\n]') # close keys
        file_handler.write('\n}') # close file
        file_handler.close()

        return None
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    @staticmethod
    def recordKey(file_handler, participatingMeshes, keyName):
        first = True
        for mesh in participatingMeshes:
            if first != True:
                file_handler.write(',')
            first = False

            file_handler.write('\n          "' + mesh.name + '":[')

            block = mesh.data.shape_keys.key_blocks[keyName]
            for idx, data in enumerate(block.data):
                if idx > 0: file_handler.write(',')
                file_handler.write('[' + format_vector_non_swapping(data.co) + ']')
            file_handler.write(']')
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    @staticmethod
    # assume meshes have shapekeys, so no test reqd
    def getDistinctKeyNames(meshes):
        keyNames = []
        for mesh in meshes:
            for block in mesh.data.shape_keys.key_blocks:
                if not ShapeKeyExporter.isFound(keyNames, block.name) and block.name != 'Basis':
                    keyNames.append(block.name)

        return keyNames
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    @staticmethod
    def getMeshesHavingKey(meshes, keyName):
        ret = []
        for mesh in meshes:
            if not mesh.data.shape_keys: continue
            for block in mesh.data.shape_keys.key_blocks:
                if block.name == keyName:
                    ret.append(mesh)
                    break

        return ret
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    @staticmethod
    def isFound(array, item):
        for i in array:
            if i == item: return True

        return False
#===============================================================================
class ShapeKeyImporter:
    def execute(self, context, filepath):
        scene = context.scene

        # used for building error return
        ret = ''

        self.selectedMeshes = getSelectedMeshes(scene)

        # find active mesh, to get the prefix delimiter to use
        mesh = context.object
        self.prefixDelimiter = mesh.data.prefixDelimiter

        with open(filepath, "rU") as file:
            key_data = load(file)

        for key in key_data["keys"]:
            keyName = key["name"]
            meshes = list(key["meshes"].items())
            print('importing key: ' + keyName)

            for meshOfKey, verts in meshes:
                target = self.getTargetMesh(meshOfKey)
                if target is None:
                    ret += '\nNo Target Mesh found for key: ' + keyName + ', source mesh: ' + meshOfKey
                    continue

                nVerts = len(verts)

                # make sure source & target have same # of verts
                if nVerts != len(target.data.vertices):
                    ret += '\nTarget Mesh found for key: ' + keyName + '(' + target.name + ') has ' + str(len(target.data.vertices)) + 'vert, while source had: ' + str(nVerts)
                    continue

                # make sure there is not already a key of that name on target
                if hasShape(target, keyName):
                    ret += '\nkey: ' + keyName + ' already exists on target source mesh: ' + target.name
                    continue

                print('\tadded target: ' + target.name)
                # ensure that there is a Basis key
                if not target.data.shape_keys:
                    target.shape_key_add('Basis')

                # add an empty key
                targetKey = target.shape_key_add(keyName)
                targetKey.value = 0

                # assign the key the vert values of the archive
                i = 0
                for vert in verts[:nVerts]:
                    targetKey.data[i].co = Vector((vert[0], vert[1], vert[2]))
                    i += 1

        return ret if len(ret) > 0 else None
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def getTargetMesh(self, meshOfKey):
        suffix = meshOfKey.partition(self.prefixDelimiter)[2]
        for mesh in self.selectedMeshes:
            if mesh.name.endswith(suffix):
                return mesh

        return None
#===============================================================================
def getSelectedMeshes(scene):
    meshes = []
    for object in [object for object in scene.objects]:
        if object.type == 'MESH' and object.select:
            meshes.append(object)

    print('num meshes selected ' + str(len(meshes)))
    return meshes
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
def getShapeIndex(mesh, shapeName):
    if not mesh.data.shape_keys:
        return -1

    for idx, key_block in enumerate(mesh.data.shape_keys.key_blocks):
        if key_block.name == shapeName:
            return idx

    return -1
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
def hasShape(mesh, shapeName):
    return getShapeIndex(mesh, shapeName) != -1
