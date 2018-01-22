module BABYLON {

  /*************************
   * HARDWARE DETECTION
   ************************/

  // hardware :
  export class Hardware {

      // is there a dedicated GPU
      public static isDedicatedGPU (engine : Engine) : boolean {
          var GPUs = [
            'amd',
            'nvidia',
            'radeon',
            'geforce'
          ],
          vendor = engine.getGlInfo().renderer;
          return this._refDetection(vendor, GPUs);
      }

      // device exception detection
      public static isDevices(devices : Array<string>) : boolean {
          var userAgent = navigator.userAgent;
          return this._refDetection(userAgent, devices);
      }

      // detectMobile
      public static isMobile() : boolean {
          var userAgent = navigator.userAgent,
              mobiles = [
                'Android',
                'webOS',
                'iPhone',
                'iPad',
                'iPod',
                'BlackBerry',
                'Windows Phone',
                'Phone'
              ];

          return this._refDetection(userAgent, mobiles);
      }

      // device detection
      public static devicesDetection() : string | 'smartPhone' | 'tablet' | 'noteBook' | 'computer' {

          // get screen size
          var screenWidth = screen.height,
              screenHeight = screen.width,
              size = Math.max(screenWidth, screenHeight),
              userAgent = navigator.userAgent,
              isMobile = this.isMobile(),
              regex;

          // SMARTPHONE
          if (isMobile && size < 768) {
              return 'smartPhone';
          }

          // TABLET
          if (isMobile) {
              return 'tablet';
          }

          // NOTEBOOK
          if (size <= 1280) {
              return 'noteBook';
          }

          // computer
          return 'computer';
      }

      // TODO : FUTURE FEATURE : get a benchMark reference for GPU and CPU
      public static getBenchmarkScore (engine : Engine) : number{
          return;
      }

      // regex expression detection
      private static _refDetection (pattern: string, references : Array<string>) : boolean{

          var L = references.length,
              refI,
              regex;

          for (let i = 0; i < L; i++) {

              refI = references[i];

              regex = new RegExp(refI, 'i');

              if( pattern.match(regex)){
                  return true;
              };

          }

          return false;
      }
  }
  
}
