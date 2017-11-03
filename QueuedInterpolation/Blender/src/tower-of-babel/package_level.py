from sys import modules
from math import floor
from mathutils import Euler, Matrix

from bpy import app
from time import strftime
FLOAT_PRECISION_DEFAULT = 4
#MAX_FLOAT_PRECISION = '%.' + str(MAX_FLOAT_PRECISION_DEFAULT) + 'f'
VERTEX_OUTPUT_PER_LINE = 50
STRIP_LEADING_ZEROS_DEFAULT = True # false for .babylon
MIN_CONTIGUOUS_INDEXES = 10
MIN_REPEATS = 8
#===============================================================================
#  module level formatting methods, called from multiple classes
#===============================================================================
def get_title():
    bl_info = get_bl_info()
    return bl_info['name'] + ' ver ' + format_exporter_version(bl_info)
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
def format_exporter_version(bl_info = None):
    if bl_info is None:
        bl_info = get_bl_info()
    exporterVersion = bl_info['version']
    if exporterVersion[2] >= 0:
        return str(exporterVersion[0]) + '.' + str(exporterVersion[1]) +  '.' + str(exporterVersion[2])
    else:
        return str(exporterVersion[0]) + '.' + str(exporterVersion[1]) +  '-beta'
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
def blenderMajorMinorVersion():
    # in form of '2.77 (sub 0)'
    split1 = app.version_string.partition('.')
    major = split1[0]

    split2 = split1[2].partition(' ')
    minor = split2[0]

    return float(major + '.' + minor)
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
def verify_min_blender_version():
    reqd = get_bl_info()['blender']

    # in form of '2.77 (sub 0)'
    split1 = app.version_string.partition('.')
    major = int(split1[0])
    if reqd[0] > major: return False

    split2 = split1[2].partition(' ')
    minor = int(split2[0])
    if reqd[1] > minor: return False

    split3 = split2[2].partition(' ')
    revision = int(split3[2][:1])
    if reqd[2] > revision: return False

    return True
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
def getNameSpace(filepathMinusExtension):
    # assign nameSpace, based on OS
    if filepathMinusExtension.find('\\') != -1:
        return legal_js_identifier(filepathMinusExtension.rpartition('\\')[2])
    else:
        return legal_js_identifier(filepathMinusExtension.rpartition('/')[2])
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
def getLayer(obj):
    # empties / nodes do not have layers
    if not hasattr(obj, 'layers') : return -1;
    for idx, layer in enumerate(obj.layers):
        if layer:
            return idx
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# a class for getting the module name, exporter version, & reqd blender version in get_bl_info()
class dummy: pass
def get_bl_info():
    # .__module__ is the 'name of package.module', so strip after dot
    packageName = dummy.__module__.partition('.')[0]
    return modules.get(packageName).bl_info
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
def legal_js_identifier(input):
    out = ''
    prefix = ''
    for char in input:
        if len(out) == 0:
            if char in '0123456789':
                # cannot take the chance that leading numbers being chopped of cause name conflicts, e.g (01.R & 02.R)
                prefix += char
                continue
            elif char.upper() not in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ':
                continue

        legal = char if char.upper() in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_' else '_'
        out += legal

    if len(prefix) > 0:
        out += '_' + prefix
    return out
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
def format_f(num, stripLeadingZero = STRIP_LEADING_ZEROS_DEFAULT, precision = FLOAT_PRECISION_DEFAULT):
    fmt = '%.' + str(precision) + 'f'
    s = fmt % num  # rounds to N decimal places
    s = s.rstrip('0') # strip trailing zeroes
    s = s.rstrip('.') # strip trailing .
    s = '0' if s == '-0' else s # nuke -0

    if stripLeadingZero:
        asNum = float(s)
        if asNum != 0 and asNum > -1 and asNum < 1:
            if asNum < 0:
                s = '-' + s[2:]
            else:
                s = s[1:]

    return s
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
def format_matrix4(matrix):
    tempMatrix = matrix.copy()
    tempMatrix.transpose()

    ret = ''
    first = True
    for vect in tempMatrix:
        if (first != True):
            ret +=','
        first = False;

        ret += format_f(vect[0]) + ',' + format_f(vect[1]) + ',' + format_f(vect[2]) + ',' + format_f(vect[3])

    return ret
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
def format_array3(array):
    return format_f(array[0]) + ',' + format_f(array[1]) + ',' + format_f(array[2])
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
def format_array(array, indent = '', beginIdx = 0, firstNotIncludedIdx = -1):
    ret = ''
    first = True
    nOnLine = 0
    
    endIdx = len(array) if firstNotIncludedIdx == -1 else firstNotIncludedIdx
    for idx in range(beginIdx, endIdx):
        if (first != True):
            ret +=','
        first = False;

        ret += format_f(array[idx])
        nOnLine += 1

        if nOnLine >= VERTEX_OUTPUT_PER_LINE:
            ret += '\n' + indent
            nOnLine = 0

    return ret
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
def format_color(color):
    return format_f(color.r) + ',' + format_f(color.g) + ',' + format_f(color.b)
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
def format_vector(vector, switchYZ = True):
    return format_f(vector.x) + ',' + format_f(vector.z) + ',' + format_f(vector.y) if switchYZ else format_f(vector.x) + ',' + format_f(vector.y) + ',' + format_f(vector.z)
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# for writing JSON files read in Blender; python must also have leading zeros
def format_vector_non_swapping(vector):
    return format_f(vector.x, False) + ',' + format_f(vector.y, False) + ',' + format_f(vector.z, False)
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
def format_vector_array(vectorArray, indent = '', switchYZ = True):
    ret = ''
    first = True
    nOnLine = 0
    for vector in vectorArray:
        if (first != True):
            ret +=','
        first = False;

        ret += format_vector(vector, switchYZ)
        nOnLine += 3

        if nOnLine >= VERTEX_OUTPUT_PER_LINE:
            ret += '\n' + indent
            nOnLine = 0

    return ret
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
def format_quaternion(quaternion):
    return format_f(quaternion.x) + ',' + format_f(quaternion.z) + ',' + format_f(quaternion.y) + ',' + format_f(-quaternion.w)
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
def format_int(int):
    candidate = str(int) # when int string of an int
    if '.' in candidate:
        return format_f(floor(int)) # format_f removes un-neccessary precision
    else:
        return candidate
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
def format_bool(bool):
    if bool:
        return 'true'
    else:
        return 'false'
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
def post_rotate_quaternion(quat, angle):
    post = Euler((angle, 0.0, 0.0)).to_matrix()
    mqtn = quat.to_matrix()
    quat = (mqtn*post).to_quaternion()
    return quat
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
def scale_vector(vector, mult, xOffset = 0):
    ret = vector.copy()
    ret.x *= mult
    ret.x += xOffset
    ret.z *= mult
    ret.y *= mult
    return ret
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
def same_matrix4(matA, matB):
    if(matA is None or matB is None): return False
    if (len(matA) != len(matB)): return False
    for i in range(len(matA)):
        if (format_f(matA[i][0]) != format_f(matB[i][0]) or
            format_f(matA[i][1]) != format_f(matB[i][1]) or
            format_f(matA[i][2]) != format_f(matB[i][2]) or
            format_f(matA[i][3]) != format_f(matB[i][3]) ):
            return False
    return True
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
def same_vertex(vertA, vertB):
    if vertA is None or vertB is None: return False

    if (format_f(vertA.x) != format_f(vertB.x) or
        format_f(vertA.y) != format_f(vertB.y) or
        format_f(vertA.z) != format_f(vertB.z) ):
        return False

    return True
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
def similar_vertex(vertA, vertB, tolerance = 0.00015):
    if vertA is None or vertB is None: return False

    if (abs(vertA.x - vertB.x) > tolerance or
        abs(vertA.y - vertB.y) > tolerance or
        abs(vertA.z - vertB.z) > tolerance ):
        return False

    return True
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
def same_array(arrayA, arrayB):
    if(arrayA is None or arrayB is None): return False
    if len(arrayA) != len(arrayB): return False
    for i in range(len(arrayA)):
        if format_f(arrayA[i]) != format_f(arrayB[i]) : return False

    return True
