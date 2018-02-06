module BABYLON {

  /*************************
   * HARDWARE DETECTION
   ************************/

  // hardware :
  export class UserInfos {

      // device type
      public deviceType: string | 'smartPhone' | 'tablet' | 'noteBook' | 'computer | console' = BABYLON.UserInfos._devicesDetection();

      // device name :
      public device: string;

      // is mobile ?
      public isMobile: boolean = BABYLON.UserInfos._isMobile();

      // mobile name :
      public mobile: string;

      // is smartphone ?
      public isSmartphone: boolean;

      // smartphone name:
      public smartphone: string;

      // is tablet ?
      public isTablet: boolean;

      // tablet name:
      public tablet: string;

      // is dedicated GPU ?
      public isDedicatedGPU : boolean;

      // gpu name
      public gpu : string;

      // browser name
      public browser : string;

      // operating system name
      public OS : string;



      // regexs for device name
      public devicesRegex : Array<RegExp> = [

          // consoles
          /(ouya)/i, // ouya
          /(nintendo)/i, // nintendo
          /(playstation)/i, // playstation
          /(xbox)/i, // xbox

          // tablets
          /(ipad)/i, // ipad
          /(android).+(tablet|tab)|(tablet|tab).+(android)/i, // tablet android
          /(tablet)/i, // general tablet

          // smartphones
          /(iphone|ipod)/i, // iphone/ipod
          /(blackberry)/i, // BlackBerry
          /(android).+(phone)|(phone).+(android)/i, // smartphones android
          /(phone)/i, // general smartPhone

          // mobiles : smartphone or tablet
          /(android)/i, // android
      ]

      // regexs for browser name
      public browsersRegex : Array<RegExp> = [
          /(mobile|tablet|tab).+(safari)\//i, // safari mobile
          /(safari)\//i, // safari

          /(crmo|crios)\/|(mobile|tablet|tab|phone)+(chrome)\//i, // chrome mobile
          /(chrome)\//i, // chrome

          /(fxios)\/|(mobile|tablet|tab|phone).+(firefox)\//i, // firefox mobile
          /(firefox)\//i, // firefox

          /(opios|opr)\/|(mobile|tablet|tab|phone).+(opera)\//i, // opera mobile
          /(opera)\//i, // opera

          /(edge)\//i, // edge
          /(msie|ms|ie|trident)\//i // ie
      ]

      // regexs for operating system (os) name
      public osRegex : Array<RegExp> = [
          /(microsoft|windows)/i, // windows
          /(cros)\s/i, // chromium
          /(iphone|ipad|ipod)/i, // ios
          /(macintosh|mac)/i, // mac

          /\(.+(android)/i, // android
          /\(.+(linux)/i, // linux
          /(blackberry)/i, // blackberry
          /(firefox)/i, // firefox
      ]

      // TODO : take first () : \((.*(Android)[^\)]+)\)

      // regexs for operating system (os) name
      public gpuRegex : Array<RegExp> = [

          /(nvidia|geforce|quadro|titan)/i, // nvidia
          /(amd|radeon|ati)/i, // amd
          /(intel)/i, // intel
      ]


      // is there a dedicated GPU
      public static _isDedicatedGPU (engine : Engine) : boolean {
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
      public static _isDevices(devices : Array<string>) : boolean {
          var userAgent = navigator.userAgent;
          return this._refDetection(userAgent, devices);
      }

      // detectMobile
      public static _isMobile() : boolean {
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
      public static _devicesDetection() : string | 'smartPhone' | 'tablet' | 'noteBook' | 'computer' {

          // get screen size
          var screenWidth = screen.height,
              screenHeight = screen.width,
              size = Math.max(screenWidth, screenHeight),
              userAgent = navigator.userAgent,
              isMobile = this._isMobile(),
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
      public static _getBenchmarkScore (engine : Engine) : number{
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
