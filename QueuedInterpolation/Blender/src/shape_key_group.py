from .logger import *
from .package_level import *

import bpy
#===============================================================================
# extract data in Mesh order, no optimization from group analyse yet; mapped into a copy of position
class RawShapeKey:
    def __init__(self, keyBlock, group, state, keyOrderMap, basis):
        self.group = group
        self.state = state
        self.vertices = []

        retSz = len(keyOrderMap)
        for i in range(retSz):
            self.vertices.append(None)

        nDifferent = 0
        for i in range(retSz):
            pair = keyOrderMap[i]
            value = keyBlock.data[pair[0]].co
            self.vertices[pair[1]] = value
            if not same_vertex(value, basis.data[pair[0]].co):
                nDifferent += 1

        if state != 'BASIS':
            Logger.log('shape key "' + group + '-' + state + '":  n verts different from basis: ' + str(nDifferent), 3)
#===============================================================================
class ShapeKeyGroup:
    def __init__(self, group, rawShapeKeys, basisVerts):
        self.group = group
        self.stateNames = []
        self.stateVertices = []
        self.affectedIndices = []

        nRawKeys = len(rawShapeKeys)
        nSize = len(basisVerts)

        sameForAll = []
        for i in range(nSize):
            sameForAll.append(True)

        # first pass to determine which vertices are not the same across all members of a group & also Basis
        for i in range(nSize):
            for key in rawShapeKeys:
                # no need for more checking once 1 difference is found
                if not sameForAll[i]:
                    break;

                # skip key if not member of the current group being processed
                if group != key.group:
                    continue;

                # check vertex not different from Basis
                if not same_vertex(key.vertices[i],  basisVerts[i]):
                    sameForAll[i] = False
                    break;

        affectedWholeVertices = []

        # pass to convert sameForAll into self.affectedIndices, build 'BASIS' state at the same time
        for i in range(nSize):
            if not sameForAll[i]:
                affectedWholeVertices.append(i)
                self.affectedIndices.append(i * 3 + 0)
                self.affectedIndices.append(i * 3 + 1)
                self.affectedIndices.append(i * 3 + 2)

        Logger.log('Shape-key group, ' + group + ', # of affected vertices: '+ str(len(affectedWholeVertices)) + ', out of ' + str(nSize), 2)

        # pass to convert rawShapeKeys in this group, to stateVertices of only affected indices
        for key in rawShapeKeys:
            if group != key.group:
                continue;

            affectedVertices = []
            for idx in affectedWholeVertices:
                # clone vert, so key can be deleted in pass 1, and not affect pass2
                affectedVertices.append(key.vertices[idx].copy())

            self.stateNames.append(key.state)
            self.stateVertices.append(affectedVertices)
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def to_script_file(self, file_handler, var, indent):
        indent2 = indent + '    '
        file_handler.write(indent  + 'shapeKeyGroup = new QI.ShapeKeyGroup(' + var + ', "' + self.group + '", new Uint32Array([\n')
        file_handler.write(indent2 + format_array(self.affectedIndices, indent2) + '\n')
        file_handler.write(indent  + ']));\n')

        for state_idx in range(len(self.stateVertices)):
            file_handler.write(indent  + 'shapeKeyGroup._addShapeKey("' + self.stateNames[state_idx] + '", new Float32Array([\n')
            file_handler.write(indent2 + format_vector_array(self.stateVertices[state_idx], indent2) + '\n')
            file_handler.write(indent  + ']));\n')