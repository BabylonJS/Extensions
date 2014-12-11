/// <reference path="./EventSeries.ts"/>
/// <reference path="./Mesh.ts"/>
/// <reference path="./Pace.ts"/>
/// <reference path="./ReferenceDeformation.ts"/>
/// <reference path="./ShapeKeyGroup.ts"/>
module MORPH {
    /**
     * @immutable
     * references to the index of a phoneme inside VISEMES
     */
    class Phoneme{
        /**
         * No method class to hold data need to generate a shapekey target cooresponding.  
         * Having a class provides for easier to read .member code.
         * Total # of instance is 40:  39 phonemes + 1 for rest (will be more once MOOD implemented)
         * 
         * @param {number} visemeIdx - Index into row in Sentence.VISEMES array of values of shapekeys to combine.
         * @param {number} durationIdx - Index in Sentence.DURATION array used get how long the phoneme takes (prior to SPEECH_RATE multiplication)
         * @param {MORPH.Pace} pace - How the morph target should be progressed to.  (Currently, always linear)
         */
        constructor(public visemeIdx : number, public durationIdx : number, public pace : Pace = Pace.LINEAR){
             Object.freeze(this);  // make immutable
        }
    }
    
    /**
     * @immutable
     * An individual sentence, precompiled in the constructor.  Allows for multiple sentences to be processed in advance.
     * Todo:  need to leash each instance with the Web Audio associated with it.  Waiting implementation in BJS.
     * Todo:  probably need to rejigger everything to get to work with upcoming MakeHuman release.
     */
    export class Sentence{
        // statics for the names of keys & shape key group (public for Voice Class)
        public static _MOUTH_KEYS = ["OPEN", "WIDE", "UPPER"];
        public static _BASIS = "BASIS";
        public static _MOUTH = "MOUTH";

        // Source: "Preston Blair phoneme series" & Gryff, (public for compiling in Voice Class)
        // each row represents the setting for each of the shape keys:  Open, Wide, & Upper
        public static VISEMES : number[][] = [        
            [1    , 0.52 , 0.267], //  0- A, I
            [0.962, 0    , 0.227], //  1- E
            [1    , 0.840, 0.947], //  2- O
            [1    , 1    , 0    ], //  3- U
            [0.760, 0    , 0    ], //  4- C, D, G, K, N, R, S, Th, Y and Z
            [0    , 0    , 0.360], //  5- F and V (sometimes like D of Th)
            [1    , 0    , 1    ], //  6- L (sometimes like D or Th)
            [0.067, 0.2  , 0.4  ], //  7- M, B, and P
            [0.187, 1    , 0.467], //  8- W
            [0.8  , 0.8  , 0    ], //  9- CH, J, SH, and ZH
            [0    , 0    , 0    ]  // 10- Rest
        ];

