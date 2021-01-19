cmake_minimum_required (VERSION 3.6)
project (recastjs)
# Add project's cmake modules to path
set(CMAKE_MODULE_PATH ${CMAKE_MODULE_PATH} ${PROJECT_SOURCE_DIR}/.)

SET_PROPERTY(GLOBAL PROPERTY USE_FOLDERS ON) 

set(CMAKE_CONFIGURATION_TYPES "Debug;Release;RelWithDebInfo" CACHE STRING "Configuration types" FORCE)

SET(CMAKE_MODULE_PATH "${CMAKE_SOURCE_DIR}/CMake")
set(CMAKE_CXX_STANDARD 14)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

file(GLOB_RECURSE SRC_FILES
    ${CMAKE_SOURCE_DIR}/src/*.h
    ${CMAKE_SOURCE_DIR}/src/*.cpp
)
file(GLOB RECASTDETOUR_FILES
    ${CMAKE_SOURCE_DIR}/recastnavigation/Detour/Source/DetourAlloc.cpp
    ${CMAKE_SOURCE_DIR}/recastnavigation/Detour/Source/DetourAssert.cpp
    ${CMAKE_SOURCE_DIR}/recastnavigation/Detour/Source/DetourCommon.cpp
    ${CMAKE_SOURCE_DIR}/recastnavigation/Detour/Source/DetourNavMesh.cpp
    ${CMAKE_SOURCE_DIR}/recastnavigation/Detour/Source/DetourNavMeshBuilder.cpp
    ${CMAKE_SOURCE_DIR}/recastnavigation/Detour/Source/DetourNavMeshQuery.cpp
    ${CMAKE_SOURCE_DIR}/recastnavigation/Detour/Source/DetourNode.cpp
    ${CMAKE_SOURCE_DIR}/recastnavigation/DetourCrowd/Source/DetourCrowd.cpp
    ${CMAKE_SOURCE_DIR}/recastnavigation/DetourCrowd/Source/DetourLocalBoundary.cpp
    ${CMAKE_SOURCE_DIR}/recastnavigation/DetourCrowd/Source/DetourObstacleAvoidance.cpp
    ${CMAKE_SOURCE_DIR}/recastnavigation/DetourCrowd/Source/DetourPathCorridor.cpp
    ${CMAKE_SOURCE_DIR}/recastnavigation/DetourCrowd/Source/DetourPathQueue.cpp
    ${CMAKE_SOURCE_DIR}/recastnavigation/DetourCrowd/Source/DetourProximityGrid.cpp
    ${CMAKE_SOURCE_DIR}/recastnavigation/DetourTileCache/Source/DetourTileCache.cpp
    ${CMAKE_SOURCE_DIR}/recastnavigation/DetourTileCache/Source/DetourTileCacheBuilder.cpp
    ${CMAKE_SOURCE_DIR}/recastnavigation/Recast/Source/Recast.cpp
    ${CMAKE_SOURCE_DIR}/recastnavigation/Recast/Source/RecastAlloc.cpp
    ${CMAKE_SOURCE_DIR}/recastnavigation/Recast/Source/RecastArea.cpp
    ${CMAKE_SOURCE_DIR}/recastnavigation/Recast/Source/RecastAssert.cpp
    ${CMAKE_SOURCE_DIR}/recastnavigation/Recast/Source/RecastContour.cpp
    ${CMAKE_SOURCE_DIR}/recastnavigation/Recast/Source/RecastFilter.cpp
    ${CMAKE_SOURCE_DIR}/recastnavigation/Recast/Source/RecastLayers.cpp
    ${CMAKE_SOURCE_DIR}/recastnavigation/Recast/Source/RecastMesh.cpp
    ${CMAKE_SOURCE_DIR}/recastnavigation/Recast/Source/RecastMeshDetail.cpp
    ${CMAKE_SOURCE_DIR}/recastnavigation/Recast/Source/RecastRasterization.cpp
    ${CMAKE_SOURCE_DIR}/recastnavigation/Recast/Source/RecastRegion.cpp
    ${CMAKE_SOURCE_DIR}/recastnavigation/RecastDemo/Source/ChunkyTriMesh.cpp
    ${CMAKE_SOURCE_DIR}/recastnavigation/RecastDemo/Contrib/fastlz/fastlz.c
)

include_directories(
  ${CMAKE_CURRENT_SOURCE_DIR}/src
  ${CMAKE_CURRENT_SOURCE_DIR}/recastnavigation/Detour/Include
  ${CMAKE_CURRENT_SOURCE_DIR}/recastnavigation/DetourCrowd/Include
  ${CMAKE_CURRENT_SOURCE_DIR}/recastnavigation/DetourTileCache/Include
  ${CMAKE_CURRENT_SOURCE_DIR}/recastnavigation/Recast/Include
  ${CMAKE_CURRENT_SOURCE_DIR}/recastnavigation/RecastDemo/Include
)


SET(LINK_OPTIONS " ")
SET(EXE_NAME "recastjs")

ADD_LIBRARY(${EXE_NAME} ${SRC_FILES} ${RECASTDETOUR_FILES})

