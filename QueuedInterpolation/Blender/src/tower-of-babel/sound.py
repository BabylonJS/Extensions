from .package_level import *

import bpy
#===============================================================================
class Sound:
    def __init__(self, name, autoplay, loop, connectedMesh = None):
        self.name = name;
        self.autoplay = autoplay
        self.loop = loop
        if connectedMesh != None:
            self.connectedMeshId = connectedMesh.name
            self.maxDistance = connectedMesh.data.maxSoundDistance
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    def to_script_file(self, file_handler, indent):
        options = 'autoplay: ' + format_bool(self.autoplay) + ', loop: ' + format_bool(self.loop)
        if hasattr(self, 'connectedMeshId'):
            options += ', maxDistance: ' + format_f(self.maxDistance)

        file_handler.write('\n' + indent + 'sound = new _B.Sound("' + self.name + '", soundsRootDir + "' + self.name + '", scene, ')
        file_handler.write('function () { scene._removePendingData(sound); }, ')

        file_handler.write('{' + options + '});\n')
        file_handler.write(indent + 'scene._addPendingData(sound);\n')

        if hasattr(self, 'connectedMeshId'):
            file_handler.write(indent + 'connectedMesh = scene.getMeshByID("' + self.connectedMeshId + '");\n')
            file_handler.write(indent + 'if (connectedMesh) {\n')
            file_handler.write(indent + '    newSound.attachToMesh(connectedMesh);\n')
            file_handler.write(indent + '}\n')