         // Phonetic Alphabet, Arpabet, see http://www.speech.cs.cmu.edu/cgi-bin/cmudict
        private static ARPABET_DICT = {
            "." : new Phoneme(10, 0), // rest; durationIdx ignored, SPEECH_RATE used
            "AA": new Phoneme( 0, 1), // VOWEL: hOt, wAnt, bOUGHt, Odd
            "AE": new Phoneme( 0, 1), // VOWEL: At, 
            "AH": new Phoneme( 0, 4), // VOWEL: Up, Alone, hUt
            "AO": new Phoneme( 2, 1), // VOWEL: Off, fAll, frOst, hAUl, drAW
            "AW": new Phoneme( 2, 0), // VOWEL: cOW, OUt, mOUsE, hOUsE
            "AY": new Phoneme( 0, 1), // VOWEL: fInd, rIdE, lIGHt, flY, pIE
            "B" : new Phoneme( 7, 2), // CONS : Big, ruBBer
            "CH": new Phoneme( 9, 1), // CONS : CHip, maTCH
            "D" : new Phoneme( 4, 3), // CONS : Dog, aDD, fillED
            "DH": new Phoneme( 6, 4), // CONS :THis, feaTHer, THen
            "EH": new Phoneme( 0, 2), // VOWEL: bEd, brEAd
            "ER": new Phoneme( 3, 1), // VOWEL: bURn, fIRst, fERn, hEARd, wORk, dollAR
            "EY": new Phoneme( 0, 1), // VOWEL: bAcon, lAtE, dAY, trAIn, thEY, EIght, vEIn
            "F" : new Phoneme( 5, 2), // CONS : Fish, PHone
            "G" : new Phoneme( 4, 3), // CONS : Go, eGG
            "HH": new Phoneme( 0, 4), // CONS : Hot, House
            "IH": new Phoneme( 0, 2), // VOWEL: mIRRor, chEER, nEAR, If, bIg, wIn
            "IY": new Phoneme( 1, 1), // VOWEL: shE, thEsE, bEAt, fEEt, kEY, chIEf, babY
            "JH": new Phoneme( 9, 1), // CONS : Jet ,caGe, barGe, juDGE, Gym
            "K" : new Phoneme( 4, 2), // CONS : Cat, Kitten, duCK, sCHool, oCCur
            "L" : new Phoneme( 6, 2), // CONS : Leg, beLL
            "M" : new Phoneme( 7, 2), // CONS : Mad, haMMer, laMB
            "N" : new Phoneme( 4, 4), // CONS : No, diNNer, KNee, GNome
            "NG": new Phoneme( 4, 1), // CONS : siNG, moNkey, siNk
            "OW": new Phoneme( 2, 1), // VOWEL: nO, nOtE, bOAt, sOUl, rOW
            "OY": new Phoneme( 2, 1), // VOWEL: cOIn, tOY
            "P" : new Phoneme( 7, 4), // CONS : Pie, aPPle
            "R" : new Phoneme( 4, 3), // CONS : Run, maRRy, WRite
            "S" : new Phoneme( 4, 2), // CONS : Sun, mouSE, dreSS, City, iCE, SCienCE
            "SH": new Phoneme( 9, 2), // CONS : SHip, miSSion, CHef, moTIon, speCIal
            "T" : new Phoneme( 4, 4), // CONS : Top, leTTer, sToppED
            "TH": new Phoneme( 4, 3), // CONS : THumb, THin, THing
            "UH": new Phoneme( 2, 3), // VOWEL: bOOk, pUt, cOULd
            "UW": new Phoneme( 2, 2), // VOWEL: hUman, UsE, fEW, tWO
            "V" : new Phoneme( 5, 4), // CONS : Vet, giVe
            "W" : new Phoneme( 8, 3), // CONS : Wet, Win, sWim, WHat
            "Y" : new Phoneme( 1, 2), // CONS : Yes , onIon
            "Z" : new Phoneme( 4, 2), // CONS : Zip, fiZZ, sneeZE, laSer, iS, waS, pleaSE, Xerox, Xylophone
            "ZH": new Phoneme( 9, 1)  // CONS : garaGE, meaSure, diviSion
        };
        
        // rate of speech
        public static SPEECH_RATE = [150, 100, 50];
        public static SLOW = 0;
        public static NORMAL_RATE = 1;
        public static FAST = 2;
              
        // duration ratios, see http://vis.berkeley.edu/courses/cs294-10-fa13/wiki/index.php/A2-WendyDeheer
        private static DURATION = [1.9, 1.5, 1.0, .75, .409]; // when multiplied by SPEECH_RATE[NORMAL_RATE], 100 = 190, 150, 100, 75, 40.9 
        private static REST     = [450, 300, 150]; // absolute values for rest

        // loudness
        public static VOICE_LEVEL = [0.5, 0.8, 1.0];
        public static WHISPER = 0;
        public static TALK    = 1;
        public static SHOUT   = 2;
        
        // arpabet+ statics
        public  static RATE = "^";
        public  static LOUDNESS = "!";
        public  static MOOD = "+";
        public  static CENSORED = "#";
        
