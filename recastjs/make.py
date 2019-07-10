#!/usr/bin/python

import os, sys, re, json, shutil, multiprocessing
from subprocess import Popen, PIPE, STDOUT

# Definitions

INCLUDES = [
os.path.join('..', 'src', 'recastjs.h'),
os.path.join('..', 'recastnavigation', 'Recast', 'Include', 'Recast.h'),
os.path.join('..', 'recastnavigation', 'Detour', 'Include', 'DetourNavMeshQuery.h'),
]

# Startup

stage_counter = 0

def which(program):
  for path in os.environ["PATH"].split(os.pathsep):
    exe_file = os.path.join(path, program)
    if os.path.exists(exe_file):
      return exe_file
  return None

def build():
  EMSCRIPTEN_ROOT = os.environ.get('EMSCRIPTEN')
  if not EMSCRIPTEN_ROOT:
    emcc = which('emcc')
    EMSCRIPTEN_ROOT = os.path.dirname(emcc)

  if not EMSCRIPTEN_ROOT:
    print "ERROR: EMSCRIPTEN_ROOT environment variable (which should be equal to emscripten's root dir) not found"
    sys.exit(1)

  sys.path.append(EMSCRIPTEN_ROOT)
  import tools.shared as emscripten

  wasm = 'wasm' in sys.argv
  closure = 'closure' in sys.argv

  args = '-O3 --llvm-lto 1 -s NO_EXIT_RUNTIME=1 -s NO_FILESYSTEM=1 -s EXPORTED_RUNTIME_METHODS=["Pointer_stringify"]'
  if not wasm:
    args += ' -s WASM=0 -s AGGRESSIVE_VARIABLE_ELIMINATION=1 -s ELIMINATE_DUPLICATE_FUNCTIONS=1 -s SINGLE_FILE=1 -s LEGACY_VM_SUPPORT=1'
  else:
    args += ''' -s WASM=1 -s BINARYEN_IGNORE_IMPLICIT_TRAPS=1 -s BINARYEN_TRAP_MODE="clamp"'''
  if closure:
    args += ' --closure 1 -s IGNORE_CLOSURE_COMPILER_ERRORS=1'
  else:
    args += ' -s NO_DYNAMIC_EXECUTION=1'

  emcc_args = args.split(' ')

  emcc_args += ['-s', 'TOTAL_MEMORY=%d' % (64*1024*1024)] # default 64MB. Compile with ALLOW_MEMORY_GROWTH if you want a growable heap (slower though).
  #emcc_args += ['-s', 'ALLOW_MEMORY_GROWTH=1'] # resizable heap, with some amount of slowness

  emcc_args += '-s EXPORT_NAME="Recast" -s MODULARIZE=1'.split(' ')

  target = 'recast.js' if not wasm else 'recast.wasm.js'

  print
  print '--------------------------------------------------'
  print 'Building recast.js, build type:', emcc_args
  print '--------------------------------------------------'
  print

  # Utilities

  def stage(text):
    global stage_counter
    stage_counter += 1
    text = 'Stage %d: %s' % (stage_counter, text)
    print
    print '=' * len(text)
    print text
    print '=' * len(text)
    print

  # Main

  try:
    this_dir = os.getcwd()
    if not os.path.exists('build'):
      os.makedirs('build')
    os.chdir('build')

    stage('Generate bindings')

    Popen([emscripten.PYTHON, os.path.join(EMSCRIPTEN_ROOT, 'tools', 'webidl_binder.py'), os.path.join(this_dir, 'recast.idl'), 'glue']).communicate()
    assert os.path.exists('glue.js')
    assert os.path.exists('glue.cpp')

    stage('Build bindings')

    args = ['-I../recastnavigation/Detour/Include']
    for include in INCLUDES:
      args += ['-include', include]

    emscripten.Building.emcc('glue.cpp', args, 'glue.bc')
    assert(os.path.exists('glue.bc'))

    if not os.path.exists('CMakeCache.txt'):
      stage('Configure via CMake')
      emscripten.Building.configure([emscripten.PYTHON, os.path.join(EMSCRIPTEN_ROOT, 'emcmake'), 'cmake', '..', '-DCMAKE_BUILD_TYPE=Release'])

    stage('Make')

    CORES = multiprocessing.cpu_count()

    if emscripten.WINDOWS:
      emscripten.Building.make(['mingw32-make', '-j', str(CORES)])
    else:
      emscripten.Building.make(['make', '-j', str(CORES)])
      
    stage('Link')

    emscripten.Building.link(['glue.bc'] + ['librecastjs.a'], 'recastjs.bc')
    assert os.path.exists('recastjs.bc')

    stage('emcc: ' + ' '.join(emcc_args))

    temp = os.path.join('..', 'build', target)
    emscripten.Building.emcc('recastjs.bc', emcc_args + ['--js-transform', 'python %s' % os.path.join('..', 'bundle.py')],
                            temp)

    assert os.path.exists(temp), 'Failed to create script code'

    stage('wrap')

    wrapped = '''
  // This is recast.js, a port of Recast/detour to JavaScript.
  ''' + open(temp).read()

    open(temp, 'w').write(wrapped)

  finally:
    os.chdir(this_dir);

if __name__ == '__main__':
  build()

