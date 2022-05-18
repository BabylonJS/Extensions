import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Color4, Vector3 } from "@babylonjs/core/Maths/math";
import { VideoDome } from "@babylonjs/core/Helpers/videoDome";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import "@babylonjs/core/Helpers/sceneHelpers";

import "./amp-360video.css";
import { WebXRExperienceHelper } from "@babylonjs/core/XR/webXRExperienceHelper";

/**
 * BabylonJS 360/VR
 */
(function (vjs: any) {
  var extend = function (obj /*, arg1, arg2, ... */) {
      var arg, i, k;
      for (i = 1; i < arguments.length; i++) {
        arg = arguments[i];
        for (k in arg) {
          if (arg.hasOwnProperty(k)) {
            obj[k] = arg[k];
          }
        }
      }
      return obj;
    },
    defaults = {
      enableVR: true,
      fov: 1.18,
      defaultCameraOrientationX: 0,
      defaultCameraOrientationY: -Math.PI / 2,
      disableWebGL2Support: false,
      hardwareScalingLevel: 1,
      videoType: "monoscopicPanoramic",
    },
    plugin = function (pluginOptions) {
      var player = this;
      var settings = (extend as any)({}, defaults, pluginOptions || {});
      var videoEl = this.el().getElementsByTagName("video")[0];
      var vrButtonElement;
      var toggleWebVR = null;
      var isInVRMode = false;

      var addBeforeFullScreen = function (controlBar, element, name) {
        if (controlBar.fullscreenToggle) {
          var fst = controlBar.fullscreenToggle.el();
          if (fst) {
            fst.parentElement.insertBefore(element, fst);
          }
        }
      };

      var addToggle = function (controlBar, text, css, callback) {
        var Button = vjs.getComponent("Button");
        var button = vjs.extend(Button, {
          constructor: function () {
            Button.apply(this, arguments);
          },
          textContent: text,
          handleClick: function () {
            callback();
          },
          buildCSSClass: function () {
            return css + " " + Button.prototype.buildCSSClass.call(this);
          },
        });
        var childName = text + "Toggle";
        vjs.registerComponent(childName, button);
        controlBar[childName] = player
          .getChild("controlBar")
          .addChild(childName, {});

        player.ready(function () {
          addBeforeFullScreen(
            controlBar,
            controlBar[childName].el(),
            childName
          );
        });
        vrButtonElement = controlBar[childName].el();
      };

      var initScene = function () {
        // Creates the canvas
        var renderedCanvas = document.createElement("canvas");
        renderedCanvas.className = "vjs-tech";
        videoEl.parentElement.insertBefore(renderedCanvas, videoEl);
        videoEl.style.display = "none";

        // Creates the default babylonjs scene
        var engine = new Engine(renderedCanvas, true, {
          disableWebGL2Support: settings.disableWebGL2Support,
        });

        // Workaround http://localhost:8080/indexCode.html
        engine.getCaps().vertexArrayObject = false;
        var scene = new Scene(engine);

        const camera = new ArcRotateCamera("camera", 0, Math.PI / 2, 10, new Vector3(0, 0, 0), scene);
        camera.attachControl();

        // Set the hardware scaling level
        const scaling = Math.max(
          settings.hardwareScalingLevel,
          1 / (window.devicePixelRatio || 4)
        );
        engine.setHardwareScalingLevel(scaling);

        // Helps reducing the needed number of draw calls
        scene.renderTargetsEnabled = false;
        scene.clearColor = new Color4(0, 0, 0, 1);
        scene.onPointerObservable.add(function () {
          player.userActive(true);
        });

        // No need of clear or depth buffer as it is a 360 video only
        scene.autoClear = false;
        scene.autoClearDepthAndStencil = false;
        engine.setDepthBuffer(false);

        // Creates the 360 video
        var dome = new VideoDome(
          "testdome",
          videoEl,
          { autoPlay: false, size: 2000 },
          scene
        );
        dome.rotation.x = -settings.defaultCameraOrientationX;
        dome.rotation.y = -settings.defaultCameraOrientationY;

        var xrHelper: WebXRExperienceHelper;
        if (settings.enableVR) {
          WebXRExperienceHelper.CreateAsync(scene).then(function (helper) {
            xrHelper = helper;
          });

          // VR Switch function.
          toggleWebVR = function () {
            if (!isInVRMode) {
            //   player.controls(false);
              xrHelper && xrHelper.enterXRAsync("immersive-vr", "local-floor");
            } else {
              xrHelper && xrHelper.exitXRAsync();
            }
          };

          if (vrButtonElement) {
            vrButtonElement.addEventListener("click", toggleWebVR);
          }
        }

        // Adapt the camera to the requested settings.
        scene.activeCamera.fov = settings.fov;

        // Adapt the video type to the requested one.
        if (settings.videoType === "stereoscopicSideBySide") {
          dome.videoMode = VideoDome.MODE_SIDEBYSIDE;
        } else if (settings.videoType === "stereoscopicTopBottom") {
          dome.videoMode = VideoDome.MODE_TOPBOTTOM;
        } else {
          // Default to monoscopicPanoramic
          dome.videoMode = VideoDome.MODE_MONOSCOPIC;
        }

        // Resize
        window.addEventListener("resize", function () {
          engine.resize();
        });

        // And finally starts the render loop
        engine.runRenderLoop(function () {
          scene.render();
        });
      };

      if (settings.enableVR) {
        addToggle(player.controlBar, "WebVr", "vjs-webvr-control", function () {
            // no-op
        });
      }

      this.ready(function () {
        initScene();
      });
    };

  // register the plugin with video.js
  vjs.plugin("threeSixty", plugin);
})(window.amp);
