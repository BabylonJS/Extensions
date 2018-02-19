module BABYLON {

  /*************************
   * USER INFORMATIONS :
   * detect software and hardware
   ************************/

  // REGEX :
  // read this :
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent
  // https://developers.whatismybrowser.com/useragents/explore/
  // https://github.com/faisalman/ua-parser-js/blob/master/src/ua-parser.js
  // http://screensiz.es/



  // Mozilla/5.0   (X11; Linux x86_64)   AppleWebKit/537.36   (KHTML, like Gecko)   Chrome/44.0.2403.157 Safari/537.36
  // --- 1.a ---   ------- 1.b -------   ------- 2.a ------   ------- 2.b -------   --------------- 3 ----------------
  //
  // 1.a : product + version
  // 1.b : system-information ( like os + version )
  // 2.a : platform : layout engine
  // 2.b : platform detail ( optional )
  // 3   : browser or software + version ( commentaire libre )

  // 1.a : /[^\(]+/i                                        | match : "Mozilla/5.0 "
  // 1.b : /(\([^\(][^\)]*\))/i                             | match : "(X11; Linux x86_64)"
  // 2.a : /[\)](\s\w+\/[0-9a-z\.]+)/i                      | match : ") AppleWebKit/537.36"
  // 2.b : /[\)]\s(\w+\/[0-9a-z\.]+)(\s\([^\(\)]+\))/i      | match : ") AppleWebKit/537.36 (KHTML, like Gecko)"
  // 3   : /(\s\w+\/[0-9a-z\.]+){1,3}$/i                    | match : " Chrome/44.0.2403.157 Safari/537.36"

  // capture all with one regex :
  // /([^\(]+)?\(([^\)]*)[\)]\s?([a-z0-9]*\/[0-9a-z\.]+)?\s?\(?(?:([^\)]*)?[\)])?\s?((?:.*\/?[0-9a-z\.]+\s?)*)?/i
  // Work great but some useragent have bracket in bracket.

  // Conclusion :
  // there is too much possibilities to split userAgent.
  // Work fine with a big part of userAgent exept some exeption



  export class UserInfosReport {

      // navigator.userAgent
      public userAgent: string = null;

      // device type
      public deviceType: string | 'smartPhone' | 'tablet' | 'noteBook' | 'computer' | 'console' | 'tv' = 'computer';

      // is smartphone ?
      public isSmartphone: boolean = false;

      // is tablet ?
      public isTablet: boolean = false;

      // is notebook ?
      public isNotebook: boolean = false;

      // is computer ?
      public isComputer: boolean = false;

      // is console ?
      public isConsole: boolean = false;

      // is tv ?
      public isTv: boolean = false;

      // browser name
      public software : string = null;

      // browser name
      public softwareVersion : string = null;

      // operating system name
      public os : string = null;

      // operating system name
      public osVersion : string = null;

      // operating system name
      public layout : string = null;

      // operating system name
      public layoutVersion : string = null;

  }


  export class UserInfos {

      // navigator.userAgent
      public static report: UserInfosReport = UserInfos._report();



      // return a report of user agent
      private static _report() : UserInfosReport {

              // create new report
          var report = new BABYLON.UserInfosReport(),
              deviceKey,

              // get user agent
              userAgent = navigator.userAgent,

              // detect system
              system = this.detectSystem(),

              // detect software
              software = this.detectSoftware(),

              // detect layout engine
              layout = this.detectLayout(),

              // detect device
              device = this.detectDevice();


          report.userAgent = userAgent;
          report.os = system[0];
          report.osVersion = system[1];
          report.layout = layout[0];
          report.layoutVersion = layout[1];
          report.software = software[0];
          report.softwareVersion = software[1];

          deviceKey = 'is' + device[0].substr(0, 1).toUpperCase() + device[0].substr(1);

          report[deviceKey] = true;

          return report;
      }

      // detect device type
      // return [type]
      public static detectDevice(): [string] {

          var useragent = navigator.userAgent,
              result;

          // console
          result = this.match(useragent, /(ouya|nintendo|playstation|xbox)/i, ['console']);
          if (result) {
              return result;
          }

          // smartphone
          result = this.match(useragent, /(mobi|phone|ipod|mini)/i, ['smartphone']);
          if (result) {
              return result;
          }

          // tablet
          result = this.match(useragent, /(tab|ipad)/i, ['tablet']);
          if (result) {
              return result;
          }

          // tv
          result = this.match(useragent, /(tv)/i, ['tv']);
          if (result) {
              return result;
          }

          // ---> try with the screen size if type is undefined
          var screenW = window.screen.width,
              screenH = window.screen.height,
              size = Math.max(screenW, screenH);

          // try to catch if it's a mobile or not
          result = this.match(useragent, /(android|ios)/i, ['mobile']);
          if (result) {
              if (screenW < 1024 && screenH < 768) {
                  return ["smartphone"];
              }
              else {
                  return ["tablet"];
              }
          }

          // else try with the screen size
          if (size < 768) {
              return ["smartphone"];
          }
          else if (size < 1025) {
              return ["tablet"];
          }
          else if (size < 1366){
              return ["notebook"];
          }

          // else return default : computer
          else {
              return ["computer"];
          }

      }

      // get engine layout and version
      // return [name, version]
      public static detectLayout(): [string, string] {

          var useragent = navigator.userAgent,
              result;

          // EdgeHTML :
          result = this.match(useragent, /(edge)\/?([0-9\.]+)?/i, ['edgeHTML', 2]);
          if (result) {
              return result;
          }

          // Presto :
          result = this.match(useragent, /(presto)\/?([0-9\.]+)?/i, ['presto', 2]);
          if (result) {
              return result;
          }

          // WebKit | Trident | Netfront :
          result = this.match(useragent, /(webKit|trident|netfront)\/?([0-9\.]+)?/i, [1, 2]);
          if (result) {
              return result;
          }

          // KHTML :
          result = this.match(useragent, /(KHTML)\/?([0-9\.]+)?/i, ['KHTML', 2]);
          if (result) {
              return result;
          }

          // Gecko :
          result = this.match(useragent, /.*[rv:]([0-9]\.+)?.*(Gecko)/i, ['gecko', 1]);
          if (result) {
              return result;
          }

          return null;
      }

      // get OS + version if possible
      // return [name, version]
      public static detectSystem(): [string, string]{

          var useragent = navigator.userAgent,
              result;

          // windows :
          result = this.match(useragent, /(windows)\snt\s([0-9\.]+)/i, ['windows', 2]);

          // get version with "nt x.x"
          if (result && result[1]) {
              switch (result[1]) {
                  // xp
                  case '5.1' || '5.2':
                      result[1] = 'xp';
                      break;

                  // vista
                  case '6.0':
                      result[1] = 'vista';
                      break;

                  // 7
                  case '6.1':
                      result[1] = '7';
                      break;

                  // 8
                  case '6.2':
                      result[1] = '8';
                      break;

                  // 8.1
                  case '6.3':
                      result[1] = '8.1';
                      break;

                  // 10
                  case '10.0':
                      result[1] = '10';
                      break;

                  default :
                      result[1] = null;
                      break;
              }
          }
          if (result) {
              return result;
          }

          // chromium :
          result = this.match(useragent, /\s(cros)\s/i, ['chromium', null]);
          if (result) {
              return result;
          }

          // ios :
          result = this.match(useragent, /(fxios|opios|crios|iphone|ipad|ipod).*\sos\s([0-9_\.]+)/i, ['ios', 2]);
          if (result && result[1]) {
              result[1] = result[1].replace(/\_/g, '.');
          }
          if (result) {
              return result;
          }

          // mac :
          result = this.match(useragent, /(macintosh|mac)\sos\sx\s([0-9_\.]+)/i, ['mac', 2]);
          if (result && result[1]) {
              result[1] = result[1].replace(/\_/g, '.');
          }
          if (result) {
              return result;
          }

          // android :
          result = this.match(useragent, /(android)\s([0-9\.]+)/i, ['android', 2]);
          if (result) {
              return result;
          }

          // linux | blackberry | firefox:
          result = this.match(useragent, /(linux|blackberry|firefox)/i, [1, null]);
          if (result) {
              return result;
          }

          return null;
      }

      // get browser or software name + version
      // return [name, version]
      public static detectSoftware(): [string, string] {

          var useragent = navigator.userAgent,
              result;

          // edge :
          result = this.match(useragent, /(edge)\/([0-9]+)/i, ['edge', 2]);
          if (result) {
              return result;
          }

          // ie < 11 :
          result = this.match(useragent, /(msie)\s([0-9]+)/i, ['ie', 2]);
          if (result) {
              return result;
          }

          // ie 11 :
          result = this.match(useragent, /(trident).*[rv:]([0-9]+)/i, ["ie", 2]);
          if (result) {
              return result;
          }

          // firefox
          result = this.match(useragent, /(firefox|fxios)\/([0-9]+)/i, ["firefox", 2]);
          if (result) {
              return result;
          }


          // opera
          result = this.match(useragent, /(opios|opr|opera)\/([0-9]+)/i, ["opera", 2]);
          if (result) {
              return result;
          }

          // chrome
          result = this.match(useragent, /(crmo|crios|chrome)\/([0-9]+)/i, ["chrome", 2]);
          if (result) {
              return result;
          }

          // safari
          result = this.match(useragent, /Version\/([0-9]+).*(safari)\//i, ["safari", 1]);
          if (result) {
              return result;
          }

          // undefined
          return null;

      }



      private static _splitUserAgent(userAgent: string) : userAgentSplittedI{

          let matches = userAgent.match(/([^\(]+)?\(([^\)]*)[\)]\s?([a-z0-9]*\/[0-9a-z\.]+)?\s?\(?(?:([^\)]*)?[\)])?\s?((?:.*\/?[0-9a-z\.]+\s?)*)?/i);

          return {
              userAgent : userAgent,
              product : matches[1],
              system: matches[2],
              platform: matches[3],
              platformDetails: matches[4],
              software : matches[5]
          };

      }

      // return matches in order you choose.
      // data returned :
      // if string : return string
      // if number : get group in regex matches
      // if data is undefined, return matches
      public static match (str: string, regex : RegExp, data?: Array<string | number>) {

          var result = [],
              matches = str.match(regex);

          if (data && matches) {
              var L = data.length,
                  dataI;

              for (let i = 0; i < L; i++) {
                  dataI = data[i];

                  // if string
                  if (typeof dataI === "string") {
                      result[i] = dataI;
                      continue;
                  }

                  // if number & matches[dataI]
                  if (matches[dataI]) {
                      result[i] = matches[dataI];
                      continue;
                  }

                  result[i] = null;
              }

              return result;
          }

          if (matches) {
              return matches.shift();
          }

          return null;
      }
  }


  export interface userAgentSplittedI {
      'userAgent' : string;
      'product' : string;
      'system' : string;
      'platform' : string;
      'platformDetails' : string;
      'software' : string;
  }

}
