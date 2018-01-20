/// <reference path="../queue/TimelineControl.ts"/>

// this is relies on gif.js & from https://github.com/jnordberg/gif.js
var GIF: any;

module QI {
   export class GifMaker {
       private _session : any;
       
       public width : number;
       public height : number;
       
       private _screenshotCanvas: HTMLCanvasElement;
       
       private _endTime : number;
       private _framesSoFar = 0;
       private _delay : number;
       
       constructor(public engine : BABYLON.Engine, millis : number, public frameRate = 24) {
           this._delay = parseInt((1000 / this.frameRate).toFixed(0));
           var canvas = engine.getRenderingCanvas();
           this.width = canvas.width;
           this.height = canvas.height;
           console.log("width " + this.width + " height " + this.height + " delay " + this._delay); 
           
           var scene = engine.scenes[0];
           this._session = new GIF({
               workers: 2,
               quality: 10,
               width: this.width,
               height: this.height,
               transparent: this.toHex(scene.clearColor),
               debug: true
           });
           
           this._session.on('finished', function(blob) {
               console.log("finsihed"); 
           
               window.open(URL.createObjectURL(blob));
            });
           
           console.log(" color        " + this.toHex(scene.clearColor));
                      
           // switch to fixed frame rate of 24
           TimelineControl.change(false, this.frameRate);
           TimelineControl.gifMaker = this;
           this._endTime = TimelineControl.Now + millis;
       }
       
       public addFrame() {
           console.log("end time: " + this._endTime + ", now " + TimelineControl.Now);
           
           if (this._endTime > TimelineControl.Now) {
               this._session.addFrame(this.DumpFramebuffer(), {delay: this._delay });
  
           } else {
               this._session.render();
               TimelineControl.change(true);
               TimelineControl.gifMaker = null;               
           }
       }
       
       //8355711
       public toHex(color : BABYLON.Color4): number {
            var intR = (color.r * 255) | 0;
            var intG = (color.g * 255) | 0;
            var intB = (color.b * 255) | 0;
            var intA = (color.a * 255) | 0;
           console.log("x" + BABYLON.MathTools.ToHex(intR) + BABYLON.MathTools.ToHex(intG) + BABYLON.MathTools.ToHex(intB) );
            return parseInt("" + BABYLON.MathTools.ToHex(intR) + BABYLON.MathTools.ToHex(intG) + BABYLON.MathTools.ToHex(intB), 16 );
        }

       /**
        * Almost the same as BABYLON.Tools.DumpFramebuffer(), except no need to encode
        */
        public DumpFramebuffer(): ImageData {
            // Read the contents of the framebuffer
            var numberOfChannelsByLine = this.width * 4;
            var halfHeight = this.height / 2;

            //Reading datas from WebGL
            var data = this.engine.readPixels(0, 0, this.width, this.height);

            //To flip image on Y axis.
            for (var i = 0; i < halfHeight; i++) {
                for (var j = 0; j < numberOfChannelsByLine; j++) {
                    var currentCell = j + i * numberOfChannelsByLine;
                    var targetLine = this.height - i - 1;
                    var targetCell = j + targetLine * numberOfChannelsByLine;

                    var temp = data[currentCell];
                    data[currentCell] = data[targetCell];
                    data[targetCell] = temp;
                }
            }

            // Create a 2D canvas to store the result
            if (!this._screenshotCanvas) {
                this._screenshotCanvas = document.createElement('canvas');
            }
            this._screenshotCanvas.width = this.width;
            this._screenshotCanvas.height = this.height;
            var context = this._screenshotCanvas.getContext('2d');

            // Copy the pixels to a 2D canvas
            var imageData = context.createImageData(this.width, this.height);
            var castData = <any>(imageData.data);
            castData.set(data);
            context.putImageData(imageData, 0, 0);
            
            return imageData;
        }
   } 
}