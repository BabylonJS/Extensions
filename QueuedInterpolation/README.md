# Point of View Movement and Rotation
## Movement: ##
![](https://raw.githubusercontent.com/BabylonJS/Extensions/master/POV/doc-assist/POV-Movement.png)

`AbstractMesh` has a pair of functions which allow you to move it relative to the mesh's current position, but without regard to its current rotation.  Amounts are expressed in terms so as to provide the point of view of: behind the front of the mesh.

Here are their function definitions:

```typescript
/**
 * Perform relative position change from the point of view of behind the front of the mesh.
 * This is performed taking into account the meshes current rotation, so you do not have to care.
 * Supports definition of mesh facing forward or backward.
 * @param {number} amountRight
 * @param {number} amountUp
 * @param {number} amountForward
 */
movePOV(amountRight: number, amountUp: number, amountForward: number): void;
```

```typescript
/**
 * Calculate relative position change from the point of view of behind the front of the mesh.
 * This is performed taking into account the meshes current rotation, so you do not have to care.
 * Supports definition of mesh facing forward or backward.
 * @param {number} amountRight
 * @param {number} amountUp
 * @param {number} amountForward
 * @return {Vector3} - This value is actually the delta between current & future position.
 * Use position.addInPlace(delta) to affect.
 */
calcMovePOV(amountRight: number, amountUp: number, amountForward: number): BABYLON.Vector3;
```

Moving a mesh without having to take into account current rotation, frees application code from doing so at the time, and facilitates more reusable application code.

Also consider that most things in the real world move in the "Forward" direction the vast majority of the time.  This is true even of the airplane you just shot down in your FPS shooter.  Maybe it was even spiraling as well, but all you coded was "Forward".

It is believed that most meshes are defined with their "front side" facing the viewer,  much the same way they are defined with their "bottom" below their "top".  However, there is a switch in `AbstractMesh`, `definedFacingForward`, which can be set to false.  Doing so implies it is defined facing backwards instead. 

## Rotation: ##
*to do: make an image for rotation*

There are also similar functions for rotation.  Rotation does not have as strong a relationship with Point-of-View as positioning, but they do take into account `definedFacingForward`.  Their argument terminology is also less "alien" than that of either pilot (yaw-pitch-roll) or mathmatics (alpha-beta-gamma).  This is even more helpful if rotating in multiple axis's.
```typescript
/**
 * Perform relative rotation change from the point of view of behind the front of the mesh.
 * Supports definition of mesh facing forward or backward.
 * @param {number} flipBack
 * @param {number} twirlClockwise
 * @param {number} tiltRight
 */
rotatePOV(flipBack: number, twirlClockwise: number, tiltRight: number): void;
```

```typescript
/**
 * Calculate relative rotation change from the point of view of behind the front of the mesh.
 * Supports definition of mesh facing forward or backward.
 * @param {number} flipBack
 * @param {number} twirlClockwise
 * @param {number} tiltRight
 * @return {Vector3} - This value is actually the delta between current & future rotation.
 * Use rotation.addinPlace(delta) to affect.
 */
calcRotatePOV(flipBack: number, twirlClockwise: number, tiltRight: number): BABYLON.Vector3;
```
# POV Before Render Extension 
![](https://raw.githubusercontent.com/BabylonJS/Extensions/master/POV/doc-assist/POV-System.png)
##Introduction##
The functions inside of `AbstractMesh` are just raw material for the POV extension.  They are there so that they could be called under any circumstance.  A queue based, POV before render animation system uses these methods to achieve coordinated, stepwise, movement & rotation.  It can be found in the [Extensions](https://github.com/BabylonJS/Extensions/tree/master/POV) repository.

This enables meshes to move more like they do in the real world.  Most people and vehicles turn (twirl) at the same time as moving forward, not behave as if they are marching. Babylon's animation system can perform concurrent animations, but since animations are independent, it would just move in a single direction while twirling.

It is also crucial that "Forward" be redefined every frame, or stepwise.  Even if a POV move was made for Babylon's animation system, without a rewrite, "Forward" and the final position based on it would be defined only once at the beginning. 

POV was developed for MORPH.  Conveniently, MORPH already was using a before renderer, so adding on inside the render fit like a glove.  This made the overall system quite large though, and to hard to document and take-in at once.  Meshes which performed no morphing also could not use it.  It has now been made standalone.  MORPH now subclasses it.
##Main Components##
###Motion Event###
A `MotionEvent` is the base unit of the system.  It holds the directions to perform an animation.  They can be made in advance and also reusable since all directions are expressed in relative terms.  It is not a good idea to share them across meshes though, because they manage state when they are the event currently being performed.
```typescript
/**
 * Take in all the motion event info.  Movement & rotation are both optional, but both being null is usually for sub-classing.
 * 
 * @param {number} _milliDuration - The number of milli seconds the event is to be completed in
 * @param {number} _millisBefore - Fixed wait period, once a syncPartner (if any) is also ready (default 0)
 *                 When negative, no delay if being repeated in an EventSeries
 * @param {Vector3} movePOV - Mesh movement relative to its current position/rotation to be performed or null
 *                  right-up-forward
 * @param {Vector3} rotatePOV - Incremental Mesh rotation to be performed or null
 *                  flipBack-twirlClockwise-tiltRight
 * @param {Pace} _pace - Any Object with the function: getCompletionMilestone(currentDurationRatio) (default Pace.LINEAR)
 */
constructor(
    private _milliDuration : number, 
    private _millisBefore  : number, 
    public  movePOV        : BABYLON.Vector3, 
    public  rotatePOV      : BABYLON.Vector3,  
    private _pace          : Pace = Pace.LINEAR)
```

## Event Series
An `EventSeries' consists of an array of `MotionEvent`s, `BABYLON.Action`s, and functions().  The class also holds , is the unit placed in the render queue.
```typescript
/**
 * Validate each of the events passed.
 * @param {Array} _eventSeries - Elements must either be a MotionEvent, Action, or function.
 * @param {number} _nRepeats - Number of times to run through series elements.  There is sync across runs. (Default 1)
 * @param {number} _initialWallclockProrating - The factor to multiply the duration of a MotionEvent before returning.
 *                 Amount is decreased or increased across repeats, so that it is 1 for the final repeat.  Facilitates
 *                 acceleration when > 1, & deceleration when < 1. (Default 1)
 */
constructor(public _eventSeries : Array<any>, public _nRepeats = 1, public _initialWallclockProrating = 1.0)
```
### Series Queue

## Attaching to Mesh

## Example
Testing of hosting of actual scenes, completely on GitHub
[example](https://raw.githubusercontent.com/BabylonJS/Extensions/master/POV/tester.html)

## Advanced Features
### Action System Integration
Separate from placing a `BABYLON.Action` inside of an `EventSeries`, you can also have a wrapper `Action` for an `EventSeries`.  `SeriesAction` could then be registered with an `ActionManager`.
```typescript
/**
 * @param {any} triggerOptions - passed to super, same as any other Action
 * @param {SeriesTargetable} _target - The object containing the event queue.  Using an interface for MORPH sub-classing.
 * @param {EventSeries} _eSeries - The event series that the action is to submit to the queue.
 * @param {boolean} condition - passed to super, same as any other Action
 */
constructor(triggerOptions: any, private _target: SeriesTargetable, private _eSeries : EventSeries, condition?: BABYLON.Condition);
```
### Synchronized movement between meshes
Different meshes can move in coordination with each other.  A `MotionEvent` of each is said to be a sync partner of the other.  Using this can cause hangs unless the `EventSeries` of each is queued on each mesh at the same time.

The sync partner of a `MotionEvent` cannot be part of the constructor, since how would the partner of the first to be instanced be passed?  After construction, the `setSyncPartner` function of each is then called:
```typescript
/**
 * @param {MotionEvent} syncPartner - MotionEvent which should start at the same time as this one.
 */
public setSyncPartner(syncPartner : MotionEvent) : void{
```
### Non-Linear Pacing
### Series Level Acceleration-Deceleration
## Up Coming Features for Version 1.1
The first new feature is a method to clear what the mesh is currently doing and or clear what is queued to do next.  

The second is to integrate optional `BABYLON.Sound` to start playing at the beginning of a `MotionEvent`.  Timing of audio to motion is very often important to make things believable.  The `BABYLON.Sound` object is passed in the `MotionEvent` constructor.  When the `MotionEvent` is activated by the before-renderer,  the sound will be checked if it is ready to play.  If not, the event will enter a wait state until the frame that the sound indicates ready.  Should a sound be part of an event that is stopped, the playing will also be stopped.