        public censoringReqd : boolean;
        public deformations = Array<ReferenceDeformation>();
        public censored     = Array<ReferenceDeformation>();
        public censoredDur  = Array<number>(); // pairs of durations to change bleeps
        
        public totalDuration : number = 0;

        /**
         * @param {string} sentence - Arpabet+ encoded string with what to say
         * @param {string} phonemeSeparator - single character to use to split the sentence into individual letters, default: ' '
         */
        public constructor(sentence: string, phonemeSeparator = " ") {
            var speechRate = Sentence.NORMAL_RATE;
            var loudness = Sentence.TALK;
            var mood = 0;
            var censoring = false;

            this.deformations = new Array<ReferenceDeformation>();
            this.censoringReqd = sentence.indexOf(Sentence.CENSORED) !== -1;
            if (this.censoringReqd){
                this.censored = new Array<ReferenceDeformation>();
                this.censoredDur = new Array<number>();
            }
            
            var letters = sentence.split(phonemeSeparator);
            for (var i = 0; i < letters.length; i++){
                var letter = letters[i];
                var lastLetterIdx = Sentence.getLastLetterIdx(letter);
                if (lastLetterIdx === -1) throw "No letters found in symbol: '" + letter + "'";
            
                var code = letter.substring(0, lastLetterIdx + 1);
                var phoneme : Phoneme = Sentence.ARPABET_DICT[code];
                if (typeof phoneme === "undefined"){
                    continue;
                } 

                // duration
                var idx = letter.indexOf(Sentence.RATE);
                if (idx !== -1){
                    switch (letter.charAt(idx + 1)){
                        case '0': speechRate = 0; break;
                        case '1': speechRate = 1; break;
                        case '2': speechRate = 2; break;
                    }
                }
                var duration = Sentence.SPEECH_RATE[speechRate] * Sentence.DURATION[phoneme.durationIdx];
                if (code === '.') duration = Sentence.REST[speechRate];
                duration = duration * 1.5; // bonus duration; take out
            
                // loudness
                var loudness : number;
                idx = letter.indexOf(Sentence.LOUDNESS);
                if (idx !== -1){
                    switch (letter.charAt(idx + 1)){
                        case '0': loudness = 0; break;
                        case '1': loudness = 1; break;
                        case '2': loudness = 2; break;
                    }
                }
            
                // do not assign to a direct reference to Voice.VISEMES; copy as below
                var endStateRatios = [
                    Sentence.VISEMES[phoneme.visemeIdx][0] * Sentence.VOICE_LEVEL[loudness],
                    Sentence.VISEMES[phoneme.visemeIdx][1] * Sentence.VOICE_LEVEL[loudness],
                    Sentence.VISEMES[phoneme.visemeIdx][2] * Sentence.VOICE_LEVEL[loudness]
                ];
                
                // mood
                idx = letter.indexOf(Sentence.MOOD);
                if (idx !== -1){
                    switch (letter.charAt(idx + 1)){
                        case '0': mood = 0; break;
                        case '1': mood = 1; break;
                        case '2': mood = 2; break;
                        case '3': mood = 3; break;
                        case '4': mood = 4; break;
                        case '5': mood = 5; break;
                    }
                }
                
                var uncensoredVersion = new ReferenceDeformation(Sentence._MOUTH, Sentence._BASIS, Sentence._MOUTH_KEYS, duration, 0, endStateRatios, null, null, phoneme.pace);
                this.deformations.push(uncensoredVersion);
                
                // censoring
                if (this.censoringReqd){
                    // when this letter has censor suffix, toggle censoring
                    if (letter.indexOf(Sentence.CENSORED) !== -1 || censoring){
                        if (!censoring){
                            censoring = true;
                            this.censored.push(new ReferenceDeformation(Sentence._MOUTH, Sentence._BASIS, Sentence._MOUTH_KEYS, 1, 0, Sentence.VISEMES[10]) ); // to rest immediately
                            this.censoredDur.push(this.totalDuration - duration);
                    
                        }else if (letter.indexOf(Sentence.CENSORED) !== -1){
                            censoring = false;
                            this.censoredDur.push(this.totalDuration + duration);  // enclusive the the duration of this letter
                        }
                        this.censored.push(new DeformStall(Sentence._MOUTH, duration) );
                    
                   }else{
                        this.censored.push(uncensoredVersion);
                    }
                }
                this.totalDuration += duration;
            }
            if (this.censoringReqd) console.log("cendored dur " + this.censoredDur + ", totalDuration " + this.totalDuration);
            Object.freeze(this);  // make immutable
        } 
                     
