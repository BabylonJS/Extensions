module QI {
    /** has its origins from:  http://bytearray.org/wp-content/projects/WebAudioRecorder/ */
    export class AudioRecorder{
        public initialized = false;  // set in prepMic; will remain false if WebAudio or navigator.getUserMedia not supported
        public playbackReady = false;
        public recording = false;

        private _requestedDuration : number;
        private _startTime : number;
        private _completionCallback : () => void;
        private _dynamicStartCallBack : () => void;
        private _dynamicStart : boolean;

        // arrays of FloatArrays made during recording
        private _leftchannel  = new Array<Float32Array>();
        private _rightchannel = new Array<Float32Array>();

        // consolidated versions of the buffer, after recording for playback or written to .WAV
        private _leftBuffer  : Float32Array;
        private _rightBuffer : Float32Array;

        private _recorder : ScriptProcessorNode = null;
        private _recordingLength = 0;
        private _volume : GainNode = null;
        private _audioInput = null;

        private static _objectUrl : string;
        private static _instance : AudioRecorder;
        private static _startThreshold = 0.05;

        /**
         * static function to return a AudioRecorder instance, if supported.  Single instance class.
         * @param {() => void} doneCallback - callback to return when successfully complete (optional)
         */
        public static getInstance(doneCallback? : () => void) : AudioRecorder {
            if (AudioRecorder._instance) return AudioRecorder._instance;

            AudioRecorder._instance = new AudioRecorder();
            AudioRecorder._instance._completionCallback = doneCallback ? doneCallback : null;

            if (!BABYLON.Engine.audioEngine.canUseWebAudio) {
                window.alert('QI.AudioRecorder: WebAudio not supported');
                return AudioRecorder._instance;
            }

            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            if((navigator.mediaDevices && navigator.mediaDevices.getUserMedia) || navigator.getUserMedia) {
                var getUserMedia = navigator.mediaDevices && navigator.mediaDevices.getUserMedia ?
                    navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices) :
                    function (constraints) {
                        return new Promise(function (resolve, reject) {
                            navigator.getUserMedia(constraints, resolve, reject);
                        });
                    };

                getUserMedia({audio: true})
                     .then (function (streamReceived) { AudioRecorder.prepMic(streamReceived); })
                     .catch(function (reportError   ) { window.alert('QI.AudioRecorder: Error initializing audio capture:\n\t' + reportError + '\nNote: Firefox errors when mic not plugged in.'); });

            } else {
                window.alert('QI.AudioRecorder: Navigator.getUserMedia not supported.');
            }

            return AudioRecorder._instance;
        }

        /**
         * static because it is in a callback for navigator.getUserMedia()
         */
        private static prepMic(stream : any) : void {
            var instance = AudioRecorder._instance;
            var context = BABYLON.Engine.audioEngine.audioContext;

            // assign a gain node
            instance._volume = context.createGain(); //instance.audioEngine.masterGain;

            // creates an audio node from the microphone incoming stream
            instance._audioInput = context.createMediaStreamSource(stream);

            // connect the stream to the gain node
            instance._audioInput.connect(instance._volume);

            /* From the spec: This value controls how frequently the audioprocess event is
            dispatched and how many sample-frames need to be processed each call.
            Lower values for buffer size will result in a lower (better) latency.
            Higher values will be necessary to avoid audio breakup and glitches */
            var bufferSize = 2048;
            instance._recorder = context.createScriptProcessor(bufferSize, 2, 2);

            // cannot reference using 'this' inside of callback
            instance._recorder.onaudioprocess = function(e) {
                if (!instance.recording) return;
                
                var evt = <AudioProcessingEvent> e;
                var left  = evt.inputBuffer.getChannelData (0);
                var right = evt.inputBuffer.getChannelData (1);
                if (instance._dynamicStart) {
                    var max = Number.MIN_VALUE;
                    // check to see if talking detected, using left channel
                    for (var i = 0; i < 2048; i++) {
                        if (max < left[i])
                            max = left[i];
                        if (Math.abs(left[i]) > AudioRecorder._startThreshold) {
                            instance._startTime = BABYLON.Tools.Now;
                            instance._dynamicStartCallBack();
                            instance._dynamicStart = false;
                            break;
                        }
                    } 
                    // when now no-longer dynamic start, must have been activated, else return
                    if (instance._dynamicStart) return;
                }
                // we clone the samples
                instance._leftchannel .push (new Float32Array (left));
                instance._rightchannel.push (new Float32Array (right));
                instance._recordingLength += bufferSize;

                // determine if the duration required has yet occurred
                if (instance._requestedDuration !== Number.MAX_VALUE && BABYLON.Tools.Now - instance._requestedDuration >= instance._startTime) instance.recordStop();
            };

            // we connect the recorder
            instance._volume.connect (instance._recorder);
            instance._recorder.connect (context.destination);
            instance.initialized = true;

            // let webpage enable controls accordingly
           if (instance._completionCallback) {
               instance._completionCallback();
               instance._completionCallback = null;
           }
        }
        // ==================================== Recording Methods ====================================
        /**
         * Begin recording from the microphone
         * @param {number} durationMS- Length to record in millis (default Number.MAX_VALUE).
         * @param {() => void} doneCallback - Function to call when recording has completed (optional).
         * @param {() => void} dynamicStartCallBack - Presence indicates to same until speech begins. Function to call when recording has really started (optional).
         */
        public recordStart(durationMS = Number.MAX_VALUE, doneCallback? : () => void, dynamicStartCallBack? : () => void) : void {
            if (this.recording) { BABYLON.Tools.Warn('QI.AudioRecorder: already recording'); return; }
            this._requestedDuration = durationMS;
            this._startTime = BABYLON.Tools.Now;
            this._completionCallback = doneCallback ? doneCallback : null;
            
            this._dynamicStartCallBack = dynamicStartCallBack ? dynamicStartCallBack : null;
            this._dynamicStart = this._dynamicStartCallBack !== null;

            this.clean();            
            this.recording = true;
        }

        /**
         * Stop mic recording.  Called the onaudioprocess() when time expires.  Called actively when a
         * duration was not specified with recordStart().
         */
        public recordStop() : void {
            if (!this.recording) {BABYLON.Tools.Warn('QI.AudioRecorder: recordStop when not recording'); return; }
            this.recording = false;
            // we flatten the left and right channels down
            this._leftBuffer  = this._mergeBuffers (this._leftchannel );
            this._rightBuffer = this._mergeBuffers (this._rightchannel);
            this.playbackReady = true;

            this.clean(false);
            if (this._completionCallback) this._completionCallback();
        }

        /**
         * recording uses multiple buffers, each pushed onto an array.  This is called for each channel,
         * at the end of the recording, to combine them all into 1.
         * @param {Float32Array[]} channelBuffers- The recording buffers of either left or right channel.
         * @returns {Float32Array} combined data.
         */
        private _mergeBuffers(channelBuffers : Float32Array[]) : Float32Array {
            var result = new Float32Array(this._recordingLength);
            var offset = 0;
            var lng = channelBuffers.length;
            for (var i = 0; i < lng; i++) {
                var buffer = channelBuffers[i];
                result.set(buffer, offset);
                offset += buffer.length;
            }
            return result;
        }

        /**
         * Delete buffers
         * @param {boolean} fullReset- Make no-longer playback ready (default true).
         */
        public clean(fullReset = true) : void {
            // reset all the during recording buffers at the end of a recording.
            this._leftchannel.length = this._rightchannel.length = 0;
            this._recordingLength = 0;

            if (fullReset) {
                // delete previous merged buffers, if they exist
                this._leftBuffer = this._rightBuffer = null;
                this.playbackReady = false;
            }
        }
        // ==================================== Playback Methods =====================================
        /**
         * play recorded sound from internal buffers
         * @param {number} downSampling - should either be 1, 2, or 4 (default 1)
         * @param {number} begin - sample in audio to start at (default 0)
         * @param {number} end - last sample + 1 in audio to use (audio length)
         */
        public playback(downSampling = 1, begin = 0, end? : number) : void {
            var newBuffer = this.getAudioBuffer(downSampling, begin, end);
            if (!newBuffer) return;

            var context = BABYLON.Engine.audioEngine.audioContext;
            var newSource = context.createBufferSource();
            newSource.buffer = newBuffer;
            newSource.connect(context.destination);
            newSource.start(0);
        }

        /**
         * play sound from an external buffer
         * @param {AudioBuffer} audio - The external bufer
         * @param {number} downSampling - should either be 1, 2, or 4 (default 1)
         * @param {number} begin - sample in audio to start at (default 0)
         * @param {number} end - last sample + 1 in audio to use (audio length)
         */
        public static playbackExternal(audio : AudioBuffer, downSampling = 1, begin = 0, end? : number) : void {
            if (!end) end = audio.getChannelData(0).length;
            var stereo = audio.numberOfChannels > 1;

            var leftBuffer = AudioRecorder._downSampling(audio.getChannelData(0).slice(begin, end), downSampling);
            var rightBuffer = stereo ? AudioRecorder._downSampling(audio.getChannelData(1).slice(begin, end), downSampling) : null;
            var length = leftBuffer.length;
            var sampleRate = audio.sampleRate / downSampling;

            var context = BABYLON.Engine.audioEngine.audioContext;
            audio = context.createBuffer(stereo ? 2 : 1, leftBuffer.length, sampleRate);

            audio.getChannelData(0).set(leftBuffer );
            if (stereo) audio.getChannelData(1).set(rightBuffer);

            var newSource = context.createBufferSource();
            newSource.buffer = audio;
            newSource.connect(context.destination);
            newSource.start(0);
        }

        /**
         * let it be known how many samples are in a recording
         * @returns{number}
         */
        public getNSamples() : number {
            return this._leftBuffer ? this._leftBuffer.length : 0;
        }

        /**
         * Get the mic recorded data in the form of an AudioBuffer.  This can then be put into a
         * BABYLON.Sound via setAudioBuffer().  Also used internally, so can have .WAV / .TS methods work
         * from either an external sound or mic.
         * @param {number} downSampling - should either be 1, 2, or 4 (default 1)
         * @param {number} begin - sample in audio to start at (default 0)
         * @param {number} end - last sample + 1 in audio to use (audio length)
         * @returns {AudioBuffer}
         */
        public getAudioBuffer(downSampling = 1, begin = 0, end? : number) : AudioBuffer {
            if (!this.playbackReady) {BABYLON.Tools.Warn('QI.AudioRecorder: playback when not playbackReady'); return null; }

            var leftBuffer  : Float32Array;
            var rightBuffer : Float32Array;

            if (begin === 0 && !end) {
                leftBuffer  = AudioRecorder._downSampling(this._leftBuffer, downSampling);
                rightBuffer = AudioRecorder._downSampling(this._rightBuffer, downSampling);

            } else {
                // adjust args
                if (!end) end = this._leftBuffer.length;

                leftBuffer  = AudioRecorder._downSampling(this._leftBuffer .slice(begin, end), downSampling);
                rightBuffer = AudioRecorder._downSampling(this._rightBuffer.slice(begin, end), downSampling);
            }
            
            var context = BABYLON.Engine.audioEngine.audioContext;
            var ret = context.createBuffer(2, leftBuffer.length, context.sampleRate / downSampling);

            ret.getChannelData(0).set(leftBuffer );
            ret.getChannelData(1).set(rightBuffer);
            return ret;
        }
        // ==================================== To Script Methods ====================================
        /** revoke the last temp url */
        private static _cleanUrl() : void {
            if (AudioRecorder._objectUrl) {
                (window.webkitURL || window.URL).revokeObjectURL(AudioRecorder._objectUrl);
                AudioRecorder._objectUrl = null;
            }
        }

        /**
         * Save the last mircorphone recording as an inline Typescript or Javascript function string
         * @param {string} sndName - The name to give the sound, also the name of the function, and the filename
         * @param {boolean} stereo - 2 channels when true (default true)
         * @param {number} downSampling - should either be 1, 2, or 4 (default 1)
         * @param {boolean} typeScript - Style of function to build, Typescript when True (default), else Javascript
         * @param {number} begin - sample in audio to start at (default 0)
         * @param {number} end - last sample + 1 in audio to use (audio length)
         */
        public micToScript(sndName : string, stereo = true, downSampling = 1, typeScript = false, begin = 0, end? : number) : void {
            // not calling getAudioBuffer with args, since passed to & processed by saveToScript()
            AudioRecorder.saveToScript(sndName, this.getAudioBuffer(), stereo, downSampling, typeScript, begin, end);
        }

        /**
         * Save an audio buffer into an inline Typescript or Javascript function string
         * @param {string} sndName - The name to give the sound, also the name of the function, and the filename
         * @param {AudioBuffer} audio - buffer to encode
         * @param {boolean} stereo - 2 channels when true & audio has more than 1 channel (default true)
         * @param {number} downSampling - should either be 1, 2, or 4 (default 1)
         * @param {boolean} typeScript - Style of function to build, Typescript when True (default), else Javascript
         * @param {number} begin - sample in audio to start at (default 0)
         * @param {number} end - last sample + 1 in audio to use (audio length)
         */
        public static saveToScript(sndName : string, audio : AudioBuffer, stereo = true, downSampling = 1, typeScript = false, begin = 0, end? : number) : void {
            AudioRecorder._cleanUrl();

            if (sndName.length === 0) {
                window.alert('QI.AudioRecorder: No name specified');
                return;
            }

            else if (sndName.indexOf('.') !== -1) {
                window.alert('QI.AudioRecorder: Dot not allowed in a function name');
                return;
            }

            var filename = sndName + (typeScript ? '.ts': '.js');

            var blob = new Blob ( [ AudioRecorder._getScriptSource(sndName, audio, stereo, downSampling, typeScript, begin, end) ], { type : 'text/plain;charset=utf-8' } );

            // turn blob into an object URL; saved as a member, so can be cleaned out later
            AudioRecorder._objectUrl = (window.webkitURL || window.URL).createObjectURL(blob);

            var link = window.document.createElement('a');
            link.href = AudioRecorder._objectUrl;
            link.download = filename;
            var click = document.createEvent('MouseEvents');
            click.initEvent('click', true, false);
            link.dispatchEvent(click);
        }

        /**
         * Encode an audio buffer into an inline Typescript or Javascript function string
         * @param {string} sndName - The name to give the sound, and also the name of the function
         * @param {AudioBuffer} audio - buffer to encode
         * @param {boolean} stereo - 2 channels when true & audio has more than 1 channel
         * @param {number} downSampling - should either be 1, 2, or 4
         * @param {boolean} typeScript - Style of function to build, Typescript when True, else Javascript
         * @param {number} begin - sample in audio to start at
         * @param {number} end - last sample + 1 in audio to use (audio length)
         * @returns {string} - in-line source code
         */
        private static _getScriptSource(sndName : string, audio : AudioBuffer, stereo : boolean, downSampling : number, typeScript : boolean, begin : number, end? : number) : string {
            // adjust args
            if (!end) end = audio.getChannelData(0).length;
            stereo = stereo && audio.numberOfChannels > 1;

            var leftBuffer = AudioRecorder._downSampling(audio.getChannelData(0).slice(begin, end), downSampling);
            var rightBuffer = stereo ? AudioRecorder._downSampling(audio.getChannelData(1).slice(begin, end), downSampling) : null;
            var length = leftBuffer.length;
            var sampleRate = audio.sampleRate / downSampling;

            var ret = typeScript ? 'export function ' + sndName + '(scene: BABYLON.Scene) : BABYLON.Sound {\n' : 
                                   'function ' + sndName + '(scene) {\n';

            ret += '    var context = BABYLON.Engine.audioEngine.audioContext;\n';
            ret += '    var audioBuffer = context.createBuffer(' + (stereo ? 2 : 1) + ', ' + length + ', ' + sampleRate + ');\n';

            ret += '    audioBuffer.getChannelData(0).set(QI.decode16Bit(\"' + AudioRecorder._floatTo16BitIntBase64(leftBuffer) + '\") );\n';
            if (stereo){
                ret += '    audioBuffer.getChannelData(1).set(QI.decode16Bit(\"' +  AudioRecorder._floatTo16BitIntBase64(rightBuffer) + '\") );\n';
            }
            ret += '    var snd = new BABYLON.Sound("' + sndName + '", null, scene);\n';
            ret += '    snd.setAudioBuffer(audioBuffer);\n';
            ret += '    return snd;\n';
            ret +=  '}\n';
            return ret;
        }

        /**
         * encode a float array with values (-1 to 1) as BASE 64 string, after converting to a short int (16 bit)
         */
        private static _floatTo16BitIntBase64(array : Float32Array) : string {
            var binary = '';
            for (var i = 0, len = array.length; i < len; i++) {
                binary += AudioRecorder._to16Bit(array[i]);
            }
            return window.btoa(binary);
        }
        
        private static _to16Bit(val : number) : string {
            var asShort = (val * 0x7FFF) & 0xFFFF;  // convert to: -32,768 - 32,767, then truncate
            var binary = String.fromCharCode((asShort & 0xFF00) >> 8); // append high order byte
            binary += String.fromCharCode( asShort & 0x00FF);       // append low  order byte
            return binary;
        }
        
/*        private static _to8Bit(val : number) : string {
             var asByte = (val * 0x7F) & 0xFF;  // convert to: -128 - 127, then truncate
             return String.fromCharCode(asByte);
        } 
*/
        // ====================================== To Wav Methods =====================================
        /**
         * Save the last mircorphone recording as a WAV file
         * @param {string} filename - valid file name (no path), & optional extension (added if missing)
         * @param {boolean} stereo - 2 channels when true (default true)
         * @param {number} downSampling - should either be 1, 2, or 4 (default 1)
         * @param {number} begin - sample in audio to start at (default 0)
         * @param {number} end - last sample + 1 in audio to use (audio length)
         */
        public micToWAV(filename : string, stereo = true, downSampling = 1, begin = 0, end? : number) : void {
            AudioRecorder.saveToWAV(filename, this.getAudioBuffer(), stereo, downSampling, begin, end);
        }

        /**
         * Save an audio buffer as a WAV file
         * @param {string} filename - valid file name (no path), & optional extension (added if missing)
         * @param {AudioBuffer} audio - buffer to save
         * @param {boolean} stereo - 2 channels when true & audio has more than 1 channel (default true)
         * @param {number} downSampling - should either be 1, 2, or 4 (default 1)
         * @param {number} begin - sample in audio to start at (default 0)
         * @param {number} end - last sample + 1 in audio to use (audio length)
         */
        public static saveToWAV(filename : string, audio : AudioBuffer, stereo = true, downSampling = 1, begin = 0, end? : number) : void {
            if (filename.length === 0) {
                window.alert('QI.AudioRecorder: No name specified');
                return;
            }
            else if (filename.toLowerCase().lastIndexOf('.wav') !== filename.length - 4 || filename.length < 5) {
                filename += '.wav';
            }

            var blob = new Blob ( [ AudioRecorder._encodeWAV(audio, stereo, downSampling, begin, end) ], { type : 'audio/wav' } );

            // turn blob into an object URL; saved as a member, so can be cleaned out later
            AudioRecorder._objectUrl = (window.webkitURL || window.URL).createObjectURL(blob);

            var link = window.document.createElement('a');
            link.href = AudioRecorder._objectUrl;
            link.download = filename;
            var click = document.createEvent('MouseEvents');
            click.initEvent('click', true, false);
            link.dispatchEvent(click);
        }

        /**
         * Encode an audio buffer into a WAV formatted DataView
         * @param {AudioBuffer} audio - buffer to encode
         * @param {boolean} stereo - 2 channels when true & audio has more than 1 channel
         * @param {number} downSampling - should either be 1, 2, or 4
         * @param {number} begin - sample in audio to start at
         * @param {number} end - last sample + 1 in audio to use (audio length)
         * @returns {DataView} - WAV formatted
         */
        private static _encodeWAV(audio : AudioBuffer, stereo : boolean, downSampling : number, begin : number, end? : number) : DataView {
            // adjust args
            if (!end) end = audio.getChannelData(0).length;
            stereo = stereo && audio.numberOfChannels > 1;

            var leftBuffer = AudioRecorder._downSampling(audio.getChannelData(0).slice(begin, end), downSampling);
            var rightBuffer = stereo ? AudioRecorder._downSampling(audio.getChannelData(1).slice(begin, end), downSampling) : null;
            var sampleRate = audio.sampleRate / downSampling;

            // interleave both channels together, if stereo
            var interleaved = stereo ? AudioRecorder._interleave(leftBuffer, rightBuffer) : leftBuffer;
            var dataSize = interleaved.length * 2;  // 2 bytes per byte to also include volume with each
            var headerSize = 44;
            var nChannels = stereo ? 2 : 1;
            var blockAlign = nChannels * 2;

            var buffer = new ArrayBuffer(headerSize + dataSize);
            var view = new DataView(buffer);

            // - - - - - - RIFF chunk (chunkID, chunkSize, data)
            AudioRecorder._writeUTFBytes(view, 0, 'RIFF');
            view.setUint32(4, headerSize + dataSize, true);
            AudioRecorder._writeUTFBytes(view, 8, 'WAVE');

            // - - - - - - FMT inner-chunk (chunkID, chunkSize, data)
            AudioRecorder._writeUTFBytes(view, 12, 'fmt ');
            view.setUint32(16, 16, true);  // size of FMT inner-chunk

            // format WAVEFORMATEX, http://msdn.microsoft.com/en-us/library/windows/desktop/dd390970%28v=vs.85%29.aspx
            view.setUint16(20, 1, true); // WAVEFORMATEX
            view.setUint16(22, nChannels, true);
            view.setUint32(24, sampleRate, true);
            view.setUint32(28, sampleRate * blockAlign, true); // nAvgBytesPerSec
            view.setUint16(32, blockAlign, true);
            view.setUint16(34, 16, true); // bits per sample (same for mono / stereo, since stereo is 2 samples)

            // - - - - - - data inner-chunk (chunkID, chunkSize, data)
            AudioRecorder._writeUTFBytes(view, 36, 'data');
            view.setUint32(40, dataSize, true);

            // write the PCM samples
            var lng = interleaved.length;
            var index = headerSize;
            var volume = 1;
            // write each byte of data + volume byte
            for (var i = 0; i < lng; i++) {
                view.setInt16(index, interleaved[i] * (0x7FFF * volume), true);
                index += 2;
            }
            return view;
        }

        /**
         * encode a text string into a dataview as 8 bit characters
         * @param {DataView} view- DataView to update
         * @param {number} offset- location in view to edit
         * @param {string} str- Values to insert
         */
        private static _writeUTFBytes(view : DataView, offset : number, str : string) : void {
            var lng = str.length;
            for (var i = 0; i < lng; i++) {
                view.setUint8(offset + i, str.charCodeAt(i));
            }
        }
        // ====================================== buffer Methods =====================================
        /**
         * Combine left and right channels, alternating values, returned in a new Array
         */
        private static _interleave(left : Float32Array, right : Float32Array) : Float32Array {
            var length = left.length + right.length;
            var result = new Float32Array(length);

            var inputIndex = 0;

            for (var index = 0; index < length; ) {
                result[index++] = left [inputIndex];
                result[index++] = right[inputIndex];
                inputIndex++;
            }
            return result;
        }
        
        private static _downSampling(buf : Float32Array, factor : number) : Float32Array {
            if (factor === 1) return buf;
            
            var length = Math.floor(buf.length / factor);
            var result = new Float32Array(length);

            for (var i = 0, j = 0; i < length * factor; i += factor, j++) {
                result[j] = buf[i];
            }
            return result;
        }            
    }
}