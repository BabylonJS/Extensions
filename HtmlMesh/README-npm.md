# HTML Mesh

## Introduction
The HTML Mesh is a [BabylonJS](https://babylonjs.com) mesh that displays a webpage (or DOM element) 
in the scene, meaning that it can occlude other meshes and be occluded by other meshs. 

[Online Demo](https://codesandbox.io/p/sandbox/babylon-html-mesh-demo-862gh5)

[BabylonJS Playground](https://www.babylonjs-playground.com/#Y2LIXI#15).

[BabylonJS HtmlBox Playground](https://playground.babylonjs.com/#B17TC7#44).  

The following uses cases are supported by the HtmlMesh
* Add instructional content/video to a 3D scene.
* Allow users in a 3D scene to fill out a form or respond to a poll.
* Display an in-app browser so a user can take some action, e.g. sign up for an account, purchase something, join an email list without leaving the experience.
* Create a rich UI that can leverage all of the capabilities of CSS and can be driven through a CMS

Note that the use of HtmlMesh requires that the experience be accessed through a browser so in it's
current form, this will not work in native apps or in XR.  If constructed outside of a browser context, the
HtmlMesh instances will not have any geometry and will be disabled.  In the future, it might make sense to 
have them appear with placeholder content of perhaps even an option to view the raw HTML in a popup UI.

By default the HtmlMesh will capture pointer events as soon as the pointer enters.  This is to facilitate the user's ability to interact with the site content without requiring an extra click or some other gesture.  Note that pointer capture won't occur when a camera zoom causes the pointer to be over the mesh.  This is to allow zooming in and out of the scene without the mesh capturing the pointer and preventing zoom as soon as the pointer enters.  This behavior can be disabled as described in the [pointer capture](#pointer-capture) section below, in which case you will need to provide a mechanism to trigger poiitner capture and release in your code.

## npm
```shell
npm install babylon-htmlmesh --save
```

## peer dependencies
This package depends on BabylonJS, specifically the Core ES6 Supported package `@babylonjs/core`.  This is done to support apps that are taking advantage of dependency optimization to reduce the size of the included BabylonJS dependencies.  See the documentation for [BabylonJS ES6 Support](https://doc.babylonjs.com/setup/frameworkPackages/es6Support) for details.  Note that it will not work if your app is using the legacy `babylonjs` package.  If this is an issue, please create an issue on github and I'll look into creating a legacy compatible version.

## Usage
The first step is to create an instance of `HtmlMeshRenderer`.  Pass this the scene, and optionally an options object containing:
* `containerId` - An optional id of the parent element for the elements that will be rendered as `HtmlMesh` instances.
* `defaultOpaqueRenderOrder` - an optional render order function that conforms to the interface of the `opaqueSortCompareFn` as described in the documentation for [`Scene.setRenderingOrder`](https://doc.babylonjs.com/typedoc/classes/BABYLON.Scene#setRenderingOrder) to be used as the opaque sort compare for meshes that are not an instanceof `HtmlMesh` for group 0.  See [Rendering Order Impacts](#rendering-order-impacts) for more details.
* `defaultAlphaTestRenderOrder` - an optional render order function that conforms to the interface of the `alphaTestSortCompareFn` as described in the documentation for [`Scene.setRenderingOrder`](https://doc.babylonjs.com/typedoc/classes/BABYLON.Scene#setRenderingOrder) to be used as the alpha test sort compare for meshes that are not an instanceof `HtmlMesh` for group 0.  See [Rendering Order Impacts](#rendering-order-impacts) for more details.
* `defaultTransparentRenderOrder` - an optional render order function that conforms to the interface of the `transparentCompareFn` as described in the documentation for [`Scene.setRenderingOrder`](https://doc.babylonjs.com/typedoc/classes/BABYLON.Scene#setRenderingOrder) to be used as the transparent sort compare for meshes that are not an instanceof `HtmlMesh` for group 0.  See [Rendering Order Impacts](#rendering-order-impacts) for more details.

Next, create the DOM element for your content.  This can be any HTML element though most of the time, it should either be a `div` for DOM content in the same app, or an `iframe` for external dom content.  You should not add this element to your document; `HtmlMesh` will do this for you.  Set any attribute and style values that you want; however, be advised that the width and height styles will be replaced by the `HtmlMesh`.  

One thing to be aware of is that the way the scale is determined can sometimes result in the elment being larger than the mesh if the mesh has a substantal difference in the world min and max z values.  If this is the case, you may want to wrap your element in an outer div that is a bit larger with a background color.  This will ensure that any gaps between the mesh and the element are filled with the background color and the user can access the entire portion of the element that needs to be accessible.  A future update may add suport for this to `setContent`. 

Finally, call `setContent` passing in the element and the mesh width and height in BabylonJS units.  Be advised that any scaling done after `setContent` will not be preserved on the next call to `setContent`.  You should grab any scaling you want preserved and pass the scale values through `setContent`.  See [Scaling `HtmlMesh` Instances](#scaling-htmlmesh-instances) for an expalantion on why this is the case.  You can set attributes and styles after calling `setContent` using a query selector on the id.  The `HtmlMesh` can be positioned, oriented, parented, shown or hidden like any other mesh.  You can even use pointer drag behavior and gizmos to allow users to position and move the mesh, subject to the caveats of scaling below.

```javascript
import { Scene } from '@babylonjs/core/scene';
import { Engine } from '@babylonjs/core/Engines/engine';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { ActionManager } from '@babylonjs/core/Actions/actionManager';
import { ExecuteCodeAction } from '@babylonjs/core/Actions/directActions';
import { Color4 } from '@babylonjs/core/Maths/math.color';
import '@babylonjs/core/Helpers/sceneHelpers';

import { HtmlMeshRenderer } from './src/html-mesh-renderer';
import { HtmlMesh } from './src/html-mesh';

let engine;
let scene;

const createScene = () => {
    const canvas = document.querySelector('canvas');
    engine = new Engine(canvas, true);
    
    // This creates a basic Babylon Scene object (non-mesh)
    scene = new Scene(engine);
    
    // It is critical to have a transparent clear color for HtmlMesh to work.
    scene.clearColor = new Color4(0,0,0,0);
    
    scene.createDefaultCameraOrLight(true, true, true);
    scene.activeCamera.radius = 20;

    // Create the HtmlMeshRenderer
    const htmlMeshRenderer = new HtmlMeshRenderer(scene);

    // Shows how this can be used to include html content, such
    // as a form, in your scene.  This can be used to create
    // richer UIs than can be created with the standard Babylon
    // UI control, albeit with the restriction that such UIs would
    // not display in native mobile apps or XR applications.
    const htmlMeshDiv = new HtmlMesh(scene, "html-mesh-div");
    const div = document.createElement('div');
    div.innerHTML = `
        <form style="padding: 10px; transform: scale(4); transform-origin: 0 0;">
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" required><br><br>
            
            <label for="country">Country:</label>
            <select id="country" name="country">
                <option value="USA">USA</option>
                <option value="Canada">Canada</option>
                <option value="UK">UK</option>
                <option value="Australia">Australia</option>
            </select><br><br>
            
            <label for="hobbies">Hobbies:</label><br>
            <input type="checkbox" id="hobby1" name="hobbies" value="Reading">
            <label for="hobby1">Reading</label><br>
            <input type="checkbox" id="hobby2" name="hobbies" value="Gaming">
            <label for="hobby2">Gaming</label><br>
            <input type="checkbox" id="hobby3" name="hobbies" value="Sports">
            <label for="hobby3">Sports</label><br><br>
        </form>
    `;
    div.style.backgroundColor = 'white';
    div.style.width = '480px';
    div.style.height = '360px';
    // Style the form
    
    htmlMeshDiv.setContent(div, 4, 3);
    htmlMeshDiv.position.x = -3;
    htmlMeshDiv.position.y = 2;

    // Shows how this can be used to include a PDF in your scene.  Note this is 
    // conceptual only.  Displaying a PDF like this works, but any links in the
    // PDF will navigate the current tab, which is probably not what you want.
    // There are other solutions out there such as PDF.js that may give you more
    // control, but ultimately proper display of PDFs is not within the scope of
    // this project.
    const pdfUrl = 'https://cdn.glitch.com/3da1885b-3463-4252-8ded-723332b5de34%2FNew_Horizons.pdf#zoom=200?v=1599831745689'
    const htmlMeshPdf = new HtmlMesh(scene, "html-mesh-pdf");
    const iframePdf = document.createElement('iframe');
    iframePdf.src = pdfUrl;
    iframePdf.width = '480px';
    iframePdf.height = '360px';
    htmlMeshPdf.setContent(iframePdf, 4, 3);
    htmlMeshPdf.position.x = 3;
    htmlMeshPdf.position.y = 2;

    // Shows how this can be used to include a website in your scene
    const siteUrl = 'https://www.babylonjs.com/';
    const htmlMeshSite = new HtmlMesh(scene, "html-mesh-site");
    const iframeSite = document.createElement('iframe');
    iframeSite.src = siteUrl;
    iframeSite.width = '480px';
    iframeSite.height = '360px';
    htmlMeshSite.setContent(iframeSite, 4, 3);
    htmlMeshSite.position.x = -3;
    htmlMeshSite.position.y = -2;
    
    // Shows how this can be used to include a YouTube video in your scene
    const videoId = 'zELYw2qEUjI';
    const videoUrl = [ 'https://www.youtube.com/embed/', videoId, '?rel=0&enablejsapi=1&disablekb=1&controls=0&fs=0&modestbranding=1' ].join( '' );
    const htmlMeshVideo = new HtmlMesh(scene, "html-mesh-video");
    const iframeVideo = document.createElement('iframe');
    iframeVideo.src = videoUrl;
    iframeVideo.width = '480px';
    iframeVideo.height = '360px';
    htmlMeshVideo.setContent(iframeVideo, 4, 3);
    htmlMeshVideo.position.x = 3;
    htmlMeshVideo.position.y = -2;
};

const startRenderLoop = () => {
    engine.runRenderLoop(() => {
        scene.render();
    });
};

createScene();
startRenderLoop();
```

## Scaling `HtmlMesh` Instances
In order to keep the dom content and mesh size synched, the dom content size will be adjusted avery frame using CSS transforms to match the mesh.  This means that if the mesh is scaled (using, say, a bounding box gizmo) the content will be scaled as well.  Since the content is set after the mesh is created, the mesh initially starts as a place of size 1.  Once the content is set, we need to scale the mesh to match.  We can't just scale the mesh, because that would then scale the content.  So we compute a scaling transform, and we bake it into the mesh vertices, effectively rewriting the mesh size.  We also store an inverse scale matrix that can back out the scale.  The next time `setContent` is called, we will back the scale out to bring the mesh back to 1 and then compute a new scale transform (and inverse) and bake it into the mesh vertices.  The consequence of this is that any scaling applied (via, say, the bounding box gizmo) will be reverted on the next call to `setContent`.  So if you are storing info to recreate HtmlMesh instances on a server, you will want to make sure that you update the original size with any scaling changes so the next time you call setContent, they will be preserved.

## Rendering Order Impacts
In order to ensure that the HtmlMeshes render before other meshes (so that the HtmlMesh is properly occluded by meshes that are closer to the camera), the HtmlMeshRenderer will set the rendering order for group 0.  If your application sets a custom opaque, alpha test, or transparent rendering order for group 0, you must set the rendering order via the HtmlMeshRenderer constructor.  If you do not, then your render order will be overwritten if the HtmlMeshRenderer is created after and the HtmlMeshes will not be properly occluded by other meshes if the HtmlMeshRenderer is created before.  I realize this is not ideal, but any solution for trying to force the html meshes to render first is going to impact either rendering order, the allocation of meshes to rendering groups, or the assignment of material ids (and that would be defeated if a custom render order function is used) and setting the render order seemed to be the least bad option.

## Pointer Capture
An HtmlMesh instance can be configured to automatically capture the pointer on entry.  This allows for "one-click" behavior where the user can interact directly with the content.  For example, the user can click the play button directly on a YouTube video.  Iframes are problematic, however; because we cannot detect pointer movement within a cross-origin iframe (an iframe that originates from a different site than the one that is hosting it).  Simply put, we can capture the pointer, but releasing it requires that the pointer leaves the iframe completely.  This requirement means that we cannot detect when the pointer is over a mesh that is in front of the HtmlMesh containing the iframe; only when the pointer has fully left the iframe will the pointer be detected.  In practice, since BabylonJS relies on pointer events on the canvas, this means that no actions, pointer obeservables, or scene picking will work correctly if the pointer entered the iframe first until the pointer has left the iframe.  Therefore, if you have mesh content that needs to be pickable (respond in some way to pointer events) that could potentially be in front of an HtmlMesh containing an iframe (either due to camera orientation of movement of the either mesh), we recommend one of the following:
1.  If the geometry of the mesh is fairly predictable, you can create a pointer mask using an SVG element that sits over the iframe and aligns with the projection of the occluding mesh to the screen.  By setting pointer events on this mask to `fill` it will cause the pointermove listener on the document to start getting pointer events again when the pointer moves over the mask, which will allow the ray detection to determine that the mesh is in front of the HtmlMesh hosting the iframe and it will release the pointer.  Note that you will need to compute CSS transforms for the mask in order to skew it to match the mesh it is masking as the camera rotates.  I may add a PointerEventMaskBehavior at some point to generalize this concept.
2.  If creating and maintaining a mask is not practical, then you can disable the auto pointer capture on the HtmlMesh using `disableAutomaticPointerCapture`.  When automatic pointer capture is disabled, the pointer capture must be initiated by calling `capturePointer` and released by calling `releasePointer`.  This can be done in response to whatever gesture seems appropriate such as clicking of double clicking the HtmlMesh.

You may also want to disable automatic pointer capture if allowing a user to edit an HtmlMesh, e.g. using a gizmo or pointer drag behavior.

## Text Quality
The HtmlMesh takes measures to provide the best possible text quality.  Specifically, it makes the content as large as possible to fit within the screen and then scales it down to fit the mesh at the current zoom, and it turns off backface rendering for the HtmlContent (which can cause some aliasing).  However, the biggest contributor to poor text quality when using CSS transfroms is subpixel rendering.  This occurs when the content is sized and positioned over a partial pixel.  When rendering normally, this is avoided by always choosing even numbers of pixels for the size of the content and always making sure that any positioning attributes (such as top, left, padding, etc...) are whole pixel values.  Unfortunately, when using CSS transforms, as soon as perspective is added (even if the camera is not rotated), the transform could result in subpixel rendering.  Once rotation is allowed it is gauranteed that subpixel rendering will occur at some point.  This effect can be noticed when viewing the example as soon as the camera moves off of a +z orientation as the shimmering of the text in the PDF and the BJS site.  The effect is much less pronounced with larger text sizes.

## PDF Content
PDFs can be displayed in scene using HtmlMesh.  Aside from the text quality issue noted above, PDFs with embedded links will navigate the current tab/window when one of the links is selected.  Sandboxing the iframe can prevent sites from navigating the current tab/window, but on Chrome sandboxed iframes cannot load PDFs.  