        /**
         * Determine the last alphabet character of the arpabet+ encoded letter
         * @param {string} letterWithSuffixes - Arpabet+ encoded letter
         */
        private static getLastLetterIdx(letterWithSuffixes: string) : number{
            var ret = 0;
            var code;
            for (; ret < letterWithSuffixes.length; ret++){
                code = letterWithSuffixes.charCodeAt(ret);
                 if ((code < 65 || code > 90) && code !== 46) break; // < A, or > Z, and not .
            }
            return ret - 1;
        }
        
        /**
         * Convenience method for the voice recorder webpage, to embed the '+' values of the sliders into the first raw arpabet letter
         * @param {string} sentence - Arpabet+ encoded string with what to say
         * @param {string} indicator - the code of the '+' variable to embed:  RATE, LOUDNESS, MOOD, CENSORED
         * @param {number} value - the value for this indicator to take
         */
        public static embedAtFirstLetter(sentence : string, indicator : string, value : number) : string {
            var idx = sentence.indexOf('_');
            var first : string;
            var rest  : string = "";
            if (idx !== -1){
                first = sentence.substring(0, idx);
                rest  = sentence.substring(idx);
                
            } else first = sentence;
            
            idx = first.indexOf(indicator);
            if (idx !== -1){
                first = first.substring(0, idx) + indicator + value + first.substring(idx + 2);
            
            }else first = first + indicator + value;
            
            return first + rest;
        } 
    }

    export class Voice {
        /**
         * Not sure what this class may become.  Maybe a sub-class of MORPH.Mesh.
         * @param {MORPH.Mesh} mesh - the object to compile shape keys & say sentences for
         */
        constructor(private mesh : Mesh) { } 
    
        /**
         * pre-make all the shapekey targets (vertex positions & normals) for smoother execution when talking
         */
        public compileAll() : void{
            this.compile(Sentence.WHISPER);
            this.compile(Sentence.TALK);
            this.compile(Sentence.SHOUT);
        }
        
        /**
         * pre-make all the shapekey targets (vertex positions & normals) for a given LOUDNESS,  need to account for mood next release
         * @param {number} loudness - The index into Sentence.VOICE_LEVEL to multiply each of the VISMES by.
         */
        public compile(loudness : number) : void{
            var mouth = this.mesh.getShapeKeyGroup(Sentence._MOUTH);
            
            // do each VISEMES, except 10, rest
            for (var i = Sentence.VISEMES.length - 2; i >= 0; i--){
               var endStateRatios = [
                   Sentence.VISEMES[i][0] * Sentence.VOICE_LEVEL[loudness],
                   Sentence.VISEMES[i][1] * Sentence.VOICE_LEVEL[loudness],
                   Sentence.VISEMES[i][2] * Sentence.VOICE_LEVEL[loudness]
               ];
                mouth.addComboDerivedKey(Sentence._BASIS, Sentence._MOUTH_KEYS, endStateRatios);
            }
        }

        /**
         * Direct the mesh to deform to say the sentence.
         * Todo:  add code to initiate sound from BABYLON web audio system
         *
         * @param {MORPH.Sentence} sentence - Compile sentence to queue
         * @param {boolean} ignoreCensor - indicate to use the non-censored version, default false, no meaning if no '#'s in sentence 
         */
        public say(sentence : Sentence, ignoreCensor = false) :void{
            this.mesh.queueEventSeries(new EventSeries((!sentence.censoringReqd || ignoreCensor) ? sentence.deformations : sentence.censored) );
        }       
    }
}