#===============================================================================
# module level methods for writing JSON (.babylon) files
#===============================================================================
def write_matrix4(file_handler, name, matrix):
    file_handler.write(',"' + name + '":[' + format_matrix4(matrix) + ']')

def write_array(file_handler, name, array):
    file_handler.write('\n,"' + name + '":[' + format_array(array) + ']')

def write_array3(file_handler, name, array):
    file_handler.write(',"' + name + '":[' + format_array3(array) + ']')

def write_color(file_handler, name, color):
    file_handler.write(',"' + name + '":[' + format_color(color) + ']')

def write_vector(file_handler, name, vector, switchYZ = True):
    file_handler.write(',"' + name + '":[' + format_vector(vector, switchYZ) + ']')

def write_vector_array(file_handler, name, vectorArray, switchYZ = True):
    file_handler.write('\n,"' + name + '":[' + format_vector_array(vectorArray, '', switchYZ) + ']')

def write_quaternion(file_handler, name, quaternion):
    file_handler.write(',"' + name  +'":[' + format_quaternion(quaternion) + ']')

def write_string(file_handler, name, string, noComma = False):
    if noComma == False:
        file_handler.write(',')
    file_handler.write('"' + name + '":"' + string + '"')

def write_float(file_handler, name, float, precision = FLOAT_PRECISION_DEFAULT):
    file_handler.write(',"' + name + '":' + format_f(float, precision = precision))

