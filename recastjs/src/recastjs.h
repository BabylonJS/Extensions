#pragma once
#include "../recastnavigation/Detour/Include/DetourNavMesh.h"
#include "../recastnavigation/DetourCrowd/Include/DetourCrowd.h"
#include <vector>
class dtNavMeshQuery;
class dtNavMesh;
class MeshLoader;
class NavMesh;
struct rcConfig;


struct Vec3 
{
	Vec3() {}
    Vec3(float v) : x(v), y(v), z(v) {}
    Vec3(float x, float y, float z) : x(x), y(y), z(z) {}
    void isMinOf(const Vec3& v)
    {
        x = std::min(x, v.x);
        y = std::min(y, v.y);
        z = std::min(z, v.z);
    }
    void isMaxOf(const Vec3& v)
    {
        x = std::max(x, v.x);
        y = std::max(y, v.y);
        z = std::max(z, v.z);
    }
    float operator [](int index) {
        return ((float*)&x)[index];
    }
    float x, y, z;
};

struct Triangle 
{
	Triangle(){}
	const Vec3& getPoint(long n)
    {
        if (n < 2)
        {
            return mPoint[n];
        }
        return mPoint[2];
    }
    Vec3 mPoint[3];
};

struct DebugNavMesh 
{
	int getTriangleCount() { return int(mTriangles.size()); }
	const Triangle& getTriangle(int n)
    {
        if (n < int(mTriangles.size()))
        {
            return mTriangles[n];
        }
        return mTriangles.back();
    }
    std::vector<Triangle> mTriangles;
};

class NavMesh
{
public:
	NavMesh() : m_navQuery(0)
			  , m_navMesh(0)
	{
	}
	void destroy();
	void build(const float* positions, const int positionCount, const int* indices, const int indexCount, const rcConfig& config);

    DebugNavMesh getDebugNavMesh();
	Vec3 getClosestPoint(const Vec3& position);
    Vec3 getRandomPointAround(const Vec3& position, float maxRadius);
	dtNavMesh* getNavMesh() 
	{ 
		return m_navMesh; 
	}

protected:

	dtNavMeshQuery* m_navQuery;
	dtNavMesh* m_navMesh;

    void navMeshPoly(DebugNavMesh& debugNavMesh, const dtNavMesh& mesh, dtPolyRef ref);
    void navMeshPolysWithFlags(DebugNavMesh& debugNavMesh, const dtNavMesh& mesh, const unsigned short polyFlags);
};

class Crowd
{
public:	
	Crowd(const int maxAgents, const float maxAgentRadius, dtNavMesh* nav);
	void destroy();
	int addAgent(const Vec3& pos, const dtCrowdAgentParams* params);
	void removeAgent(const int idx);
	void update(const float dt);
	Vec3 getAgentPosition(int idx);
    Vec3 getAgentVelocity(int idx);
	void agentGoto(int idx, const Vec3& destination);
protected:
	dtCrowd *m_crowd;
};
