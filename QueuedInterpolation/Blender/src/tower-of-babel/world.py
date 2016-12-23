from .logger import *
from .package_level import *

import bpy

# used in World constructor, defined in BABYLON.Scene
#FOGMODE_NONE = 0
#FOGMODE_EXP = 1
#FOGMODE_EXP2 = 2
FOGMODE_LINEAR = 3
#===============================================================================
class OptionalArgument:
    def __init__(self, argumentName, tsType = '', default = '""'):
        self.argumentName = argumentName
        self.tsType = tsType
        self.default = default
#===============================================================================
class World:
    def __init__(self, scene):
        self.autoClear = True
        world = scene.world
        if world:
            self.ambient_color = world.ambient_color
            self.clear_color   = world.horizon_color
        else:
            self.ambient_color = mathutils.Color((0.2, 0.2, 0.3))
            self.clear_color   = mathutils.Color((0.0, 0.0, 0.0))

        self.gravity = scene.gravity

        if world and world.mist_settings.use_mist:
            self.fogMode = FOGMODE_LINEAR
            self.fogColor = world.horizon_color
            self.fogStart = world.mist_settings.start
            self.fogEnd = world.mist_settings.depth
            self.fogDensity = 0.1

        Logger.log('Python World class constructor completed')
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def initScene_script(self, file_handler, typescript_file_handler, exporter):
        callArgs = []
        callArgs.append(OptionalArgument('resourcesRootDir', 'string', '"./"'))
        file_handler.write(exporter.define_module_method('initScene', '', callArgs))
        typescript_file_handler.write(exporter.define_Typescript_method('initScene', '', callArgs))

        indent = '        '
        file_handler.write(indent + 'scene.autoClear = ' + format_bool(self.autoClear) + ';\n')
        file_handler.write(indent + 'scene.clearColor    = new B.Color3(' + format_color(self.clear_color) + ');\n')
        file_handler.write(indent + 'scene.ambientColor  = new B.Color3(' + format_color(self.ambient_color) + ');\n')
        file_handler.write(indent + 'scene.gravity = new B.Vector3(' + format_vector(self.gravity) + ');\n')

        if hasattr(self, 'fogMode'):
            file_handler.write(indent + 'scene.fogMode = ' + self.fogMode + ';\n')
            file_handler.write(indent + 'scene.fogColor = new B.Color3(' + format_color(self.fogColor) + ');\n')
            file_handler.write(indent + 'scene.fogStart = ' + self.fogStart + ';\n')
            file_handler.write(indent + 'scene.fogEnd = ' + self.fogEnd + ';\n')
            file_handler.write(indent + 'scene.fogDensity = ' + self.fogDensity + ';\n')

        file_handler.write('\n' + indent + '// define materials & skeletons before meshes\n')
        file_handler.write(indent + 'defineMaterials(scene, resourcesRootDir);\n')
        if exporter.hasSkeletons: file_handler.write(indent + 'defineSkeletons(scene);\n')

        file_handler.write('\n' + indent + '// instance all root meshes\n')

        if exporter.scene.includeMeshFactory:
            factoryVersion  = indent + 'if (typeof (TOWER_OF_BABEL) !== \'undefined\'){\n'
            factoryVersion += indent + '    TOWER_OF_BABEL.MeshFactory.MODULES.push(new MeshFactory(scene));\n'

        meshIndent = indent + ('    '  if exporter.scene.includeMeshFactory else '')
        regVersion = ''
        for mesh in exporter.meshesAndNodes:
            if not hasattr(mesh, 'parentId'):
                if exporter.scene.includeMeshFactory and not hasattr(mesh, 'shapeKeyGroups'):
                    factoryVersion += meshIndent + 'TOWER_OF_BABEL.MeshFactory.instance("' + exporter.nameSpace + '", "' + mesh.name + '", true);\n'
                regVersion += meshIndent + 'new ' + mesh.legalName + '("' + mesh.name + '", scene)'
                if not hasattr(mesh, 'shapeKeyGroups'):
                    regVersion += '.makeInstances();\n' if hasattr(mesh, "instances") and len(mesh.instances) > 0 else ';\n'
                else:
                    regVersion += ';\n'

        # code to optionally
        if exporter.scene.includeMeshFactory:
            file_handler.write(factoryVersion)
            file_handler.write(indent + '} else {\n')
            file_handler.write(regVersion)
            file_handler.write(indent + '}\n')
        else:
            file_handler.write(regVersion)

        if exporter.hasCameras: file_handler.write('\n' + indent + '// define cameras after meshes, incase LockedTarget is in use\n')
        if exporter.hasCameras: file_handler.write(indent +'defineCameras(scene);\n')

        if exporter.hasSounds : file_handler.write('\n' + indent + '// define sounds after meshes, incase attached\n')
        if exporter.hasSounds : file_handler.write(indent + 'defineSounds(scene, resourcesRootDir);\n')

        if exporter.hasLights : file_handler.write('\n' + indent + '// lights defined after meshes, so shadow gen\'s can also be defined\n')
        if exporter.hasLights : file_handler.write(indent + 'defineLights(scene);\n')

        file_handler.write('    }\n')
        file_handler.write('    ' + exporter.nameSpace + '.initScene = initScene;\n')
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def meshFactory_script(self, file_handler, typescript_file_handler, meshesAndNodes, exporter):
        rootMeshes = []
        classNames = []
        isNode     = []
        factoryIdx = 0
        for mesh in meshesAndNodes:
            if not hasattr(mesh, 'parentId'):
                name = mesh.name
                # a few mods for special chars in fonts,  never want to do \\ replace for '""
                if '"' in name:
                    name = name.replace('"', '\\"')
                else:
                    name = name.replace('\\', '\\\\')

                rootMeshes.append(name)
                classNames.append(mesh.legalName)
                isNode.append(True if hasattr(mesh, 'isNode') else False)

                mesh.setFactoryIdx(factoryIdx)
                factoryIdx += 1

        if len(rootMeshes) == 0:
            Logger.warn('No meshes without parents, so meshFactory not built')
            return

        typescript_file_handler.write('    class MeshFactory implements TOWER_OF_BABEL.FactoryModule {\n')
        typescript_file_handler.write('        constructor(_scene : BABYLON.Scene, materialsRootDir: string);\n')
        typescript_file_handler.write('        getModuleName() : string;\n')
        typescript_file_handler.write('        instance(meshName : string, cloneSkeleton? : boolean) : BABYLON.Mesh;\n')
        typescript_file_handler.write('    }\n')
        typescript_file_handler.write('    export function getStats() : [number];\n')

        file_handler.write('    var meshLib = new Array(' + str(len(rootMeshes)) + ');\n')
        file_handler.write('    var cloneCount = 1;\n\n')
        file_handler.write('    var originalVerts = 0;\n')
        file_handler.write('    var clonedVerts = 0;\n')
        file_handler.write('    var MeshFactory = (function () {\n')
        file_handler.write('        function MeshFactory(_scene, materialsRootDir) {\n')
        file_handler.write('            this._scene = _scene;\n');
        file_handler.write('            if (!materialsRootDir) { materialsRootDir = "./"; }\n')
        file_handler.write('            defineMaterials(_scene, materialsRootDir); //embedded version check\n')
        file_handler.write('        }\n\n')
        file_handler.write('        MeshFactory.prototype.getModuleName = function () { return "' + exporter.nameSpace + '";};\n\n')
        file_handler.write('        MeshFactory.prototype.instance = function (meshName, cloneSkeleton) {\n')
        file_handler.write('            var ret = null;\n')
        file_handler.write('            var src;\n')
        file_handler.write('            switch (meshName){\n')

        for i, rootMesh in enumerate(rootMeshes):
            file_handler.write('                case "' + rootMesh + '":\n')
            file_handler.write('                    src = getViable(' + str(i) + (', true' if isNode[i] else '') + ');\n')
            file_handler.write('                    if (src === null){\n')
            file_handler.write('                        ret = new ' + classNames[i] + '("' + rootMesh + '", this._scene);\n')
            file_handler.write('                        originalVerts += ret.getTotalVertices();\n')
            file_handler.write('                        meshLib[' + str(i) + '].push(ret);\n')
            file_handler.write('                    }else{\n')
            file_handler.write('                        ret = new ' + classNames[i] + '("' + rootMesh + '" + "_" + cloneCount++, this._scene, null, src);\n')
            file_handler.write('                        clonedVerts += ret.getTotalVertices();\n')
            file_handler.write('                    }\n')
            file_handler.write('                    break;\n')

        file_handler.write('            }\n')
        file_handler.write('            if (ret !== null){\n')
        file_handler.write('                if (cloneSkeleton && src && src.skeleton){\n')
        file_handler.write('                    var skelName = src.skeleton.name + cloneCount;\n')
        file_handler.write('                    ret.skeleton = src.skeleton.clone(skelName, skelName);\n')
        file_handler.write('                }\n')
        file_handler.write('            }\n')
        file_handler.write('            else B.Tools.Error("Mesh not found: " + meshName);\n')
        file_handler.write('            return ret;\n')
        file_handler.write('        };\n')
        file_handler.write('        return MeshFactory;\n')
        file_handler.write('    })();\n')
        file_handler.write('    ' + exporter.nameSpace + '.MeshFactory = MeshFactory;\n')

        file_handler.write('    function getViable(libIdx, isNode) {\n')
        file_handler.write('        var meshes = meshLib[libIdx];\n')
        file_handler.write('        if (!meshes || meshes === null){\n')
        file_handler.write('            if (!meshes) meshLib[libIdx] = new Array();\n')
        file_handler.write('            return null;\n')
        file_handler.write('        }\n\n')

        file_handler.write('        for (var i = meshes.length - 1; i >= 0; i--){\n')
        file_handler.write('            if (meshes[i].geometry || isNode) return meshes[i];\n')
        file_handler.write('        }\n')
        file_handler.write('        return null;\n')
        file_handler.write('    }\n\n')

        file_handler.write('    function clean(libIdx) {\n')
        file_handler.write('        var meshes = meshLib[libIdx];\n')
        file_handler.write('        if (!meshes  || meshes === null) return;\n\n')

        file_handler.write('        var stillViable = false;\n')
        file_handler.write('        for (var i = meshes.length - 1; i >= 0; i--){\n')
        file_handler.write('            if (!meshes[i].geometry) meshes[i] = null;\n')
        file_handler.write('            else stillViable = true;\n')
        file_handler.write('        }\n')
        file_handler.write('        if (!stillViable) meshLib[libIdx] = null;\n')
        file_handler.write('    }\n\n')

        file_handler.write('    function getStats() { return [cloneCount, originalVerts, clonedVerts]; }\n')
        file_handler.write('    ' + exporter.nameSpace + '.getStats = getStats;\n\n')