def write_int(file_handler, name, int, noComma = False):
    if noComma == False:
        file_handler.write(',')
    file_handler.write('"' + name + '":' + format_int(int))

def write_bool(file_handler, name, bool, noComma = False):
    if noComma == False:
        file_handler.write(',')
    file_handler.write('"' + name + '":' + format_bool(bool))
#===============================================================================
# module level methods for writing JSON (.js) files
#===============================================================================
def write_js_module_header(file_handler, moduleName, hasSkeletons = False, hasGeo = True):
    file_handler.write('// File generated with Tower of Babel version: ' + format_exporter_version() + ' on ' + strftime("%x") + '\n')

    # module open  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    file_handler.write('var __extends = this.__extends || function (d, b) {\n')
    file_handler.write('    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];\n')
    file_handler.write('    function __() { this.constructor = d; }\n')
    file_handler.write('    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n')
    file_handler.write('};\n')
    file_handler.write('var ' + moduleName + ';\n')
    file_handler.write('(function (' + moduleName + ') {\n')
    file_handler.write('    var _B = BABYLON;\n')
    file_handler.write('    var _M = _B.Matrix.FromValues;\n')
    file_handler.write('    var _Q = _B.Quaternion;\n')
    file_handler.write('    var _V = _B.Vector3;\n')
    
    if hasGeo:
        # add function to unpack contiguous indexes (referenced in writeInt32Array)
        file_handler.write('    function CONTIG(array, offset, begin, end) {\n')
        file_handler.write('        for(var i = 0, len = 1 + end - begin; i < len; i++) {\n')
        file_handler.write('            array[offset + i] = begin + i;\n')
        file_handler.write('        }\n')
        file_handler.write('    }\n')
        
        
        # add function to unpack repeated values (referenced in writeFloat32Array)
        file_handler.write('    function REPEAT(array, offset, nRepeats, val) {\n')
        file_handler.write('        for(var i = 0; i < nRepeats; i++) {\n')
        file_handler.write('            array[offset + i] = val;\n')
        file_handler.write('        }\n')
        file_handler.write('    }\n')
    
    if hasSkeletons:
        file_handler.write('    function UNPACK(compressed) {\n')
        file_handler.write('        var len = compressed.length * 4;\n')
        file_handler.write('        ret = new Float32Array(compressed.length * 4);\n')
        file_handler.write('        for(var i = 0, j = 0; i < len; i += 4, j++) {\n')
        file_handler.write('            ret[i    ] =  compressed[j] & 0x000000FF;\n')
        file_handler.write('            ret[i + 1] = (compressed[j] & 0x0000FF00) >> 8;\n')
        file_handler.write('            ret[i + 2] = (compressed[j] & 0x00FF0000) >> 16;\n')
        file_handler.write('            ret[i + 3] =  compressed[j] >> 24;\n')
        file_handler.write('        }\n')
        file_handler.write('        return ret;\n')
        file_handler.write('    }\n')
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# returns an array of the offsets, begin values, & ending values of contiguous indexes
def findContigousRanges(array, isSorted):
    ret = []
    inRange = False
    minNumber = 1 if isSorted else MIN_CONTIGUOUS_INDEXES # need at least 10 contiguous when not sorted
    
    offset = beginVal = -1

    #  loop from first to end - 1 (range is not inclusive)
    for i in range(len(array) - 1):
        if array[i] + 1 == array[i + 1]:
            if not inRange:
                offset = i
                beginVal = array[i]
                inRange = True
                
        elif inRange:
            if 1 + i - offset >=  minNumber:
                ret.append([offset, beginVal, array[i]])
            inRange = False
    
    # test to see if ran out of numbers while still in a range 
    if inRange:
        ret.append([offset, beginVal, array[len(array) - 1]])
        
    return ret
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
def writeIndexArray(file_handler, var, indent, array, isSorted):
    sz = len(array)
    ranges = findContigousRanges(array, isSorted)
    nRanges = len(ranges)
    
    if nRanges == 0:
        file_handler.write(indent  + var + ' = new Uint32Array([' + format_array(array, indent) + ']);\n');
        return;
        
    file_handler.write(indent  + var + ' = new Uint32Array(' + format_int(sz) + ');\n');
    
    # test for gap at beginning
    firstBegin = ranges[0][0]
    if firstBegin != 0:
        file_handler.write(indent  + var + '.set([' + format_array(array, indent, 0, firstBegin) + ']);\n')

    for i in range(nRanges):
        offset = ranges[i][0]
        begin  = ranges[i][1]
        end    = ranges[i][2] 
        file_handler.write(indent  + 'CONTIG('+ var + ', ' +  format_int(offset) + ', ' + format_int(begin) + ', ' + format_int(end) + ');\n');
        
        lastIdx = offset + (end - begin)
        
        # test for a gap between ranges or at end
        nextOffset = ranges[i + 1][0] if i + 1 < nRanges else sz
        if nextOffset - lastIdx > 1:
            file_handler.write(indent  + var + '.set([' + format_array(array, indent, lastIdx + 1, nextOffset) + '], ' + format_int(lastIdx + 1) + ');\n');
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
def vectorArrayToArray(vectorArray):
    ret = []
    for vector in vectorArray:
        ret.append(vector.x)
        ret.append(vector.z)
        ret.append(vector.y)
    return ret
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# returns an array of the begin indexes, num repeats, & repeated values as strings
def findRepeatRanges(array):
    ret = []
    inRange = False
    repeat = '-9999999'

    #  loop from first to end (range is not inclusive)
    for i in range(len(array)):
        next = format_f(array[i])
        if next == repeat:
            if not inRange:
                offset = i - 1
                inRange = True
                
        elif inRange:
            nRepeats = i - offset
            if nRepeats >=  MIN_REPEATS:
                ret.append([offset, nRepeats, repeat])
            inRange = False
            
        repeat = next
            
    # test to see if ran out of numbers while still in a range 
    if inRange:
        nRepeats = len(array) - offset
        ret.append([offset, nRepeats, repeat])
        
    return ret
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
def writeRepeatableArray(file_handler, var, indent, array, dataType, isVectorArray):
    if isVectorArray: array = vectorArrayToArray(array)
    sz = len(array)
    repeatRanges = findRepeatRanges(array)
    nRanges = len(repeatRanges)
    
    if nRanges == 0:
        file_handler.write(indent  + var + ' = new ' + dataType + '([' + format_array(array, indent) + ']);\n');
        return;
        
    file_handler.write(indent  + var + ' = new ' + dataType + '(' + format_int(sz) + ');\n');
    
    # test for values at beginning
    firstRangeBegin = repeatRanges[0][0]
    if firstRangeBegin != 0:
        file_handler.write(indent  + var + '.set([' + format_array(array, indent, 0, firstRangeBegin) + ']);\n')

    for i in range(nRanges):
        offset   = repeatRanges[i][0]
        nRepeats = repeatRanges[i][1]
        valueStr = repeatRanges[i][2] 
        
        # write range unless the repeat is a zero
        if valueStr != '0':
            file_handler.write(indent  + 'REPEAT('+ var + ', ' +  format_int(offset) + ', ' + format_int(nRepeats) + ', ' + valueStr + ');\n');
            
        lastIdx = offset + nRepeats - 1
        
        # test for a gap between ranges or at end
        nextOffset = repeatRanges[i + 1][0] if i + 1 < nRanges else sz
        if nextOffset - lastIdx > 1:
            file_handler.write(indent  + var + '.set([' + format_array(array, indent, lastIdx + 1, nextOffset) + '], ' + format_int(lastIdx + 1) + ');\n');
